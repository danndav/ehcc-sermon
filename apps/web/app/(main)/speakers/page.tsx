'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import { SpeakerCardSkeleton } from '@/components/ui/skeleton';

interface Pastor { id: string; name: string; bio: string | null; photoUrl: string | null; churchRole: string | null; }

export default function SpeakersPage() {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.json()).then(setPastors).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-5">Speakers</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <SpeakerCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {pastors.map((pastor) => {
            const initials = pastor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <Link key={pastor.id} href={`/speakers/${pastor.id}`} className="block">
                <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:border-black/20 transition-colors">
                  {pastor.photoUrl ? (
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden">
                      <img src={pastor.photoUrl} alt={pastor.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[18px] font-medium mx-auto mb-3">
                      {initials}
                    </div>
                  )}
                  <h3 className="text-[14px] font-medium text-text-primary">{pastor.name}</h3>
                  <p className="text-[11px] text-text-tertiary mt-0.5">{pastor.churchRole || 'Speaker'}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
