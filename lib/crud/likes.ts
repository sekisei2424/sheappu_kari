import { supabase } from '../supabase/client';

// いいねを作成
export const createLike = async (userId: string, postId: string) => { // experienceId を postId に変更
  const { data, error } = await supabase
    .from('likes')
    .insert([
      // experience_id を post_id に変更
      { user_id: userId, post_id: postId }
    ])
    .select();
  return { data, error };
};

// 投稿のいいね数を取得
export const getLikesCount = async (postId: string) => { // experienceId を postId に変更
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    // 検索カラムを post_id に変更
    .eq('post_id', postId);
  return { count, error };
};

// いいねを削除
export const deleteLike = async (likeId: string) => {
  // 主キーの削除なので変更不要
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('id', likeId)
    .select();
  return { data, error };
};