import { supabase } from '../supabase/client';

// ユーザー所法を作成
export const createUserProfile = async (id: string, name: string, email: string) => {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { id, name, email, is_organizer: false }
    ])
    .select();
  return { data, error };
};

// ユーザー情報を取得
export const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// ユーザー情報を更新
export const updateUserProfile = async (id: string, updateData: { name?: string, is_organizer?: boolean }) => {
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select();
  return { data, error };
};