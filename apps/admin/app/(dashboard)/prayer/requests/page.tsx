'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPatch, adminDelete } from '../../../../lib/api';

interface PrayerRequest {
  id: string;
  userId: string;
  content: string;
  category: string;
  isPublic: boolean;
  prayerCount: number;
  createdAt: string;
  updatedAt: string;
}

const categoryStyles: Record<string, string> = {
  healing: 'bg-teal-light text-teal',
  finances: 'bg-amber-50 text-amber-700',
  family: 'bg-blue-50 text-blue-700',
  breakthrough: 'bg-[#F3EAF9] text-[#4A1572]',
  thanksgiving: 'bg-green-50 text-green-700',
  salvation: 'bg-orange-50 text-orange-700',
};

export default function PrayerRequestsPage() {
  const [tab, setTab] = useState<'all' | 'private' | 'public'>('all');
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const loadRequests = async (p: number, currentTab: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = currentTab === 'private'
        ? `/admin/prayer/requests/private?page=${p}&limit=${limit}`
        : `/admin/prayer/requests?page=${p}&limit=${limit}`;
      const res = await adminGet<{ data: PrayerRequest[]; total: number }>(endpoint);
      let data = res.data;
      if (currentTab === 'public') {
        data = data.filter((r) => r.isPublic);
      }
      setRequests(data);
      setTotal(res.total);
      setPage(p);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(1, tab); }, [tab]);

  const handleDelete = async (id: string) => {
    try {
      await adminDelete(`/admin/prayer/requests/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setTotal((t) => t - 1);
    } catch {}
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && requests.length === 0) {
    return <PageSkeleton type="cards" />;
  }

  if (error && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-red-500">Failed to load prayer requests: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Prayer requests</h1>
        <p className="text-[12px] text-text-tertiary mt-0.5">{total} total requests</p>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'private', 'public'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[13px] border transition-colors capitalize ${
              tab === t
                ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium'
                : 'bg-white border-black/10 text-text-secondary'
            }`}
          >
            {t === 'private' ? 'Private inbox' : t === 'public' ? 'Public wall' : 'All'}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-xl p-8 text-center">
          <p className="text-[13px] text-text-tertiary">No prayer requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-black/10 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${categoryStyles[req.category] || 'bg-surface text-text-tertiary'}`}>
                    {req.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${req.isPublic ? 'bg-teal-light text-teal' : 'bg-surface text-text-secondary'}`}>
                    {req.isPublic ? 'Public' : 'Private'}
                  </span>
                  {req.prayerCount > 0 && (
                    <span className="text-[10px] text-text-tertiary">{req.prayerCount} prayed</span>
                  )}
                </div>
                <span className="text-[10px] text-text-tertiary">{formatDate(req.createdAt)}</span>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed">{req.content}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleDelete(req.id)}
                  className="border border-black/15 rounded-lg px-3 py-1.5 text-[11px] text-text-secondary hover:bg-surface hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[11px] text-text-tertiary">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => loadRequests(page - 1, tab)} disabled={page <= 1} className="p-1.5 rounded-lg text-text-tertiary hover:bg-surface disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => loadRequests(page + 1, tab)} disabled={page >= totalPages} className="p-1.5 rounded-lg text-text-tertiary hover:bg-surface disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
