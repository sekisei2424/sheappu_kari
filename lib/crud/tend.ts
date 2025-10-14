import { supabase } from '../supabase/client';

// スワイプ操作を記録
export const createSwipe = async (userId: string, experienceId: string, direction: number) => { // IDをstringに
  const { data, error } = await supabase
    .from('tend')
    .insert([
      { user_id: userId, experience_id: experienceId, direction }
    ])
    .select();
  return { data, error };
};

// 特定のユーザーのスワイプ履歴を取得
export const getSwipesByUser = async (userId: string) => { // userIdをstringに
  const { data, error } = await supabase
    .from('tend')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};