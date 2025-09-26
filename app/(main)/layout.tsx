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
    <div className="text-white min-h-screen bg-transparent">
      <div className="container mx-auto grid grid-cols-4">
        <div className="border-r border-green-700">
          <LeftSidebar />
        </div>
        <main
          className={`border-x border-gray-700 bg-white ${
            hideRightSidebar ? "col-span-3" : "col-span-2"
          }`}
        >
          {children}
        </main>
        {!hideRightSidebar && (
          <div className="border-l border-gray-700 bg-white">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
}