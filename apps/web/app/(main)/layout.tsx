import { Header } from '@/components/ui/header';
import { DesktopSidebar } from '@/components/ui/desktop-sidebar';
import { BranchProvider } from '@/lib/branch-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BranchProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex">
          <DesktopSidebar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </BranchProvider>
  );
}
