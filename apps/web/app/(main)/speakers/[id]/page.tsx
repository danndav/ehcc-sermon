'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { API_BASE_URL } from '@/lib/constants';
import { Skeleton, SermonGridSkeleton } from '@/components/ui/skeleton';

interface Pastor { id: string; name: string; bio: string | null; photoUrl: string | null; churchRole: string | null; }

export default function SpeakerDetailPage({ params }: { params: { id: string } }) {
  const [pastor, setPastor] = useState<Pastor | null>(null);
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE_URL}/sermons?pastorId=${params.id}&limit=50`).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([pastors, sermonResult]) => {
      const p = pastors.find((p: Pastor) => p.id === params.id);
      setPastor(p || null);
      const pastorMap = new Map<string, string>();
      pastors.forEach((p: Pastor) => pastorMap.set(p.id, p.name));
      setSermons((sermonResult.data || []).map((s: any) => ({
        ...s, pastor: s.pastorId ? pastorMap.get(s.pastorId) || 'Unknown' : 'Unknown',
        date: s.publishedAt || s.createdAt, mediaType: s.mediaType || 'video',
      })));
    }).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="flex items-start gap-4 mb-6">
        <Skeleton className="w-20 h-20 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <Skeleton className="h-5 w-36 mb-3" />
      <SermonGridSkeleton count={6} />
    </div>
  );
  if (!pastor) return <div className="p-8 text-center text-[13px] text-text-tertiary">Speaker not found</div>;

  const initials = pastor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const shortName = pastor.name.split(' ')[0];

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <Link href="/speakers" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} /> Back to speakers
      </Link>
      <div className="flex items-start gap-4 mb-6">
        {pastor.photoUrl ? (
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0"><img src={pastor.photoUrl} alt={pastor.name} className="w-full h-full object-cover" /></div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[24px] font-medium shrink-0">{initials}</div>
        )}
        <div>
          <h1 className="text-[20px] font-medium text-text-primary">{pastor.name}</h1>
          <p className="text-[12px] text-[#4A1572] font-medium mt-0.5">{pastor.churchRole || 'Speaker'}</p>
          {pastor.bio && <p className="text-[13px] text-text-secondary mt-2 leading-relaxed">{pastor.bio}</p>}
        </div>
      </div>
      <h2 className="text-[14px] font-medium text-text-primary mb-3">Sermons by {shortName}</h2>
      {sermons.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {sermons.map((sermon: any) => <SermonCard key={sermon.id} {...sermon} variant="grid" />)}
        </div>
      ) : (
        <p className="text-[13px] text-text-tertiary text-center py-8">No sermons yet</p>
      )}
    </div>
  );
}
