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
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", authId)
        .single<UserProfile>();

      if (error) {
        console.error("プロフィール取得エラー:", error);
        setError(error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, [authId]);

  return { profile, loading, error };
}
