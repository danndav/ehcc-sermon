import Link from 'next/link';
import { MOCK_SERIES } from '@/lib/mock-data';

export default function SeriesListPage() {
  const active = MOCK_SERIES.filter((s) => s.isActive);
  const completed = MOCK_SERIES.filter((s) => !s.isActive);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-5">Series</h1>

      {active.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Active series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {active.map((series) => (
              <Link key={series.id} href={`/series/${series.id}`} className="block">
                <div className="bg-white border border-black/10 rounded-xl overflow-hidden hover:border-black/20 transition-colors">
                  <div className="aspect-[2/1] bg-hero relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-[14px] font-medium">{series.title}</h3>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] text-text-secondary line-clamp-2">{series.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-text-tertiary">{series.episodeCount} episodes</span>
                      <span className="bg-teal-light text-teal text-[10px] font-medium rounded-lg px-2 py-0.5">Active</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Completed series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {completed.map((series) => (
              <Link key={series.id} href={`/series/${series.id}`} className="block">
                <div className="bg-white border border-black/10 rounded-xl overflow-hidden hover:border-black/20 transition-colors">
                  <div className="aspect-[2/1] bg-hero/70 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-[14px] font-medium">{series.title}</h3>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] text-text-secondary line-clamp-2">{series.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-text-tertiary">{series.episodeCount} episodes</span>
                      <span className="text-[10px] text-text-tertiary border border-black/10 rounded-lg px-2 py-0.5">Completed</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
