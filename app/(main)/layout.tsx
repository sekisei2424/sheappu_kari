import LeftSidebar from '@/components/layouts/LeftSidebar';
import RightSidebar from '@/components/layouts/RightSidebar';
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto grid grid-cols-4">
        <div className="border-r border-gray-700">
          <LeftSidebar />
        </div>
        <main className="col-span-2 border-x border-gray-700">
          {children}
        </main>
        <div className="border-l border-gray-700">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}