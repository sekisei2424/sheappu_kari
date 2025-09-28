"use client";

import { usePathname } from "next/navigation";
import LeftSidebar from "@/components/layouts/LeftSidebar";
import RightSidebar from "@/components/layouts/RightSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebarPaths = ["/search", "/search/posts"]; 
  const hideRightSidebar = hideSidebarPaths.some((p) =>
    pathname.startsWith(p)
  );

  return (
    <div className="flex w-full min-h-screen text-white">
      <div className="flex w-full">
        <header className="w-100 flex-shrink-0">
          <LeftSidebar />
        </header>

        <main className="w-full flex-grow border-x border-gray-700 bg-white">
          {children}
        </main>

        {!hideRightSidebar && (
          <aside className="w-100 pl-4 flex-shrink-0 bg-green-300">
            <RightSidebar />
          </aside>
        )}
      </div>
    </div>
  );
}