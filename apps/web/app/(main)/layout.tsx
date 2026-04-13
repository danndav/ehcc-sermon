import { Header } from '@/components/ui/header';
import { DesktopSidebar } from '@/components/ui/desktop-sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <DesktopSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
