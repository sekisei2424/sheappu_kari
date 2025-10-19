import { supabase } from '../supabase/client';

// -----------------------------------------------------
// profiles テーブルの更新用データ型を定義
// -----------------------------------------------------
interface ProfileUpdateData {
  name?: string;
  is_organizer?: boolean;
  description?: string;
  followers?: number; // followers カラムを追加
}

// -----------------------------------------------------
// **テーブル名: profiles**
// -----------------------------------------------------

/**
 * ユーザープロフィールを作成 (Authトリガーで自動挿入されるため、通常は手動で呼ばない)
 * @param id UUID (auth.users.id)
 * @param name ユーザー名
 */
export const createUserProfile = async (id: string, name: string) => { // email 引数を削除
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      // email カラムを削除
      { id, name, is_organizer: false } 
    ])
    .select();
  return { data, error };
};

/**
 * ユーザープロフィールを取得
 * @param id UUID
 */
export const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

/**
 * ユーザープロフィールを更新
 * @param id UUID
 * @param updateData 更新するデータ
 */
export const updateUserProfile = async (id: string, updateData: ProfileUpdateData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select();
  return { data, error };
};

/**
 * ユーザープロフィールを削除 (Auth連動のため通常は使わない)
 * @param id UUID
 */
export const deleteUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
    .select();
  return { data, error };
};