import { supabase } from "../lib/supabase/client";

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("ユーザー取得エラー", error.message);
    return null;
  }
  return data.user;
};

export const signUp = async (
  name: string,
  email: string,
  password: string
) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { user: null, error: authError };
  }

  if (!authData.user) {
    return { user: null, error: new Error("ユーザー作成に失敗しました") };
  }

  const auth_id = authData.user.id; // UUID

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, auth_id }]) // idは自動付与
    .select()
    .single();

  if (error) {
    return { user: null, error };
  }

  return { user: data, error: null };
};
