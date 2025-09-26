"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, Mail } from 'lucide-react';
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/crud/users";

type UserProfile = {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
};

export default function LeftSidebar() {
  const pathname = usePathname()
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

  const navItems = [
    { href: '/', label: 'Top', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/tend', label: 'Tend', icon: Bell },
    { href: '/messages/${userId}', label: 'Message', icon: Mail },
  ];

  return (
    <header className="w-64 p-4 flex flex-col justify-between h-screen sticky top-0 bg-green-300">
      <div>
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-sky-400">
            しぇあっぷ
          </Link>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => {
              const href = item.href.replace(/\/$/, "");
              const isActive = pathname === href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-4 p-3 rounded-full transition-colors duration-200 ${
                      isActive ? "bg-gray-800 font-bold" : "hover:bg-gray-800"
                    }`}
                  >
                    <item.icon size={24} />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {user && (
        <div className="mt-auto">
          <Link
            href={`/${user.username}`}
            className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="アバター"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                {user.name[0]}
              </div>
            )}
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}