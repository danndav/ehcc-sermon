'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { useBranch } from '@/lib/branch-context';
import type { Verse } from '@/types/database';

const FALLBACK_WEEK: Verse = {
  id: 'fallback-week',
  type: 'week',
  scripture: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
  reference: 'Proverbs 3:5-6',
  translation: 'NIV',
  branchId: null,
  startDate: '2026-04-13',
  endDate: '2026-04-19',
  isActive: true,
  setBy: 'Rev Deji Olabode',
};

const FALLBACK_YEAR: Verse = {
  id: 'fallback-year',
  type: 'year',
  scripture: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
  reference: 'Jeremiah 29:11',
  translation: 'NIV',
  branchId: null,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  isActive: true,
  setBy: 'Rev Deji Olabode',
};

export function VerseWidget() {
  const { selectedBranch } = useBranch();
  const [activeTab, setActiveTab] = useState<'week' | 'year'>('week');
  const [weekVerse, setWeekVerse] = useState<Verse>(FALLBACK_WEEK);
  const [yearVerse, setYearVerse] = useState<Verse>(FALLBACK_YEAR);

  useEffect(() => {
    const branchParam = selectedBranch ? `?branchId=${selectedBranch.id}` : '';
    fetch(`${API_BASE_URL}/sermons/verses/current${branchParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.verseOfTheWeek) setWeekVerse(data.verseOfTheWeek);
        if (data.verseOfTheYear) setYearVerse(data.verseOfTheYear);
      })
      .catch(() => {
        // Use fallback verses
      });
  }, [selectedBranch]);

  const verse = activeTab === 'week' ? weekVerse : yearVerse;

  return (
    <div className="bg-[#F3EAF9] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <BookOpen size={14} className="text-[#4A1572]" />
          <span className="text-[12px] font-medium text-[#4A1572]">Scripture</span>
        </div>
        <div className="flex bg-white/60 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('week')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
              activeTab === 'week' ? 'bg-white text-[#4A1572] shadow-sm' : 'text-[#4A1572]/60'
            }`}
          >
            This week
          </button>
          <button
            onClick={() => setActiveTab('year')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
              activeTab === 'year' ? 'bg-white text-[#4A1572] shadow-sm' : 'text-[#4A1572]/60'
            }`}
          >
            This year
          </button>
        </div>
      </div>

      <p className="text-[13px] text-[#4A1572]/90 italic leading-relaxed mb-2">
        &ldquo;{verse.scripture}&rdquo;
      </p>
      <p className="text-[12px] font-medium text-[#4A1572]">
        {verse.reference}
        {verse.translation && <span className="font-normal text-[#4A1572]/60"> ({verse.translation})</span>}
      </p>
      {verse.setBy && (
        <p className="text-[10px] text-[#4A1572]/50 mt-1">Set by {verse.setBy}</p>
      )}
    </div>
  );
}
