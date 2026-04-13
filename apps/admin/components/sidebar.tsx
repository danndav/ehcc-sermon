'use client';

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
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Sermons', href: '/sermons', icon: Video },
  { name: 'Series', href: '/series', icon: Layers },
  { name: 'Pastors', href: '/pastors', icon: Mic },
  { name: 'Prayer', href: '/prayer/requests', icon: Heart },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Subscriptions', href: '/subscriptions/plans', icon: CreditCard },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 bg-sidebar text-sidebar-text min-h-screen p-4">
      <div className="text-white font-medium text-lg mb-8 px-3">EHCC Plus</div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-sidebar-text hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <button className="flex items-center gap-3 px-3 py-2.5 text-sidebar-text hover:text-white text-sm mt-4">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
