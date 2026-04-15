'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, ChevronRight, TrendingUp, LogOut } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { useAuth } from '@/lib/use-auth';
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';

export default function ProfilePage() {
  const { initials, displayName, email, eaNumber, role, logout } = useAuth();
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [bookmarked, setBookmarked] = useState<any[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    Promise.all([
      fetch(`${API_BASE_URL}/sermons/user/continue-watching`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE_URL}/sermons/user/bookmarks`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE_URL}/sermons?limit=100`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.json()).catch(() => []),
    ]).then(([cwData, bkData, sermonResult, pastors]) => {
      const pastorMap = new Map<string, string>();
      pastors.forEach((p: any) => pastorMap.set(p.id, p.name));
      const sermonMap = new Map<string, any>();
      (sermonResult.data || []).forEach((s: any) => sermonMap.set(s.id, s));

      const cw = (cwData || []).map((wh: any) => {
        const s = sermonMap.get(wh.sermonId);
        if (!s) return null;
        return { ...s, pastor: s.pastorId ? pastorMap.get(s.pastorId) || 'Unknown' : 'Unknown', progress: s.duration ? Math.round((wh.progressSeconds / s.duration) * 100) : 0 };
      }).filter(Boolean);
      setContinueWatching(cw);

      const bk = (bkData || []).map((b: any) => {
        const s = sermonMap.get(b.sermonId);
        if (!s) return null;
        return { ...s, pastor: s.pastorId ? pastorMap.get(s.pastorId) || 'Unknown' : 'Unknown' };
      }).filter(Boolean);
      setBookmarked(bk);
    });
  }, []);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">My Profile</h1>
        <Link href="/profile/settings" className="text-text-tertiary"><Settings size={20} /></Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-[44px] h-[44px] rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[14px] font-medium">{initials}</div>
        <div>
          <h2 className="text-[15px] font-medium text-text-primary">{displayName}</h2>
          {email && <p className="text-[11px] text-text-tertiary">{email}</p>}
          {eaNumber && <p className="text-[11px] text-text-tertiary">{eaNumber}</p>}
          <span className="inline-block mt-0.5 bg-[#F3EAF9] text-[#4A1572] text-[10px] font-medium rounded-full px-2 py-0.5 capitalize">{role}</span>
        </div>
      </div>

      {/* Growth link */}
      <Link href="/growth" className="flex items-center justify-between bg-white border border-black/10 rounded-xl p-3 hover:border-black/20 transition-colors">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[#4A1572]" />
          <span className="text-[13px] font-medium text-text-primary">View spiritual growth</span>
        </div>
        <ChevronRight size={16} className="text-text-tertiary" />
      </Link>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section>
          <h3 className="text-[13px] font-medium text-text-primary mb-2">Continue watching</h3>
          <div className="space-y-2">
            {continueWatching.map((sermon: any) => (
              <Link key={sermon.id} href={`/watch/${sermon.id}`} className="block">
                <div className="flex gap-2 p-2 bg-white border border-black/10 rounded-xl">
                  <div className="relative w-[100px] shrink-0 aspect-video bg-hero rounded-lg overflow-hidden">
                    {sermon.thumbnailUrl && <img src={sermon.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20">
                      <div className="h-full bg-[#4A1572] rounded-full" style={{ width: `${sermon.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-medium text-text-primary line-clamp-1">{sermon.title}</h4>
                    <p className="text-[10px] text-text-tertiary mt-0.5">{sermon.pastor}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bookmarks */}
      {bookmarked.length > 0 && (
        <section>
          <h3 className="text-[13px] font-medium text-text-primary mb-2">My bookmarks</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {bookmarked.map((sermon: any) => (
              <Link key={sermon.id} href={`/watch/${sermon.id}`} className="block">
                <div className="w-[120px] shrink-0">
                  <div className="aspect-video bg-hero rounded-lg overflow-hidden">
                    {sermon.thumbnailUrl && <img src={sermon.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <p className="text-[10px] text-text-primary mt-1 line-clamp-1">{sermon.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Subscription */}
      <section>
        <div className="bg-white border border-black/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[13px] font-medium text-text-primary">EHCC Plus</p>
              <p className="text-[11px] text-text-tertiary">Free plan</p>
            </div>
          </div>
          <Link href="/profile/subscription" className="block mt-3 text-center border border-black/15 rounded-lg py-1.5 text-[11px] text-text-secondary hover:bg-surface transition-colors">
            Manage plan
          </Link>
        </div>
      </section>

      {/* Logout */}
      <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] text-coral border border-coral/20 rounded-xl hover:bg-coral-light transition-colors">
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
