'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

interface Note {
  id: string;
  sermonId: string;
  noteText: string;
  highlightedText: string | null;
  transcriptTimestamp: number | null;
  createdAt: string;
}

export default function NotesListPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sermonTitles, setSermonTitles] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    Promise.all([
      fetch(`${API_BASE_URL}/sermons/user/notes`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE_URL}/sermons?limit=100`).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([notesData, sermonResult]) => {
      setNotes(notesData || []);
      const titleMap = new Map<string, string>();
      (sermonResult.data || []).forEach((s: any) => titleMap.set(s.id, s.title));
      setSermonTitles(titleMap);
    }).finally(() => setLoading(false));
  }, []);

  const sorted = [...notes].sort((a, b) => {
    if (sortBy === 'title') return a.noteText.localeCompare(b.noteText);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatTime = (ms: number | null) => {
    if (!ms) return '';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[18px] font-medium text-text-primary">All notes</h1>
        <div className="flex gap-1.5">
          <button onClick={() => setSortBy('recent')} className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${sortBy === 'recent' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}>
            Recent
          </button>
          <button onClick={() => setSortBy('title')} className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${sortBy === 'title' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}>
            A-Z
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-black/5 rounded-xl p-3.5 space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="space-y-2">
          {sorted.map((note) => (
            <Link key={note.id} href={`/watch/${note.sermonId}`} className="block">
              <div className="bg-white border border-black/10 rounded-xl p-3.5 hover:border-black/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-primary leading-relaxed">{note.noteText}</p>
                    {note.highlightedText && (
                      <p className="text-[11px] text-text-secondary italic mt-1.5 border-l-2 border-[#9B59B6]/30 pl-2 line-clamp-2">
                        &ldquo;{note.highlightedText}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-[#F3EAF9] text-[#4A1572]">Sermon note</span>
                      {sermonTitles.get(note.sermonId) && (
                        <span className="text-[10px] text-[#378ADD] bg-[#EBF4FF] px-1.5 py-0.5 rounded">
                          {sermonTitles.get(note.sermonId)}
                        </span>
                      )}
                      {note.transcriptTimestamp && (
                        <span className="text-[10px] text-text-tertiary">at {formatTime(note.transcriptTimestamp)}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-text-tertiary whitespace-nowrap shrink-0">
                    {new Date(note.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText size={32} className="mx-auto text-text-tertiary mb-2" />
          <p className="text-[13px] text-text-tertiary">No notes yet</p>
          <p className="text-[12px] text-text-tertiary mt-1">Take notes while watching sermons in study mode</p>
        </div>
      )}
    </div>
  );
}
