import { supabase } from '../supabase/client';

// いいねを作成
export const createLike = async (userId: string, experienceId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .insert([
      { user_id: userId, experience_id: experienceId }
    ])
    .select();
  return { data, error };
};

// お仕事体験のいいね数を取得
export const getLikesCount = async (experienceId: string) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('experience_id', experienceId);
  return { count, error };
};

// いいねを削除
export const deleteLike = async (id: string) => {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('id', id)
    .select();
  return { data, error };
};