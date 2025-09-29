"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, Mail } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function LeftSidebar() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useUser();
  const { profile, loading: profileLoading } = useUserProfile(user?.id ?? null);

  console.log("--- LeftSidebarのデータ確認 ---");
  console.log("useUserから返された user:", user);
  console.log("useUserProfileに渡しているID (user?.id):", user?.id);
  console.log("useUserProfileから返された profile:", profile);
  console.log("---------------------------------");

  const navItems = [
    { href: "/", label: "Top", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/tend", label: "Tend", icon: Bell },
    profile && { href: `/messages/${profile.id}`, label: "Message", icon: Mail },
  ].filter(Boolean);

  if (authLoading || profileLoading) return <p>Loading...</p>;

  return (
    <header className="p-4 flex flex-col justify-between h-screen sticky top-0 bg-green-300">
      <div className="ml-30">
        <div className="mb-8">
          <Link href="/" className="text-4xl font-bold text-sky-400">
            しぇあっぷ
          </Link>
        </div>
        <nav className="ml-5">
          <ul>
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
                    <span className="text-xl">{(item as any).label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {profile && (
        <div className="mt-auto ml-25">
          <Link
            href={`/${profile.auth_id}`}
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
                {profile.name[0]}
              </div>
            )}
            <div>
              <p className="font-bold">{profile.name}</p>
              <p className="text-sm text-gray-400">@{profile.name}</p>
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}
