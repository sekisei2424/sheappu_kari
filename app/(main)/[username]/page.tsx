"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/crud/users";

type UserProfile = {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  following?: number;
  followers?: number;
};

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const { data } = await getUserProfile(currentUser.id);
        setUser(data);
      }
    };
    loadUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <header className="border-b border-gray-700">
        <div className="relative">
          <div className="absolute -bottom-16 left-4">
            <div className="border-4 border-gray-900 rounded-full">
              {user.avatar_url && (
                <img src={user.avatar_url} alt="アバター" className="w-32 h-32 rounded-full" />
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
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">@{user.username}</p>
          <p className="mt-4">{user.bio}</p>
          <div className="flex space-x-4 mt-4 text-gray-500">
            <p>
              <span className="font-bold text-white">{user.following}</span> フォロー中
            </p>
            <p>
              <span className="font-bold text-white">{user.followers}</span> フォロワー
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}
