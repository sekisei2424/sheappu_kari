'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client'; 
import { getConversationsList } from '@/lib/crud/messages';

// (型定義は以前のものを使用)
interface ConversationItem {
  latestMessage: {
    body: string;
    created_at: string;
    sender_id: string;
    is_application: boolean;
  };
  otherUser: { id: string; name: string };
  unreadCount: number;
}

export default function ConversationListClient() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      // 1. クライアント側で認証情報を取得
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return; 
      }
      setCurrentUserId(userId);

      // 2. ログインユーザーIDを使用して会話リストを取得
      const { data, error } = await getConversationsList(userId);

      if (error) {
        console.error('会話リスト取得エラー:', error);
      } else {
        setConversations(data as ConversationItem[] || []);
      }
      setLoading(false);
    };

    fetchConversations();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-400">メッセージを読み込み中...</div>;
  if (!currentUserId) return <div className="p-6 text-center text-red-500">ログインしていません。</div>;
  
  if (conversations.length === 0) {
    return <div className="p-6 text-center text-gray-500">まだ会話がありません。</div>;
  }

  // (JSX: 会話リストのレンダリングロジックは省略)
  return (
    <div className="bg-gray-900 min-h-screen">
      {conversations.map((conv) => {
        const otherUserId = conv.otherUser.id;
        const latestMsg = conv.latestMessage;
        const sender = latestMsg.sender_id === currentUserId ? 'あなた' : conv.otherUser.name;
        
        return (
          <div
            key={otherUserId}
            className="flex items-center p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => router.push(`/messages/${otherUserId}`)} // ★スレッドへ遷移★
          >
            {/* ... (UI components) ... */}
            <p className="font-semibold text-white">{conv.otherUser.name}</p>
            <p className={`text-sm mt-1 truncate`}>
              {latestMsg.is_application ? `✨ 応募メッセージ (${sender}から)` : `${sender}: ${latestMsg.body}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}