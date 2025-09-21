import { supabase } from '../supabase/client';

// 参加申し込みを作成
export const createBooking = async (userId: string, experienceId: string) => {
  const { data, error } = await supabase
    .from('booking')
    .insert([
      { user_id: userId, experience_id: experienceId }
    ])
    .select();
  return { data, error };
};

// 特定のお仕事体験の参加申し込みリストを取得
export const getBookingsForExperience = async (experienceId: string) => {
  const { data, error } = await supabase
    .from('booking')
    .select('*, user:user_id(*)')
    .eq('experience_id', experienceId);
  return { data, error };
};

// 参加申し込みを削除
export const deleteBooking = async (id: string) => {
  const { data, error } = await supabase
    .from('booking')
    .delete()
    .eq('id', id)
    .select();
  return { data, error };
};