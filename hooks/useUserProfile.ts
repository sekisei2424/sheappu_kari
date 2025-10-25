"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";

export function useUserProfile(authId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!authId) {
      // ログアウトや未ログイン時は即座にUIを反映させる
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      // profiles テーブルは auth.users.id と同一の UUID を id として持つ想定
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authId)
        .maybeSingle<UserProfile>();

      if (error) {
        // 実エラーのみ通知（メッセージ優先で出力）
        console.error("プロフィール取得エラー:", (error as any)?.message ?? error);
        setError(error);
        setProfile(null);
      } else {
        // 見つからない場合は data === null になる。これは正常系として扱う
        setProfile(data ?? null);
        setError(null);
      }

      setLoading(false);
    };

    loadProfile();
  }, [authId]);

  return { profile, loading, error };
}
