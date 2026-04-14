'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Video,
  Layers,
  Users,
  Heart,
  CreditCard,
  Bell,
  Settings,
  Mic,
  GraduationCap,
  LogOut,
  Menu,
  X,
  DollarSign,
  Smile,
  HandCoins,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Sermons', href: '/sermons', icon: Video },
  { name: 'Series', href: '/series', icon: Layers },
  { name: 'Pastors', href: '/pastors', icon: Mic },
  { name: 'Classes', href: '/classes', icon: GraduationCap },
  { name: 'Kids', href: '/kids', icon: Smile },
  { name: 'Prayer', href: '/prayer/requests', icon: Heart },
  { name: 'Giving', href: '/giving', icon: HandCoins },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Subscriptions', href: '/subscriptions/plans', icon: CreditCard },
  { name: 'Payments', href: '/payments', icon: DollarSign },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const nav = (
    <>
      <div className="px-4 py-5">
        <h1 className="text-white font-semibold text-[16px]">EHCC Admin</h1>
        <p className="text-[#C4B5D9] text-[10px] mt-0.5">Enthronement House</p>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors ${
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
      <div className="px-2 py-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2.5 text-[#C4B5D9] hover:text-white text-[13px] w-full rounded-lg hover:bg-white/5 transition-colors">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-black/10 text-text-primary"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)} />
      <div className={`fixed top-0 left-0 z-[70] h-full w-[260px] bg-[#3D1260] flex flex-col transition-transform duration-300 ease-out md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X size={20} />
        </button>
        {nav}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] bg-[#3D1260] min-h-screen shrink-0 sticky top-0">
        {nav}
      </aside>
    </>
  );
}
