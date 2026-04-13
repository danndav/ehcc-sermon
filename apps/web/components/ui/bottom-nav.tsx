'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Play, Heart, PlusCircle, User } from 'lucide-react';

const tabs = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Sermons', href: '/sermons', icon: Play },
  { name: 'Prayer', href: '/prayer', icon: Heart },
  { name: 'Give', href: '/give', icon: PlusCircle },
  { name: 'Profile', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/10 md:hidden">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/home' && pathname?.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
                isActive
                  ? 'text-[#4A1572] border-t-2 border-[#4A1572]'
                  : 'text-[#888888] border-t-2 border-transparent'
              }`}
            >
              <Icon size={20} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
