'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Clock, Tag } from 'lucide-react';

const MOCK_NOTES = [
  {
    id: '1',
    title: 'Peace in the storm — sermon takeaways',
    folder: 'sermon',
    content: 'Peace is not the absence of the storm — it is the presence of God in the storm. The disciples panicked, but Jesus slept. His peace was not dependent on circumstances...',
    tags: ['peace', 'faith', 'sermon'],
    linkedSermon: { id: '1', title: 'Finding Peace in the Storm' },
    updatedAt: '14 Apr 2025, 10:30 AM',
  },
  {
    id: '2',
    title: 'Morning prayer — April 14',
    folder: 'prayer',
    content: 'Lord, I come before you this morning with a grateful heart. Thank you for a new day, for breath, for life. I surrender my plans to you today...',
    tags: ['prayer', 'personal'],
    linkedSermon: null,
    updatedAt: '14 Apr 2025, 6:15 AM',
  },
  {
    id: '3',
    title: 'Power of prayer — study notes',
    folder: 'sermon',
    content: 'Prayer is not about changing God\'s mind. It\'s about aligning your heart with His will. Key scripture: Philippians 4:6-7. Three types of prayer discussed...',
    tags: ['prayer', 'sermon'],
    linkedSermon: { id: '2', title: 'Power of Prayer' },
    updatedAt: '13 Apr 2025, 9:00 PM',
  },
  {
    id: '4',
    title: 'Genesis 1-3 — creation study',
    folder: 'bible-study',
    content: '## Day 1: Light\nGod spoke light into existence before the sun. Light represents truth, clarity, and God\'s presence...\n\n## Day 2: Firmament\nSeparation of waters...',
    tags: ['faith', 'bible-study'],
    linkedSermon: null,
    updatedAt: '12 Apr 2025, 3:00 PM',
  },
  {
    id: '5',
    title: 'Overcoming fear — personal reflection',
    folder: 'personal',
    content: 'Fear is faith in reverse — it believes the worst will happen. I\'ve been carrying fear about the job situation. But God has not given me a spirit of fear...',
    tags: ['faith', 'personal', 'healing'],
    linkedSermon: { id: '5', title: 'Overcoming Fear Through Faith' },
    updatedAt: '11 Apr 2025, 8:45 PM',
  },
  {
    id: '6',
    title: '3DG April — Day 1 evening notes',
    folder: 'sermon',
    content: 'The glory fell tonight. Pastor spoke about open heavens and what it means for a heaven to be open over your life. Key points:\n- Open heavens = unhindered access\n- Blocked heavens = sin, disobedience...',
    tags: ['sermon', 'glory'],
    linkedSermon: { id: '21', title: 'Open Heavens — Day 1 Evening' },
    updatedAt: '1 Apr 2025, 11:00 PM',
  },
  {
    id: '7',
    title: 'Weekly reflection — March week 4',
    folder: 'personal',
    content: 'This week I watched 4 sermons and attended 3 prayer nights. I feel a shift in my spirit. The series on Walking in Purpose is really speaking to me...',
    tags: ['personal', 'reflection'],
    linkedSermon: null,
    updatedAt: '30 Mar 2025, 7:00 PM',
  },
];

const folderLabels: Record<string, string> = {
  sermon: 'Sermon notes',
  prayer: 'Prayer journal',
  'bible-study': 'Bible study',
  personal: 'Personal',
};

const folderColors: Record<string, string> = {
  sermon: 'bg-[#F3EAF9] text-[#4A1572]',
  prayer: 'bg-teal-light text-teal',
  'bible-study': 'bg-amber-light text-amber',
  personal: 'bg-coral-light text-coral',
};

export default function NotesListPage() {
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');

  const sorted = [...MOCK_NOTES].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0; // already sorted by recent
  });

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[18px] font-medium text-text-primary">All notes</h1>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${sortBy === 'recent' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy('title')}
            className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${sortBy === 'title' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}
          >
            A-Z
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((note) => (
          <Link key={note.id} href={`/notes/${note.id}`} className="block">
            <div className="bg-white border border-black/10 rounded-xl p-3.5 hover:border-black/20 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-medium text-text-primary">{note.title}</h3>
                  <p className="text-[12px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">{note.content}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${folderColors[note.folder] || 'bg-surface text-text-tertiary'}`}>
                      {folderLabels[note.folder] || note.folder}
                    </span>
                    {note.linkedSermon && (
                      <span className="text-[10px] text-[#378ADD] bg-[#EBF4FF] px-1.5 py-0.5 rounded">
                        {note.linkedSermon.title}
                      </span>
                    )}
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] text-text-tertiary">#{tag}</span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-text-tertiary whitespace-nowrap shrink-0">{note.updatedAt.split(',')[0]}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
