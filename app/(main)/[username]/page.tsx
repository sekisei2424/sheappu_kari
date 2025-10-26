"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username ?? "";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      console.log("取得しようとしているid:", username);
      const { data, error }: PostgrestSingleResponse<UserProfile> =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", username)
          .single();

      if (error) {
        console.error("プロフィール取得エラー:", error);
        setError(error);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, [username]);

  if (loading) return <p>プロフィール取得中...</p>;
  if (error) return <p>プロフィール取得中にエラーが発生しました</p>;
  if (!profile) return <p>プロフィールが見つかりません</p>;

  return (
    <div>
      <header className="border-b border-gray-700">
        <div className="relative">
          <div className="absolute -bottom-16 left-4">
            <div className="border-4 border-gray-900 rounded-full">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt="アバター"
                  className="w-32 h-32 rounded-full"
                />
              )}
            </div>
          </div>
        </div>
        <div className="p-4 pt-20">
          <div className="flex justify-end">
            <button className="border border-gray-500 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 transition-colors">
              プロフィールを編集
            </button>
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-500">@{profile.name}</p>
          <p className="mt-4">{profile.bio}</p>
          <div className="flex space-x-4 mt-4 text-gray-500">
            <p>
              <span className="font-bold text-white">{profile.following}</span>{" "}
              フォロー中
            </p>
            <p>
              <span className="font-bold text-white">{profile.followers}</span>{" "}
              フォロワー
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}
