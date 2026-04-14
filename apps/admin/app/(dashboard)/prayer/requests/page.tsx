'use client';

import { useState } from 'react';
import { MOCK_PRAYER_REQUESTS } from '@/lib/mock-data';

const statusStyles: Record<string, string> = {
  unread: 'bg-coral-light text-coral',
  prayed: 'bg-teal-light text-teal',
  archived: 'bg-surface text-text-tertiary',
};

export default function PrayerRequestsPage() {
  const [tab, setTab] = useState<'private' | 'public'>('private');
  const filtered = MOCK_PRAYER_REQUESTS.filter((p) => tab === 'private' ? p.isPrivate : !p.isPrivate);
  const unreadCount = MOCK_PRAYER_REQUESTS.filter((p) => p.isPrivate && p.status === 'unread').length;

  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Prayer requests</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('private')} className={`px-4 py-2 rounded-lg text-[13px] border transition-colors ${tab === 'private' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'bg-white border-black/10 text-text-secondary'}`}>
          Private inbox {unreadCount > 0 && <span className="ml-1.5 bg-coral text-white text-[10px] rounded-full px-1.5 py-0.5">{unreadCount}</span>}
        </button>
        <button onClick={() => setTab('public')} className={`px-4 py-2 rounded-lg text-[13px] border transition-colors ${tab === 'public' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'bg-white border-black/10 text-text-secondary'}`}>
          Public wall
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <div key={req.id} className="bg-white border border-black/10 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[10px] font-medium">
                  {req.name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-text-primary">{req.name}</p>
                  <p className="text-[10px] text-text-tertiary">{req.date} · {req.category}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${statusStyles[req.status]}`}>{req.status}</span>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">{req.content}</p>
            {req.status !== 'archived' && (
              <div className="flex gap-2 mt-3">
                <button className="bg-[#4A1572] text-white rounded-lg px-3 py-1.5 text-[11px] font-medium hover:opacity-90 transition-all">Mark as prayed</button>
                <button className="border border-black/15 rounded-lg px-3 py-1.5 text-[11px] text-text-secondary hover:bg-surface transition-colors">Archive</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
