import { supabase } from '../supabase/client';


// messages.ts または types/index.ts に追加

// Messageテーブルのレコードの基本構造
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  is_application: boolean;
  related_listing_id: string | null;
  // JOINしたプロフィール情報も含む
  sender: { id: string, name: string } | null;
  recipient: { id: string, name: string } | null;
}

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
export const getConversation = async (userId1: string, userId2: string): Promise<{ data: Message[] | null, error: any }> => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(name),
      recipient:recipient_id(name) 
    `)
    // ... (or クエリは省略)
    .order('created_at', { ascending: true });

  return { data, error };
};

export const getLatestListingIdFromConversation = async (userId1: string, userId2: string) => {
    const { data, error } = await supabase
        .from('messages')
        .select('related_listing_id')
        .or(`sender_id.eq.${userId1},recipient_id.eq.${userId2}),(sender_id.eq.${userId2},recipient_id.eq.${userId1}`)
        .not('related_listing_id', 'is', null) // NULLではないもののみ
        .order('created_at', { ascending: false }) // 最新順
        .limit(1)
        .single();

    if (error || !data) return { listingId: null };

    return { listingId: data.related_listing_id };
}

export const createApplicationMessage = async (
  applicantId: string,
  recipientId: string,
  listingId: string,
  body: string
) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: applicantId,
        recipient_id: recipientId,
        body: body,
        related_listing_id: listingId,
        is_application: true
      }
    ])
    .select();
  return { data, error };
};


export const getConversationsList = async (currentUserId: string) => {
  // ユーザーが sender または recipient であるすべてのメッセージを取得
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
            *,
            sender:sender_id(id, name),
            recipient:recipient_id(id, name)
        `)
    .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
    .order('created_at', { ascending: false }); // 最新が上にくるように並び替え

  if (error) return { data: null, error };

  // クライアント側で会話をグループ化し、最新メッセージと相手を特定
  const conversations: { [key: string]: any } = {};

  messages.forEach((message) => {
    // 会話相手のIDを特定
    const otherUserId = message.sender.id === currentUserId ? message.recipient.id : message.sender.id;

    // 会話キーを作成 (sender/recipient のUUIDをソートして結合)
    const conversationKey = [message.sender.id, message.recipient.id].sort().join('_');

    // その会話の最新メッセージを保持
    if (!conversations[conversationKey]) {
      conversations[conversationKey] = {
        latestMessage: message,
        otherUser: message.sender.id === currentUserId ? message.recipient : message.sender,
        unreadCount: 0 // 未読管理は別途ロジックが必要
      };
    }
  });

  // オブジェクトの値を配列に変換して返す
  return { data: Object.values(conversations), error: null };
};