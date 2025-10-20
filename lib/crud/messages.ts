import { supabase } from '../supabase/client';

/**
 * メッセージを送信し、オプションで募集に紐づける
 * @param senderId 送信者プロフィールID (UUID)
 * @param recipientId 受信者プロフィールID (UUID)
 * @param body メッセージ本文
 * @param listingId 関連する募集のID (応募時など)
 * @param isApplication 最初の応募メッセージであるか
 */
export const createMessage = async (
  senderId: string, 
  recipientId: string, 
  body: string, 
  listingId: string | null = null, // 新しい引数
  isApplication: boolean = false // 新しい引数
) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { 
        sender_id: senderId, 
        recipient_id: recipientId, 
        body: body,
        related_listing_id: listingId, // 追加
        is_application: isApplication // 追加
      }
    ])
    .select();
  return { data, error };
};

/**
 * 特定のユーザー間の会話履歴を取得
 * @param userId1 ユーザー1のプロフィールID (UUID)
 * @param userId2 ユーザー2のプロフィールID (UUID)
 */
export const getConversation = async (userId1: string, userId2: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(name),        // プロフィール名を取得
      recipient:recipient_id(name)   // プロフィール名を取得
    `)
    // user1 -> user2、または user2 -> user1 のメッセージを取得
    .or(`(sender_id.eq.${userId1},recipient_id.eq.${userId2}),(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
    .order('created_at', { ascending: true });
    
  return { data, error };
};