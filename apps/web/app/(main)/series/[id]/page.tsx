'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { Skeleton, SermonListSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton';

interface Series { id: string; title: string; description: string | null; thumbnailUrl: string | null; isActive: boolean; }

export default function SeriesDetailPage({ params }: { params: { id: string } }) {
  const [series, setSeries] = useState<Series | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/sermons/series`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE_URL}/sermons?seriesId=${params.id}&limit=50`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.json()).catch(() => []),
    ]).then(([seriesList, sermonResult, pastors]) => {
      setSeries(seriesList.find((s: Series) => s.id === params.id) || null);
      const pastorMap = new Map<string, string>();
      pastors.forEach((p: any) => pastorMap.set(p.id, p.name));
      setEpisodes((sermonResult.data || []).map((s: any) => ({
        ...s, pastor: s.pastorId ? pastorMap.get(s.pastorId) || 'Unknown' : 'Unknown',
        date: s.publishedAt || s.createdAt, mediaType: s.mediaType || 'video',
      })));
    }).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <Skeleton className="h-4 w-28 mb-4" />
      <div className="lg:flex lg:gap-6">
        <div className="lg:w-[320px] shrink-0 mb-4 lg:mb-0">
          <Skeleton className="aspect-[2/1] lg:aspect-[4/3] w-full rounded-xl" />
          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="h-5 w-14 rounded-lg" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-24 mb-3" />
          <SermonListSkeleton count={5} />
        </div>
      </div>
    </div>
  );
  if (!series) return <div className="p-8 text-center text-[13px] text-text-tertiary">Series not found</div>;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <Link href="/series" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} /> Back to series
      </Link>
      <div className="lg:flex lg:gap-6">
        <div className="lg:w-[320px] shrink-0 mb-4 lg:mb-0">
          <div className="aspect-[2/1] lg:aspect-[4/3] bg-hero rounded-xl relative overflow-hidden">
            {series.thumbnailUrl && <img src={series.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4"><h1 className="text-white text-[18px] font-medium">{series.title}</h1></div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-[10px] font-medium rounded-lg px-2 py-0.5 ${series.isActive ? 'bg-teal-light text-teal' : 'border border-black/10 text-text-tertiary'}`}>
              {series.isActive ? 'Active' : 'Completed'}
            </span>
            <span className="text-[11px] text-text-tertiary">{episodes.length} episodes</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {series.description && <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{series.description}</p>}
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Episodes</h2>
          <div className="space-y-2">
            {episodes.map((sermon: any, i: number) => (
              <Link key={sermon.id} href={`/watch/${sermon.id}`} className="block">
                <div className="flex items-center gap-3 p-3 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-colors">
                  <span className="text-[13px] font-medium text-text-tertiary w-6 text-center shrink-0">{i + 1}</span>
                  <div className="relative w-[80px] shrink-0 aspect-video bg-hero rounded-lg overflow-hidden">
                    {sermon.thumbnailUrl && <img src={sermon.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                    <span className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${sermon.isFree ? 'bg-teal-light text-teal' : 'bg-[#4A1572] text-white'}`}>{sermon.isFree ? 'F' : 'P'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-medium text-text-primary">{sermon.title}</h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{sermon.pastor} · {Math.round((sermon.duration || 0) / 60)} min</p>
                  </div>
                </div>
              </Link>
            ))}
            {episodes.length === 0 && <p className="text-[13px] text-text-tertiary text-center py-8">No episodes yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
