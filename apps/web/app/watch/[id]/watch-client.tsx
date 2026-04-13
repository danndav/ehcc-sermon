'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark, Play, Pause } from 'lucide-react';
import { MOCK_SERMONS } from '@/lib/mock-data';

const MOCK_TRANSCRIPT = [
  { start: 0, end: 42, text: 'Good morning church. Before we begin, let us quiet our hearts and prepare to receive the Word today.' },
  { start: 42, end: 118, text: 'Today we talk about worry. Anxiety. That feeling that grips you in the night, that whispers fear into your plans.' },
  { start: 118, end: 194, text: 'Peace does not mean the absence of the storm. Peace means the presence of God in the middle of the storm.' },
  { start: 194, end: 292, text: 'The disciples were seasoned fishermen. They had seen storms before. But this storm was different — because this time, the Master was sleeping.' },
  { start: 292, end: 370, text: 'When they woke Him, He did not panic. He spoke to the wind. He spoke to the waves. And everything obeyed.' },
  { start: 370, end: 450, text: 'Some of you are in a storm right now. You feel like God is sleeping. But I want you to know — He is still on the boat with you.' },
];

export default function WatchClient({ id }: { id: string }) {
  const sermon = MOCK_SERMONS.find((s) => s.id === id) || MOCK_SERMONS[0];
  const [currentTime, setCurrentTime] = useState(130);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'reading' | 'study'>('split');
  const totalDuration = sermon.duration || 2760;
  const progress = (currentTime / totalDuration) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-black/[0.06] px-4 py-3 flex items-center gap-3">
        <Link href="/home" className="text-text-primary">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-[13px] text-text-secondary">Now watching</span>
        <div className="ml-auto flex items-center gap-3">
          <button className="text-text-tertiary hover:text-text-primary"><Share2 size={18} /></button>
          <button className="text-text-tertiary hover:text-text-primary"><Bookmark size={18} /></button>
        </div>
      </div>

      {viewMode !== 'reading' && (
        <div className="relative bg-hero aspect-video max-h-[300px] flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
            <div className="flex items-center gap-2 text-white text-[10px]">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 h-[3px] bg-white/30 rounded-full cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                setCurrentTime(Math.round(pct * totalDuration));
              }}>
                <div className="h-full bg-[#4A1572] rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-3">
        <h1 className="text-[15px] font-medium text-text-primary">{sermon.title}</h1>
        <p className="text-[11px] text-text-tertiary mt-0.5">{sermon.pastor} · {sermon.date} · {Math.round(totalDuration / 60)} min</p>
        {sermon.tags && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {sermon.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-[10px] border border-black/10 bg-surface text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mb-3">
        <div className="flex bg-surface rounded-full p-0.5">
          {(['split', 'reading', 'study'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-full transition-colors capitalize ${
                viewMode === mode
                  ? 'bg-[#F3EAF9] text-[#4A1572]'
                  : 'text-text-tertiary'
              }`}
            >
              {mode === 'split' ? 'Split view' : mode === 'reading' ? 'Reading' : 'Study mode'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-8">
        <h3 className="text-[13px] font-medium text-text-primary mb-3">Transcript</h3>
        <div className="space-y-0">
          {MOCK_TRANSCRIPT.map((line, i) => {
            const isActive = currentTime >= line.start && currentTime < line.end;
            return (
              <button
                key={i}
                onClick={() => setCurrentTime(line.start)}
                className={`w-full text-left px-3 py-2 border-l-[3px] transition-colors ${
                  isActive
                    ? 'bg-[#EBF4FF] border-[#378ADD]'
                    : 'border-transparent hover:bg-surface/50'
                }`}
              >
                <p className={`text-[10px] mb-0.5 ${isActive ? 'text-[#378ADD]' : 'text-text-tertiary'}`}>
                  {formatTime(line.start)}{isActive ? ' · Now playing' : ''}
                </p>
                <p className={`text-[12px] leading-relaxed ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {line.text}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
