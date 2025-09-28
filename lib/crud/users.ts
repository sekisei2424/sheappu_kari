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

// ユーザーIDで取得
export const getUserProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq("id", id)
    .single();

  return { data, error };
};

// ユーザー名で取得
export const getUserProfileByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq("username", username.toLowerCase()) // 小文字に統一
    .single();

  return { data, error };
};
