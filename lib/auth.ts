import { supabase } from "../lib/supabase/client";

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("ユーザー取得エラー", error);
    return null;
  }
  return data.user;
};
