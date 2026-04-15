'use client';

import { useState, useEffect } from 'react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';
import { SermonGridSkeleton } from '@/components/ui/skeleton';

export default function BookmarksPage() {
  const [bookmarked, setBookmarked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    Promise.all([
      fetch(`${API_BASE_URL}/sermons/user/bookmarks`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE_URL}/sermons?limit=100`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.json()).catch(() => []),
    ]).then(([bookmarks, sermonResult, pastors]) => {
      const pastorMap = new Map<string, string>();
      pastors.forEach((p: any) => pastorMap.set(p.id, p.name));
      const sermonMap = new Map<string, any>();
      (sermonResult.data || []).forEach((s: any) => sermonMap.set(s.id, s));
      const mapped = (bookmarks || []).map((b: any) => {
        const s = sermonMap.get(b.sermonId);
        if (!s) return null;
        return { ...s, pastor: s.pastorId ? pastorMap.get(s.pastorId) || 'Unknown' : 'Unknown', date: s.publishedAt || s.createdAt, mediaType: s.mediaType || 'video' };
      }).filter(Boolean);
      setBookmarked(mapped);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-4">Bookmarks</h1>
      {loading ? (
        <SermonGridSkeleton count={6} />
      ) : bookmarked.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {bookmarked.map((sermon: any) => <SermonCard key={sermon.id} {...sermon} variant="grid" />)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[13px] text-text-tertiary">No bookmarks yet</p>
          <p className="text-[12px] text-text-tertiary mt-1">Tap the bookmark icon on any sermon to save it here</p>
        </div>
      )}
    </div>
  );
}
