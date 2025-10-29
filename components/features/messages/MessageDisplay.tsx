'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getConversation, createMessage } from '@/lib/crud/messages';
// 認証ユーザーID (currentUserId) は実際には Auth から取得しますが、ここではテストのため仮の値を使用
import { supabase } from '@/lib/supabase/client'; 

interface MessageDisplayProps {
  recipientId: string; // 会話相手のID (URLから取得)
}

// -----------------------------------------------------
// ヘルパー関数: AuthからログインユーザーIDを取得 (実際はカスタムフックにすべき)
// -----------------------------------------------------
const getCurrentUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null; // ログインしていない場合は null
}

export default function MessageDisplay({ recipientId }: MessageDisplayProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageBody, setMessageBody] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // -----------------------------------------------------
  // A. メッセージ履歴のフェッチ
  // -----------------------------------------------------
  const fetchMessages = async (userId: string) => {
    setLoading(true);
    // 会話相手（recipientId）と自分（userId）の間のメッセージを取得
    const { data, error } = await getConversation(userId, recipientId);

    if (error) {
      console.error('メッセージ履歴取得エラー:', error);
    } else if (data) {
      setMessages(data);
    }
    setLoading(false);
  };
  
  // -----------------------------------------------------
  // B. 初期ロードとユーザーIDの取得
  // -----------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
        const userId = await getCurrentUserId();
        if (userId) {
            setCurrentUserId(userId);
            fetchMessages(userId);
        } else {
            setLoading(false);
            console.error("ユーザーがログインしていません。メッセージ機能を利用できません。");
        }
    };
    loadData();
  }, [recipientId]); // 会話相手が変わったら再フェッチ

  // -----------------------------------------------------
  // C. メッセージ送信処理
  // -----------------------------------------------------
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || !currentUserId) return;

    setMessageBody(''); // 入力フィールドをクリア

    // 通常メッセージを送信 (relatedListingId, isApplication はデフォルト値のまま)
    const { error } = await createMessage(currentUserId, recipientId, messageBody.trim());

    if (error) {
      console.error('メッセージ送信失敗:', error);
    } else {
      // 送信成功後、リストを更新（リアルタイム機能がないため手動で再フェッチ）
      fetchMessages(currentUserId);
    }
  };

  if (loading) return <div className="p-4 text-center">メッセージを読み込み中...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* メッセージ履歴の表示エリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs p-3 rounded-xl shadow-md ${
                msg.sender_id === currentUserId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm font-semibold">{msg.sender?.name || '不明なユーザー'}</p>
              <p>{msg.body}</p>
              <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* メッセージ入力フォーム */}
      <div className="border-t border-gray-300 p-4 bg-white sticky bottom-0">
        <form onSubmit={handleSend} className="flex space-x-3">
          <input
            type="text"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!currentUserId}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400"
            disabled={!messageBody.trim() || !currentUserId}
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
}