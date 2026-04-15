'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, MoreVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminDelete } from '@/lib/api';

const statusStyles: Record<string, string> = {
  published: 'bg-teal-light text-teal',
  draft: 'bg-amber-light text-amber',
  scheduled: 'bg-[#F3EAF9] text-[#4A1572]',
  transcribed: 'bg-surface text-text-secondary',
  archived: 'bg-surface text-text-tertiary',
};

const PROGRAMME_LABELS: Record<string, string> = {
  sunday_service: 'Sunday Service',
  midweek_service: 'Midweek',
  '3dg': '3DG',
  morning_by_morning: 'MbM',
  tod: 'TOD',
  special: 'Special',
};

interface Sermon {
  id: string;
  title: string;
  pastorId: string | null;
  status: string;
  isFree: boolean;
  viewCount: number;
  programmeType: string;
  createdAt: string;
}

export default function SermonsListPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const loadSermons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '50');
      const result = await adminGet<{ data: Sermon[]; total: number }>(`/admin/sermons?${params}`);
      setSermons(result.data);
      setTotal(result.total);
    } catch {
      // Fall back to empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSermons(); }, [statusFilter]);

  const filtered = sermons.filter((s) => {
    if (!search) return true;
    return s.title.toLowerCase().includes(search.toLowerCase());
  });

  const handlePublish = async (id: string) => {
    await adminPost(`/admin/sermons/${id}/publish`);
    setMenuOpen(null);
    loadSermons();
  };

  const handleUnpublish = async (id: string) => {
    await adminPost(`/admin/sermons/${id}/unpublish`);
    setMenuOpen(null);
    loadSermons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sermon?')) return;
    await adminDelete(`/admin/sermons/${id}`);
    setMenuOpen(null);
    loadSermons();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Sermons</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">{total} total</p>
        </div>
        <Link href="/sermons/upload" className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Upload sermon
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sermons..." className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'published', 'draft', 'scheduled', 'archived'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-[12px] border capitalize transition-colors ${statusFilter === s ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'bg-white border-black/10 text-text-secondary'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        {loading ? (
          <PageSkeleton type="table" />
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[13px] text-text-tertiary">No sermons found</p>
            <Link href="/sermons/upload" className="text-[13px] text-[#4A1572] font-medium mt-2 inline-block">Upload your first sermon</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Title</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Programme</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Access</th>
                  <th className="text-right text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Views</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sermon, i) => (
                  <tr key={sermon.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                    <td className="px-4 py-3">
                      <Link href={`/sermons/${sermon.id}/edit`} className="text-[13px] font-medium text-text-primary hover:text-[#4A1572] transition-colors">
                        {sermon.title}
                      </Link>
                      <p className="text-[11px] text-text-tertiary mt-0.5">{new Date(sermon.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-[11px] text-text-tertiary">{PROGRAMME_LABELS[sermon.programmeType] || sermon.programmeType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${statusStyles[sermon.status] || 'bg-surface text-text-tertiary'}`}>
                        {sermon.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-[11px] ${sermon.isFree ? 'text-text-tertiary' : 'text-[#4A1572]'}`}>
                        {sermon.isFree ? 'Free' : 'Paid'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] text-text-secondary hidden md:table-cell">{sermon.viewCount.toLocaleString()}</td>
                    <td className="px-4 py-3 relative">
                      <button onClick={() => setMenuOpen(menuOpen === sermon.id ? null : sermon.id)} className="text-text-tertiary hover:text-text-primary">
                        <MoreVertical size={16} />
                      </button>
                      {menuOpen === sermon.id && (
                        <div className="absolute right-4 top-10 bg-white border border-black/10 rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
                          {sermon.status !== 'published' && (
                            <button onClick={() => handlePublish(sermon.id)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-text-primary hover:bg-surface">
                              <Eye size={14} /> Publish
                            </button>
                          )}
                          {sermon.status === 'published' && (
                            <button onClick={() => handleUnpublish(sermon.id)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-text-primary hover:bg-surface">
                              <EyeOff size={14} /> Unpublish
                            </button>
                          )}
                          <button onClick={() => handleDelete(sermon.id)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-coral hover:bg-coral-light">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
