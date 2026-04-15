'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { TOPIC_TAGS, PROGRAMME_TYPES } from '@/lib/constants';
import { useSermons } from '@/lib/use-sermons';
import { SermonGridSkeleton } from '@/components/ui/skeleton';

export default function SermonsPage() {
  const { sermons, loading } = useSermons();
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('All');
  const [activeProgramme, setActiveProgramme] = useState('all');
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [guidancePrompt, setGuidancePrompt] = useState('');

  const availableYears = useMemo(() => {
    return Array.from(new Set(sermons.map(s => s.year))).sort((a, b) => b - a);
  }, [sermons]);

  const filtered = useMemo(() => {
    return sermons.filter((s) => {
      if (activeYear !== 'all' && s.year !== activeYear) return false;
      if (activeProgramme !== 'all' && s.programmeType !== activeProgramme) return false;
      if (accessFilter === 'free' && !s.isFree) return false;
      if (accessFilter === 'premium' && s.isFree) return false;
      if (mediaFilter !== 'all' && s.mediaType !== mediaFilter) return false;
      if (activeTopic !== 'All' && !s.tags?.some((t: string) => t.toLowerCase() === activeTopic.toLowerCase())) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.pastor.toLowerCase().includes(q) ||
          s.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
          (s.specialProgrammeName && s.specialProgrammeName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [sermons, search, activeTopic, activeProgramme, activeYear, accessFilter, mediaFilter]);

  // Group by year for display
  const groupedByYear = useMemo(() => {
    if (activeYear !== 'all') return null;
    const groups: Record<number, typeof filtered> = {};
    filtered.forEach((s) => {
      if (!groups[s.year]) groups[s.year] = [];
      groups[s.year].push(s);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, sermons]) => ({ year: Number(year), sermons }));
  }, [filtered, activeYear]);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Sermons</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
            showFilters ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-secondary'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sermons, topics, pastors..."
          className="w-full bg-white border border-black/[0.12] rounded-xl pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors"
        />
      </div>

      {/* Year pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveYear('all')}
          className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
            activeYear === 'all'
              ? 'bg-[#4A1572] border-[#4A1572] text-white'
              : 'bg-white border-black/10 text-text-secondary'
          }`}
        >
          All years
        </button>
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(activeYear === year ? 'all' : year)}
            className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              activeYear === year
                ? 'bg-[#4A1572] border-[#4A1572] text-white'
                : 'bg-white border-black/10 text-text-secondary'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Programme type pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {PROGRAMME_TYPES.map((prog) => (
          <button
            key={prog.value}
            onClick={() => setActiveProgramme(prog.value)}
            className={`shrink-0 px-3 py-1 rounded-full text-[10px] border transition-colors ${
              activeProgramme === prog.value
                ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]'
                : 'bg-surface border-black/10 text-text-secondary'
            }`}
          >
            {prog.label}
          </button>
        ))}
      </div>

      {/* Expanded filters panel */}
      {showFilters && (
        <div className="bg-surface border border-black/10 rounded-xl p-3 space-y-3">
          {/* Access filter */}
          <div>
            <p className="text-[11px] font-medium text-text-secondary mb-1.5">Access</p>
            <div className="flex gap-1.5">
              {(['all', 'free', 'premium'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAccessFilter(a)}
                  className={`px-3 py-1 rounded-full text-[10px] border capitalize transition-colors ${
                    accessFilter === a
                      ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]'
                      : 'bg-white border-black/10 text-text-secondary'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Media type filter */}
          <div>
            <p className="text-[11px] font-medium text-text-secondary mb-1.5">Format</p>
            <div className="flex gap-1.5">
              {(['all', 'video', 'audio'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMediaFilter(m)}
                  className={`px-3 py-1 rounded-full text-[10px] border capitalize transition-colors ${
                    mediaFilter === m
                      ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]'
                      : 'bg-white border-black/10 text-text-secondary'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Topic filter */}
          <div>
            <p className="text-[11px] font-medium text-text-secondary mb-1.5">Topic</p>
            <div className="flex gap-1.5 flex-wrap">
              {TOPIC_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTopic(tag)}
                  className={`px-3 py-1 rounded-full text-[10px] border transition-colors ${
                    activeTopic === tag
                      ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]'
                      : 'bg-white border-black/10 text-text-secondary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Guidance Box */}
      <div className="bg-[#F3EAF9] rounded-xl p-3">
        <p className="text-[12px] font-medium text-[#4A1572] mb-1.5">What are you going through?</p>
        <p className="text-[11px] text-[#4A1572]/70 mb-2">Let AI find the right sermon for you</p>
        <input
          type="text"
          value={guidancePrompt}
          onChange={(e) => setGuidancePrompt(e.target.value)}
          placeholder={'"I\'m struggling with anxiety..."'}
          className="w-full bg-white border border-[#9B59B6] rounded-lg px-3 py-2 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
      </div>

      {/* Results count */}
      <p className="text-[11px] text-text-tertiary">{loading ? '' : `${filtered.length} sermons`}</p>

      {loading && <SermonGridSkeleton count={8} />}

      {/* Results — grouped by year or flat */}
      {groupedByYear ? (
        <div className="space-y-6">
          {groupedByYear.map(({ year, sermons }) => (
            <section key={year}>
              <h2 className="text-[16px] font-medium text-text-primary mb-3">{year}</h2>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
                {sermons.map((sermon) => (
                  <SermonCard key={sermon.id} {...sermon} variant="grid" />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((sermon) => (
            <SermonCard key={sermon.id} {...sermon} variant="grid" />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[13px] text-text-tertiary">No sermons found</p>
          <p className="text-[12px] text-text-tertiary mt-1">Try adjusting your filters or search</p>
        </div>
      )}
    </div>
  );
}
