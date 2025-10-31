// components/features/messages/MessageDisplay.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getConversation, createMessage, getLatestListingIdFromConversation, Message, createMessage as sendSystemMessage } from '@/lib/crud/messages';
import { supabase } from '@/lib/supabase/client';
import ReservationButton from '@/components/features/messages/ReservationButton';
import { getUserProfile } from '@/lib/crud/profiles';

interface MessageDisplayProps {
  recipientId: string; // 会話相手のID (URLから取得)
}

export default function MessageDisplay({ recipientId }: MessageDisplayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageBody, setMessageBody] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 予約ボタンの表示に必要な State
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [listingId, setListingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // -----------------------------------------------------
  // A. 全データフェッチと状態更新 (コアロジック)
  // -----------------------------------------------------
  const fetchAllData = async (userId: string) => {
    setLoading(true);

    // 1. プロフィール情報と企業判別の取得
    const { data: profile } = await getUserProfile(userId);
    const isOrg = profile?.is_organizer || false;
    setIsOrganizer(isOrg);
    console.log(`[DEBUG] 1. Is Organizer? ${isOrg}`);

    // 2. メッセージ履歴の取得
    const { data: convData } = await getConversation(userId, recipientId);
    setMessages(convData || []);

    // 3. 募集IDの取得 (企業の場合のみ必要)
    if (isOrg) {
      const { listingId: fetchedListingId } = await getLatestListingIdFromConversation(userId, recipientId);
      const displayListingId = fetchedListingId || "NULL_NOT_FOUND";
      setListingId(fetchedListingId);

      console.log(`[DEBUG] 2. Fetched Listing ID: ${displayListingId}`);
      console.log(`[DEBUG] 3. Displaying Button: ${isOrg && fetchedListingId}`);
    }

  setLoading(false);
};

// -----------------------------------------------------
// B. 初期ロード: Authとデータフェッチの開始
// -----------------------------------------------------
useEffect(() => {
  const loadAuthAndData = async () => {
    // 1. AuthからログインユーザーIDを取得 (クライアント認証)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    if (userId) {
      setCurrentUserId(userId);
      await fetchAllData(userId); // データフェッチを開始
    } else {
      setLoading(false);
      console.error("ユーザーがログインしていません。");
    }
  };
  loadAuthAndData();
}, [recipientId]);

// -----------------------------------------------------
// C. 予約確定後の更新ロジック (ReservationButton に渡すコールバック)
// -----------------------------------------------------
const handleBookingConfirmed = async () => {
  if (!currentUserId) return;
  // 予約確定通知メッセージの自動送信 (UX向上)
  const confirmationBody = "✅ 予約が正式に確定しました。当日はよろしくお願いします。";
  await sendSystemMessage(currentUserId, recipientId, confirmationBody);

  // メッセージリストをリフレッシュ
  await fetchAllData(currentUserId);
};

// -----------------------------------------------------
// D. スクロールとメッセージ送信
// -----------------------------------------------------
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!messageBody.trim() || !currentUserId) return;

  const bodyToSend = messageBody.trim();
  setMessageBody('');

  const { error } = await createMessage(currentUserId, recipientId, bodyToSend);

  if (error) {
    console.error('メッセージ送信失敗:', error);
    alert('メッセージ送信に失敗しました。');
  } else {
    // 送信成功後、リストを更新
    await fetchAllData(currentUserId);
  }
};

if (loading) return <div className="p-4 text-center text-gray-400 bg-gray-900 h-full">メッセージを読み込み中...</div>;
if (!currentUserId) return <div className="p-4 text-center text-red-500">ログインしていません。</div>;

return (
  <div className="flex flex-col h-[calc(100vh-64px)]">

    {/* 予約ボタンの表示ロジック */}
    {isOrganizer && listingId && (
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <p className="text-sm text-yellow-300 mb-2">この会話は案件募集に紐づいています。</p>
        <ReservationButton
          organizerId={currentUserId}
          applicantId={recipientId}
          listingId={listingId}
          onBookingConfirmed={handleBookingConfirmed} // コールバックを渡す
        />
      </div>
    )}

    {/* メッセージ履歴の表示エリア */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
      {messages.length === 0 && (
        <p className="text-center text-gray-500">まだメッセージはありません。</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs p-3 rounded-xl shadow-md ${msg.sender_id === currentUserId ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
              }`}
          >
            <p className="text-sm font-semibold text-yellow-300">{msg.sender?.name || '不明なユーザー'}</p>
            <p>{msg.body}</p>
            <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    {/* メッセージ入力フォーム */}
    <div className="border-t border-gray-700 p-4 bg-gray-900 sticky bottom-0">
      <form onSubmit={handleSend} className="flex space-x-3">
        <input
          type="text"
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-500"
          disabled={!messageBody.trim() || loading}
        >
          送信
        </button>
      </form>
    </div>
  </div>
);
}