'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Play, Heart, Layers, Mic, GraduationCap, Smile, Bookmark, Clock, FileText, TrendingUp } from 'lucide-react';

const mainNav = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Sermons', href: '/sermons', icon: Play },
  { name: 'Prayer Room', href: '/prayer', icon: Heart },
  { name: 'Series', href: '/series', icon: Layers },
  { name: 'Speakers', href: '/speakers', icon: Mic },
  { name: 'Classes', href: '/classes', icon: GraduationCap },
  { name: 'Kids', href: '/kids', icon: Smile },
];

const libraryNav = [
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Watch history', href: '/history', icon: Clock },
  { name: 'My notes', href: '/notes', icon: FileText },
  { name: 'Growth', href: '/growth', icon: TrendingUp },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home';
    return pathname?.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-[#3D1260] min-h-[calc(100vh-57px)] shrink-0 sticky top-[57px]">
      <div className="flex flex-col h-full px-3 py-4">
        <nav className="space-y-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  active
                    ? 'bg-[#4A1572] text-white'
                    : 'text-[#C4B5D9] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-4 border-t border-white/10">
          <nav className="space-y-0.5">
            {libraryNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                    active
                      ? 'bg-[#4A1572] text-white'
                      : 'text-[#C4B5D9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3">
            <div className="w-8 h-8 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[10px] font-medium shrink-0">
              DD
            </div>
            <div className="min-w-0">
              <p className="text-white text-[12px] font-medium truncate">EHCC Plus</p>
              <p className="text-[#C4B5D9] text-[10px]">Active subscriber</p>
              <p className="text-[#C4B5D9] text-[10px]">Renews 13 May</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
