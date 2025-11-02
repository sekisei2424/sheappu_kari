import { supabase } from '../supabase/client';


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

// ------------------------------------------------------------------
// 1. メッセージ送信 (Create)
// ------------------------------------------------------------------
export const createMessage = async (
  senderId: string,
  recipientId: string,
  body: string,
  listingId: string | null = null,
  isApplication: boolean = false
) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: senderId,
        recipient_id: recipientId,
        body: body,
        related_listing_id: listingId,
        is_application: isApplication
      }
    ])
    .select();
  return { data, error };
};

// ------------------------------------------------------------------
// 2. 会話履歴の取得 (Read Conversation)
// ------------------------------------------------------------------
export const getConversation = async (userId1: string, userId2: string): Promise<{ data: Message[] | null, error: any }> => {
  const selectQuery = '*, sender:sender_id(name), recipient:recipient_id(name)';

  const { data, error } = await supabase
    .from('messages')
    .select(selectQuery)

    // ★修正適用: JSON論理結合を使用 (単一行で構文エラーを回避)
    .or(`and(sender_id.eq.${userId1}, recipient_id.eq.${userId2}),and(sender_id.eq.${userId2}, recipient_id.eq.${userId1})`)

    .order('created_at', { ascending: true }) as { data: Message[] | null, error: any };

  return { data, error };
};

// ------------------------------------------------------------------
// 3. 募集IDの取得 (Get Latest Listing ID)
// ------------------------------------------------------------------
export const getLatestListingIdFromConversation = async (userId1: string, userId2: string) => {

  // 実行されていないマルチラインの変数（filterQuery, simplifiedFilter）を削除しました。

  const { data, error } = await supabase
    .from('messages')
    .select('related_listing_id')

    // ★実行中の正しいクエリ（単一行）のみを維持★
    .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2},is_application.eq.true,related_listing_id.not.is.null),and(sender_id.eq.${userId2},recipient_id.eq.${userId1},is_application.eq.true,related_listing_id.not.is.null)`)

    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return { listingId: null };

  return { listingId: data.related_listing_id };
}

// ------------------------------------------------------------------
// 4. アプリケーションメッセージの作成 (Create Application Message)
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// 5. 会話リストの取得 (Get Conversations List)
// ------------------------------------------------------------------
export const getConversationsList = async (currentUserId: string) => {
  // ユーザーが sender または recipient であるすべてのメッセージを取得
  // supabase の select で複雑なエイリアスを使うと TypeScript のチェーン上で型アサーションが
  // チェーンを壊すことがあるため、一旦レスポンスを受け取ってからアサーションします。
  const res = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(id, name),
      recipient:recipient_id(id, name)
    `)
    .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
    .order('created_at', { ascending: false }); // 最新が上にくるように並び替え

  const { data: messages, error } = res as { data: any[] | null, error: any };

  if (error) return { data: null, error };

  // data が null の可能性を排除する（空配列として扱う）
  if (!messages) return { data: [], error: null };

  // クライアント側で会話をグループ化し、最新メッセージと相手を特定
  const conversations: { [key: string]: any } = {};
  const msgs = (messages as unknown as Message[]) || [];

  msgs.forEach((message) => {
    // 会話相手のIDを特定
    const otherUserId = message.sender?.id === currentUserId ? message.recipient?.id : message.sender?.id;

    // 会話キーを作成 (sender/recipient のUUIDをソートして結合)
  const conversationKey = [message.sender?.id, message.recipient?.id].filter(Boolean).sort().join('_');

    // その会話の最新メッセージを保持
    if (!conversations[conversationKey]) {
      conversations[conversationKey] = {
        latestMessage: message,
        otherUser: message.sender?.id === currentUserId ? message.recipient : message.sender,
        unreadCount: 0 // 未読管理は別途ロジックが必要
      };
    }
  });

  // オブジェクトの値を配列に変換して返す
  return { data: Object.values(conversations), error: null };
};