import { supabase } from '../supabase/client';

// **テーブル名: profiles**

// ユーザープロフィールを作成 (Authトリガーで自動挿入されるため、通常は手動で呼ばない)
export const createUserProfile = async (id: string, name: string, email: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { id, name, email, is_organizer: false }
    ])
    .select();
  return { data, error };
};

// ユーザープロフィールを取得
export const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// ユーザープロフィールを更新
export const updateUserProfile = async (id: string, updateData: { name?: string, is_organizer?: boolean, description?: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select();
  return { data, error };
};

// ユーザープロフィールを削除 (Auth連動のため通常は使わない)
export const deleteUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
    .select();
  return { data, error };
};