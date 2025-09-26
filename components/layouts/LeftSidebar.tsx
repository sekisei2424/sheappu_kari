"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, Mail } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Top', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/tend', label: 'Tend', icon: Bell },
  { href: '/messages/${userId}', label: 'Message', icon: Mail },
];

const mockUserForSidebar = {
  name: "田中 太郎",
  username: "taro_tanaka",
  avatarUrl: "https://placehold.co/100x100/2E3440/E5E9F0?text=User",
};

export default function LeftSidebar() {
  const pathname = usePathname()

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
                const href = item.href.replace(/\/$/, '');
                const isActive = pathname === href;
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={`flex items-center space-x-4 p-3 rounded-full transition-colors duration-200 ${isActive ? 'bg-gray-800 font-bold' : 'hover:bg-gray-800'}`}>
                      <item.icon size={24} />
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
      </div>
      <div className="mt-auto">
         <Link href={`/${mockUserForSidebar.username}`} className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-800 transition-colors duration-200">
            <div>
              <p className="font-bold">{mockUserForSidebar.name}</p>
              <p className="text-sm text-gray-400">@{mockUserForSidebar.username}</p>
            </div>
        </Link>
      </div>
    </header>
  );
}