'use client';

import { useState, useEffect } from 'react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';
import { SermonListSkeleton } from '@/components/ui/skeleton';

export default function WatchHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    Promise.all([
      fetch(`${API_BASE_URL}/sermons/user/history`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : { data: [] }),
      fetch(`${API_BASE_URL}/sermons?limit=100`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.json()).catch(() => []),
    ]).then(([historyResult, sermonResult, pastors]) => {
      const pastorMap = new Map<string, string>();
      pastors.forEach((p: any) => pastorMap.set(p.id, p.name));
      const sermonMap = new Map<string, any>();
      (sermonResult.data || []).forEach((s: any) => sermonMap.set(s.id, s));
      const mapped = (historyResult.data || []).map((wh: any) => {
        const s = sermonMap.get(wh.sermonId);
        if (!s) return null;
        const diffDays = Math.floor((Date.now() - new Date(wh.lastWatchedAt || wh.createdAt).getTime()) / 86400000);
        return {
          ...s, pastor: s.pastorId ? pastorMap.get(s.pastorId) || 'Unknown' : 'Unknown',
          date: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`,
          progress: s.duration ? Math.round((wh.progressSeconds / s.duration) * 100) : 0,
          mediaType: s.mediaType || 'video',
        };
      }).filter(Boolean);
      setHistory(mapped);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-4">Watch history</h1>
      {loading ? (
        <SermonListSkeleton count={6} />
      ) : history.length > 0 ? (
        <div className="space-y-2">
          {history.map((sermon: any, i: number) => <SermonCard key={`${sermon.id}-${i}`} {...sermon} variant="list" />)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[13px] text-text-tertiary">No watch history yet</p>
          <p className="text-[12px] text-text-tertiary mt-1">Start watching sermons to see your history here</p>
        </div>
      )}
    </div>
  );
}
