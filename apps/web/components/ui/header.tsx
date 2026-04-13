'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getImagePath } from '@/lib/utils';
import { Search, Menu } from 'lucide-react';
import { MobileMenu } from './mobile-menu';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="flex items-center justify-between px-4 lg:px-6 py-2">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-primary hover:bg-surface transition-colors"
            >
              <Menu size={22} />
            </button>

            <Link href="/home" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#4A1572] flex items-center justify-center shrink-0">
                <img src={getImagePath('/images/ehcc-logo.png')} alt="EHCC" className="h-6 w-auto" />
              </div>
            </Link>
          </div>

          {/* Desktop search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search sermons, topics, pastors..."
                className="w-full bg-surface border border-black/[0.08] rounded-xl pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile search */}
            <Link href="/sermons" className="text-text-tertiary hover:text-text-primary md:hidden">
              <Search size={20} />
            </Link>
            <button className="hidden lg:block bg-[#4A1572] text-white rounded-lg px-3 py-1.5 text-[12px] font-medium hover:opacity-90 transition-all">
              Upgrade to Plus
            </button>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[11px] font-medium">
              AO
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
