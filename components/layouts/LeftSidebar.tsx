"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Bell, Mail, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/lib/supabase/client";

export default function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { profile, loading: profileLoading } = useUserProfile(user?.id ?? null);

  const navItems = [
    { href: "/", label: "Top", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/tend", label: "Tend", icon: Bell },
    profile && { href: `/messages/${profile.id}`, label: "Message", icon: Mail },
  ].filter(Boolean);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // すぐにUIを更新
    router.push("/");
    router.refresh();
  };

  if (authLoading || profileLoading) return <p>Loading...</p>;

  return (
    <header className="px-2 lg:px-4 py-4 flex flex-col justify-between h-screen sticky top-0 bg-green-500">
      <div>
        <div className="mb-8">
          <Link
            href="/"
            className="text-4xl font-bold text-sky-800 flex justify-center lg:justify-start"
          >
            <span className="lg:hidden">し</span>
            <span className="hidden lg:inline ml-20">しぇあっぷ</span>
          </Link>
        </div>
        <nav className="lg:ml-30">
          <ul className="flex flex-col items-center lg:items-start">
            {navItems.map((item) => {
              const href = (item as any).href.replace(/\/$/, "");
              const isActive = pathname === href;
              const Icon = (item as any).icon;
              return (
                <li key={(item as any).label}>
                  <Link
                    href={(item as any).href}
                    className={`flex items-center space-x-4 p-3 rounded-full transition-colors duration-200 ${
                      isActive ? "bg-gray-800 font-bold" : "hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={24} />
                    <span className="hidden lg:inline text-xl">
                      {(item as any).label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="mt-auto flex flex-col items-center lg:items-start w-full">
        {profile ? (
          <div className="w-full">
            <div className="px-2 lg:px-4 flex items-center justify-between w-full">
              <Link
                href={`/${profile.id}`}
                className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="アバター"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                    {profile.name?.[0] ?? "?"}
                  </div>
                )}
                <div className="block">
                  <p className="font-bold">{profile.name}</p>
                  <p className="text-sm text-gray-400">@{profile.name}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="mr-2 p-2 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="ログアウト"
                title="ログアウト"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 pb-4">
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/login"
                className="flex-1 text-center py-2 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="flex-1 text-center py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-colors"
              >
                サインアップ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}