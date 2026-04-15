'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearAdminAuth, getAdminUser } from '@/lib/api';
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
  BookOpen,
  MapPin,
  ClipboardCheck,
  Clock,
  ChevronDown,
  Library,
  Wallet,
  UserCheck,
  FileCheck,
  Handshake,
} from 'lucide-react';

type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'data_officer';
const ALL_ADMIN: AdminRole[] = ['super_admin', 'admin', 'moderator', 'data_officer'];
const CONTENT: AdminRole[] = ['super_admin', 'admin', 'moderator'];
const DATA: AdminRole[] = ['super_admin', 'admin', 'data_officer'];
const SYSTEM: AdminRole[] = ['super_admin'];

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: AdminRole[];
}

interface NavGroup {
  name: string;
  icon: any;
  roles: AdminRole[];
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry;
}

const navigation: NavEntry[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ALL_ADMIN },
  {
    name: 'Content', icon: Library, roles: CONTENT,
    children: [
      { name: 'Sermons', href: '/sermons', icon: Video, roles: CONTENT },
      { name: 'Series', href: '/series', icon: Layers, roles: CONTENT },
      { name: 'Pastors', href: '/pastors', icon: Mic, roles: CONTENT },
      { name: 'Verses', href: '/verses', icon: BookOpen, roles: ['super_admin', 'admin'] },
      { name: 'Classes', href: '/classes', icon: GraduationCap, roles: CONTENT },
      { name: 'Kids', href: '/kids', icon: Smile, roles: CONTENT },
    ],
  },
  {
    name: 'Prayer', icon: Heart, roles: [...CONTENT, 'data_officer'],
    children: [
      { name: 'Requests', href: '/prayer/requests', icon: Heart, roles: [...CONTENT, 'data_officer'] },
      { name: 'Prayer Logs', href: '/prayer/logs', icon: Clock, roles: [...CONTENT, 'data_officer'] },
      { name: 'Recordings', href: '/prayer/recordings', icon: Mic, roles: CONTENT },
      { name: 'Settings', href: '/prayer/settings', icon: Settings, roles: ['super_admin', 'admin'] },
    ],
  },
  {
    name: 'People', icon: UserCheck, roles: DATA,
    children: [
      { name: 'Users', href: '/users', icon: Users, roles: DATA },
      { name: 'Attendance', href: '/attendance', icon: ClipboardCheck, roles: DATA },
      { name: 'Service Notes', href: '/service-notes', icon: FileCheck, roles: DATA },
      { name: 'Ministry Guide', href: '/ministry-guide', icon: Handshake, roles: DATA },
    ],
  },
  {
    name: 'Finance', icon: Wallet, roles: ['super_admin', 'admin'],
    children: [
      { name: 'Giving', href: '/giving', icon: HandCoins, roles: ['super_admin', 'admin'] },
      { name: 'Subscriptions', href: '/subscriptions/plans', icon: CreditCard, roles: SYSTEM },
      { name: 'Payments', href: '/payments', icon: DollarSign, roles: ['super_admin', 'admin'] },
    ],
  },
  { name: 'Branches', href: '/branches', icon: MapPin, roles: SYSTEM },
  { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['super_admin', 'admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: SYSTEM },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Content']));
  const user = getAdminUser();
  const userRole = (user?.role || 'admin') as AdminRole;

  const handleLogout = () => {
    clearAdminAuth();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const isGroupActive = (group: NavGroup) => {
    return group.children.some(child => isActive(child.href));
  };

  const toggleGroup = (name: string) => {
    const next = new Set(openGroups);
    if (next.has(name)) next.delete(name); else next.add(name);
    setOpenGroups(next);
  };

  // Auto-open group if current page is inside it
  const visibleNavigation = navigation.filter(entry => {
    if (isGroup(entry)) {
      const visibleChildren = entry.children.filter(c => c.roles.includes(userRole));
      return visibleChildren.length > 0 && entry.roles.includes(userRole);
    }
    return entry.roles.includes(userRole);
  });

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    if (!item.roles.includes(userRole)) return null;
    const active = isActive(item.href);
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
          active ? 'bg-[#4A1572] text-white' : 'text-[#C4B5D9] hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={16} />
        <span>{item.name}</span>
      </Link>
    );
  };

  const nav = (
    <>
      <div className="px-4 py-5">
        <h1 className="text-white font-semibold text-[16px]">EHCC Admin</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[#C4B5D9] text-[10px]">Enthronement House</p>
          <span className="text-[9px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded capitalize">{userRole.replace('_', ' ')}</span>
        </div>
      </div>
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {visibleNavigation.map((entry) => {
          if (isGroup(entry)) {
            const GroupIcon = entry.icon;
            const groupActive = isGroupActive(entry);
            const isOpen = openGroups.has(entry.name) || groupActive;
            const visibleChildren = entry.children.filter(c => c.roles.includes(userRole));

            return (
              <div key={entry.name}>
                <button
                  onClick={() => toggleGroup(entry.name)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-[13px] transition-colors ${
                    groupActive && !isOpen ? 'bg-[#4A1572] text-white' : 'text-[#C4B5D9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GroupIcon size={16} />
                    <span>{entry.name}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                    {visibleChildren.map(renderNavItem)}
                  </div>
                )}
              </div>
            );
          }
          return renderNavItem(entry as NavItem);
        })}
      </nav>
      <div className="px-2 py-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-[#C4B5D9] hover:text-white text-[13px] w-full rounded-lg hover:bg-white/5 transition-colors">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-black/10 text-text-primary"
      >
        <Menu size={20} />
      </button>

      <div className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)} />
      <div className={`fixed top-0 left-0 z-[70] h-full w-[260px] bg-[#3D1260] flex flex-col transition-transform duration-300 ease-out md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X size={20} />
        </button>
        {nav}
      </div>

      <aside className="hidden md:flex flex-col w-[240px] bg-[#3D1260] min-h-screen shrink-0 sticky top-0">
        {nav}
      </aside>
    </>
  );
}
