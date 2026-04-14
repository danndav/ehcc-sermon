'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, FolderOpen, Tag, Calendar, FileText, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

const folders = [
  { name: 'All notes', href: '/notes', icon: FileText, count: 12 },
  { name: 'Sermon notes', href: '/notes?folder=sermon', icon: FileText, count: 5 },
  { name: 'Prayer journal', href: '/notes?folder=prayer', icon: FileText, count: 3 },
  { name: 'Bible study', href: '/notes?folder=bible-study', icon: FileText, count: 2 },
  { name: 'Personal', href: '/notes?folder=personal', icon: FileText, count: 2 },
];

const tags = [
  { name: 'faith', count: 6 },
  { name: 'prayer', count: 4 },
  { name: 'peace', count: 3 },
  { name: 'healing', count: 2 },
  { name: 'sermon', count: 5 },
  { name: 'personal', count: 2 },
];

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showFolders, setShowFolders] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-black/[0.06]">
        <Link
          href="/notes/new"
          className="w-full bg-[#4A1572] text-white rounded-lg px-3 py-2 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> New note
        </Link>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-surface border border-black/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {/* Folders */}
        <button onClick={() => setShowFolders(!showFolders)} className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-text-tertiary uppercase tracking-wider w-full">
          {showFolders ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Folders
        </button>
        {showFolders && (
          <nav className="space-y-0.5 mb-3">
            {folders.map((folder) => {
              const isActive = pathname === folder.href || (folder.href !== '/notes' && pathname?.includes(folder.href));
              return (
                <Link
                  key={folder.name}
                  href={folder.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] transition-colors ${
                    isActive ? 'bg-[#F3EAF9] text-[#4A1572] font-medium' : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen size={14} className={isActive ? 'text-[#4A1572]' : 'text-text-tertiary'} />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-[10px] text-text-tertiary">{folder.count}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Tags */}
        <button onClick={() => setShowTags(!showTags)} className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-text-tertiary uppercase tracking-wider w-full">
          {showTags ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Tags
        </button>
        {showTags && (
          <div className="flex flex-wrap gap-1 px-2 mb-3">
            {tags.map((tag) => (
              <span key={tag.name} className="px-2 py-0.5 rounded-full text-[10px] border border-black/10 bg-surface text-text-secondary hover:border-[#9B59B6] hover:bg-[#F3EAF9] hover:text-[#4A1572] cursor-pointer transition-colors">
                #{tag.name} <span className="text-text-tertiary">{tag.count}</span>
              </span>
            ))}
          </div>
        )}

        {/* Daily notes */}
        <Link
          href="/notes/new?template=daily"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] text-text-secondary hover:bg-surface transition-colors mx-0"
        >
          <Calendar size={14} className="text-text-tertiary" />
          <span>Today&apos;s note</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-12 h-12 bg-[#4A1572] text-white rounded-full flex items-center justify-center shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static z-50 lg:z-auto top-0 left-0 h-full w-[260px] bg-white border-r border-black/[0.06] shrink-0 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
