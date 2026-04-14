'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { img } from '@/lib/utils';
import { useAuth } from '@/lib/use-auth';
import { Search, Menu, User, LogOut, Settings } from 'lucide-react';
import { MobileMenu } from './mobile-menu';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { initials, displayName, eaNumber, email, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="flex items-center justify-between px-4 lg:px-6 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-primary hover:bg-surface transition-colors"
            >
              <Menu size={22} />
            </button>

            <Link href="/home" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#4A1572] flex items-center justify-center shrink-0">
                <img src={img("/images/ehcc-logo.png")} alt="EHCC" className="h-6 w-auto" />
              </div>
            </Link>
          </div>

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
            <Link href="/sermons" className="text-text-tertiary hover:text-text-primary md:hidden">
              <Search size={20} />
            </Link>

            {/* Profile avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="w-8 h-8 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[11px] font-medium"
              >
                {initials}
              </button>

              {profileDropdown && (
                <div className="absolute right-0 top-10 w-56 bg-white border border-black/10 rounded-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-black/[0.06]">
                    <p className="text-[13px] font-medium text-text-primary">{displayName}</p>
                    <p className="text-[11px] text-text-tertiary">{eaNumber || email || ''}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-primary hover:bg-surface transition-colors"
                    >
                      <User size={16} className="text-text-tertiary" />
                      My profile
                    </Link>
                    <Link
                      href="/profile/settings"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-primary hover:bg-surface transition-colors"
                    >
                      <Settings size={16} className="text-text-tertiary" />
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-coral hover:bg-coral-light transition-colors w-full"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
