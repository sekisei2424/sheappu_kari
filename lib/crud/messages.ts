import { supabase } from '../supabase/client';

// メッセージを送信
export const createMessage = async (senderId: string, recipientId: string, body: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { sender_id: senderId, recipient_id: recipientId, body }
    ])
    .select();
  return { data, error };
};

// 特定の会話履歴を取得
export const getConversation = async (userId1: string, userId2: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`(sender_id.eq.${userId1},recipient_id.eq.${userId2}),(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
    .order('created_at', { ascending: true });
  return { data, error };
};