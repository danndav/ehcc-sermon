'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { MoodPicker } from '@/components/home/mood-picker';
import { NightlyPrayerWidget } from '@/components/home/nightly-prayer-widget';
import { WeeklyStatsWidget } from '@/components/home/weekly-stats-widget';
import { VerseWidget } from '@/components/home/verse-widget';
import { useSermons } from '@/lib/use-sermons';
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';
import { HeroSkeleton, SermonGridSkeleton, SermonListSkeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { sermons, loading } = useSermons();
  const [continueWatching, setContinueWatching] = useState<any[]>([]);

  const featured = sermons[0];
  const recommended = sermons.slice(0, 4);
  const latest = sermons.slice(0, 6);

  // Load continue watching from API
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API_BASE_URL}/sermons/user/continue-watching`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        // Map watch history to sermon cards with progress
        if (data && data.length > 0) {
          const mapped = data.map((wh: any) => {
            const sermon = sermons.find((s) => s.id === wh.sermonId);
            if (!sermon) return null;
            return { ...sermon, progress: Math.round((wh.progressSeconds / (sermon.duration || 1)) * 100) };
          }).filter(Boolean);
          setContinueWatching(mapped);
        }
      })
      .catch(() => {});
  }, [sermons]);

  if (loading) return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 space-y-6">
      <HeroSkeleton />
      <SermonGridSkeleton count={4} />
      <SermonListSkeleton count={4} />
    </div>
  );

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      {/* Desktop: 60/40 split for hero row */}
      <div className="lg:flex lg:gap-5 mb-6">
        {/* Left: Hero + Mood */}
        <div className="lg:flex-[3] space-y-5">
          {/* Hero / Featured Sermon */}
          {featured ? (
            <Link href={`/watch/${featured.id}`} className="block">
              {/* Mobile: stacked layout (image top, text bottom) */}
              <div className="lg:hidden rounded-xl overflow-hidden border border-black/10">
                <div className="relative aspect-[16/9]">
                  {featured.thumbnailUrl && (
                    <img src={featured.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  )}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-white backdrop-blur-sm">Featured</span>
                </div>
                <div className="bg-[#1B1B3A] p-4">
                  <h2 className="text-white text-[16px] font-medium leading-tight">{featured.title}</h2>
                  <p className="text-white/50 text-[12px] mt-1">{featured.pastor} · {Math.round((featured.duration || 0) / 60)} min</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="bg-[#4A1572] text-white rounded-full px-4 py-2 text-[12px] font-medium inline-flex items-center gap-1.5">
                      <Play size={12} fill="white" />
                      Watch now
                    </span>
                    {featured.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] border border-white/20 text-white/60">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop: overlay layout (original) */}
              <div className="hidden lg:block relative bg-hero rounded-xl overflow-hidden aspect-[2/1]">
                {featured.thumbnailUrl && (
                  <img src={featured.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/60 text-[11px] font-medium mb-1">Featured sermon</p>
                  <h2 className="text-white text-[20px] font-medium">{featured.title}</h2>
                  <p className="text-white/60 text-[12px] mt-0.5">{featured.pastor} · {Math.round((featured.duration || 0) / 60)} min</p>
                  <div className="flex gap-1.5 mt-2">
                    {featured.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/15 text-white/80">{tag}</span>
                    ))}
                  </div>
                  <button className="mt-3 bg-[#4A1572] text-white rounded-full px-4 py-2 text-[12px] font-medium inline-flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all">
                    <Play size={12} fill="white" />
                    Watch now
                  </button>
                </div>
              </div>
            </Link>
          ) : !loading ? (
            <div className="relative bg-hero rounded-xl overflow-hidden aspect-[16/9] lg:aspect-[2/1] flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/60 text-[13px]">No sermons yet</p>
                <p className="text-white/40 text-[11px] mt-1">Upload your first sermon from the admin dashboard</p>
              </div>
            </div>
          ) : null}

          {/* Mood Picker + Verse — mobile only in this row */}
          <div className="lg:hidden space-y-3">
            <MoodPicker />
            <VerseWidget />
          </div>
        </div>

        {/* Right: Widgets (desktop only) */}
        <div className="hidden lg:flex lg:flex-[2] lg:flex-col lg:gap-4">
          <VerseWidget />
          <NightlyPrayerWidget />
          <WeeklyStatsWidget />
        </div>
      </div>

      {/* Mood Picker — desktop */}
      <div className="hidden lg:block mb-6">
        <MoodPicker />
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-medium text-text-primary">Continue watching</h3>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none lg:grid lg:grid-cols-4 lg:overflow-visible">
            {continueWatching.map((sermon: any) => (
              <div key={sermon.id} className="w-[160px] shrink-0 lg:w-auto">
                <SermonCard {...sermon} variant="grid" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-medium text-text-primary">Recommended for you</h3>
            <Link href="/sermons" className="text-[12px] text-[#4A1572] font-medium">See all</Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none lg:grid lg:grid-cols-4 lg:overflow-visible">
            {recommended.map((sermon) => (
              <div key={sermon.id} className="w-[160px] shrink-0 lg:w-auto">
                <SermonCard {...sermon} variant="grid" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Sermons */}
      {latest.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-medium text-text-primary">Latest sermons</h3>
            <Link href="/sermons" className="text-[12px] text-[#4A1572] font-medium">See all</Link>
          </div>
          <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:space-y-0">
            {latest.map((sermon) => (
              <SermonCard key={sermon.id} {...sermon} variant="list" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
