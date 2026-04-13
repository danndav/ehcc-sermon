import Link from 'next/link';
import { Play } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { MoodPicker } from '@/components/home/mood-picker';
import { NightlyPrayerWidget } from '@/components/home/nightly-prayer-widget';
import { WeeklyStatsWidget } from '@/components/home/weekly-stats-widget';
import { MOCK_SERMONS, MOCK_CONTINUE_WATCHING } from '@/lib/mock-data';

export default function HomePage() {
  const featured = MOCK_SERMONS[0];
  const recommended = MOCK_SERMONS.slice(0, 4);
  const latest = MOCK_SERMONS.slice(0, 6);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      {/* Desktop: 60/40 split for hero row */}
      <div className="lg:flex lg:gap-5 mb-6">
        {/* Left: Hero + Mood */}
        <div className="lg:flex-[3] space-y-5">
          {/* Hero / Featured Sermon */}
          <Link href={`/watch/${featured.id}`} className="block">
            <div className="relative bg-hero rounded-xl overflow-hidden aspect-[16/9] lg:aspect-[2/1]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <p className="text-white/60 text-[11px] font-medium mb-1">Featured sermon</p>
                <h2 className="text-white text-[16px] lg:text-[20px] font-medium">{featured.title}</h2>
                <p className="text-white/60 text-[11px] lg:text-[12px] mt-0.5">{featured.pastor} · {Math.round((featured.duration || 0) / 60)} min</p>
                <div className="flex gap-1.5 mt-2">
                  {featured.tags?.slice(0, 3).map((tag) => (
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

          {/* Mood Picker — mobile only in this row, desktop gets its own row below */}
          <div className="lg:hidden">
            <MoodPicker />
          </div>
        </div>

        {/* Right: Widgets (desktop only) */}
        <div className="hidden lg:flex lg:flex-[2] lg:flex-col lg:gap-4">
          <NightlyPrayerWidget />
          <WeeklyStatsWidget />
        </div>
      </div>

      {/* Mood Picker — desktop */}
      <div className="hidden lg:block mb-6">
        <MoodPicker />
      </div>

      {/* Continue Watching */}
      {MOCK_CONTINUE_WATCHING.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-medium text-text-primary">Continue watching</h3>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none lg:grid lg:grid-cols-4 lg:overflow-visible">
            {MOCK_CONTINUE_WATCHING.map((sermon) => (
              <div key={sermon.id} className="w-[160px] shrink-0 lg:w-auto">
                <SermonCard {...sermon} variant="grid" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
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

      {/* Latest Sermons */}
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
    </div>
  );
}
