'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAdminUser, getAdminToken } from '@/lib/api';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAdminToken();
    const user = getAdminUser();

    if (!token || !user) {
      router.replace('/login');
      return;
    }

    const adminRoles = ['super_admin', 'admin', 'moderator', 'data_officer'];
    if (!adminRoles.includes(user.role)) {
      router.replace('/login');
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-3 border-[#4A1572]/20 border-t-[#4A1572] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
