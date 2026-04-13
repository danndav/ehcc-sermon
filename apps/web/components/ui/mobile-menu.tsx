'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Home,
  Play,
  Heart,
  Layers,
  Mic,
  Bookmark,
  Clock,
  FileText,
  PlusCircle,
  User,
  Settings,
  CreditCard,
  LogOut,
} from 'lucide-react';

const mainNav = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Sermons', href: '/sermons', icon: Play },
  { name: 'Prayer Room', href: '/prayer', icon: Heart },
  { name: 'Series', href: '/series', icon: Layers },
  { name: 'Speakers', href: '/speakers', icon: Mic },
  { name: 'Give', href: '/give', icon: PlusCircle },
];

const libraryNav = [
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Watch history', href: '/history', icon: Clock },
  { name: 'My notes', href: '/notes', icon: FileText },
];

const accountNav = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Subscription', href: '/profile/subscription', icon: CreditCard },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home';
    return pathname === href || (href !== '/' && pathname?.startsWith(href));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-[70] h-full w-[280px] bg-white flex flex-col transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
          <Link href="/home" onClick={onClose} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#4A1572] flex items-center justify-center shrink-0">
              <Image src="/images/ehcc-logo.png" alt="EHCC" width={24} height={24} className="h-6 w-auto" />
            </div>
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Main */}
          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                    active
                      ? 'bg-[#F3EAF9] text-[#4A1572] font-medium'
                      : 'text-text-primary hover:bg-surface'
                  }`}
                >
                  <Icon size={20} className={active ? 'text-[#4A1572]' : 'text-text-tertiary'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Library */}
          <div className="mt-5 pt-4 border-t border-black/[0.06]">
            <p className="px-3 text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">Library</p>
            <nav className="space-y-0.5">
              {libraryNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                      active
                        ? 'bg-[#F3EAF9] text-[#4A1572] font-medium'
                        : 'text-text-primary hover:bg-surface'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-[#4A1572]' : 'text-text-tertiary'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Account */}
          <div className="mt-5 pt-4 border-t border-black/[0.06]">
            <p className="px-3 text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">Account</p>
            <nav className="space-y-0.5">
              {accountNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                      active
                        ? 'bg-[#F3EAF9] text-[#4A1572] font-medium'
                        : 'text-text-primary hover:bg-surface'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-[#4A1572]' : 'text-text-tertiary'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer — user info */}
        <div className="px-4 py-3 border-t border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[11px] font-medium shrink-0">
              AO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-text-primary truncate">Adaeze Okonkwo</p>
              <p className="text-[10px] text-text-tertiary">Subscriber</p>
            </div>
            <button className="text-text-tertiary hover:text-text-primary">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
