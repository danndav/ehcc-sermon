import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { MOCK_SERIES, MOCK_SERMONS } from '@/lib/mock-data';

export function generateStaticParams() {
  return MOCK_SERIES.map((s) => ({ id: s.id }));
}

export default function SeriesDetailPage({ params }: { params: { id: string } }) {
  const series = MOCK_SERIES.find((s) => s.id === params.id) || MOCK_SERIES[0];
  const episodes = MOCK_SERMONS.filter((s) => series.sermonIds?.includes(s.id));

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <Link href="/series" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} />
        Back to series
      </Link>

      <div className="lg:flex lg:gap-6">
        {/* Series cover */}
        <div className="lg:w-[320px] shrink-0 mb-4 lg:mb-0">
          <div className="aspect-[2/1] lg:aspect-[4/3] bg-hero rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-white text-[18px] font-medium">{series.title}</h1>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-[10px] font-medium rounded-lg px-2 py-0.5 ${series.isActive ? 'bg-teal-light text-teal' : 'border border-black/10 text-text-tertiary'}`}>
              {series.isActive ? 'Active' : 'Completed'}
            </span>
            <span className="text-[11px] text-text-tertiary">{series.episodeCount} episodes</span>
          </div>
        </div>

        {/* Details + Episodes */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{series.description}</p>

          <h2 className="text-[14px] font-medium text-text-primary mb-3">Episodes</h2>
          <div className="space-y-2">
            {episodes.map((sermon, i) => (
              <Link key={sermon.id} href={`/watch/${sermon.id}`} className="block">
                <div className="flex items-center gap-3 p-3 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-colors">
                  <span className="text-[13px] font-medium text-text-tertiary w-6 text-center shrink-0">{i + 1}</span>
                  <div className="relative w-[80px] shrink-0 aspect-video bg-hero rounded-lg overflow-hidden">
                    <span className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${sermon.isFree ? 'bg-teal-light text-teal' : 'bg-[#4A1572] text-white'}`}>
                      {sermon.isFree ? 'F' : 'P'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-medium text-text-primary">{sermon.title}</h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{sermon.pastor} · {Math.round((sermon.duration || 0) / 60)} min</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
