'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark, Play, Pause, X, Copy, MessageCircle, Link as LinkIcon } from 'lucide-react';
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
  const [notes, setNotes] = useState<{ timestamp: number; text: string; highlightedText: string }[]>([]);
  const [activeNoteTimestamp, setActiveNoteTimestamp] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [shareQuote, setShareQuote] = useState<{ text: string; timestamp: number } | null>(null);
  const [copied, setCopied] = useState(false);
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

      {/* Transcript + Study Notes */}
      <div className={`px-4 pb-8 ${viewMode === 'study' ? 'lg:flex lg:gap-4' : ''}`}>
        {/* Transcript */}
        <div className={viewMode === 'study' ? 'lg:flex-1' : ''}>
          <h3 className="text-[13px] font-medium text-text-primary mb-3">Transcript</h3>
          <div className="space-y-0">
            {MOCK_TRANSCRIPT.map((line, i) => {
              const isActive = currentTime >= line.start && currentTime < line.end;
              const hasNote = notes.some((n) => n.timestamp === line.start);
              const isNoting = activeNoteTimestamp === line.start;
              return (
                <div key={i}>
                  <button
                    onClick={() => {
                      setCurrentTime(line.start);
                      if (viewMode === 'study') {
                        setActiveNoteTimestamp(isNoting ? null : line.start);
                        setNoteInput('');
                      }
                    }}
                    className={`w-full text-left px-3 py-2 border-l-[3px] transition-colors ${
                      isNoting
                        ? 'bg-[#F3EAF9] border-[#4A1572]'
                        : isActive
                        ? 'bg-[#EBF4FF] border-[#378ADD]'
                        : hasNote
                        ? 'bg-[#F3EAF9]/50 border-[#9B59B6]/30'
                        : 'border-transparent hover:bg-surface/50'
                    }`}
                  >
                    <p className={`text-[10px] mb-0.5 ${isActive ? 'text-[#378ADD]' : 'text-text-tertiary'}`}>
                      {formatTime(line.start)}{isActive ? ' · Now playing' : ''}{hasNote ? ' · 📝' : ''}
                    </p>
                    <p className={`text-[12px] leading-relaxed ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {line.text}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShareQuote({ text: line.text, timestamp: line.start }); }}
                      className="mt-1 text-[10px] text-text-tertiary hover:text-[#4A1572] inline-flex items-center gap-1 transition-colors"
                    >
                      <Share2 size={10} /> Share quote
                    </button>
                  </button>
                  {/* Inline note input (mobile) */}
                  {viewMode === 'study' && isNoting && (
                    <div className="lg:hidden px-3 py-2 bg-[#F3EAF9] border-l-[3px] border-[#4A1572]">
                      <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Type your note..."
                        rows={2}
                        className="w-full bg-white border border-[#9B59B6] rounded-lg px-3 py-2 text-[12px] focus:outline-none resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-1.5">
                        <button
                          onClick={() => {
                            if (noteInput.trim()) {
                              setNotes([...notes, { timestamp: line.start, text: noteInput, highlightedText: line.text }]);
                              setNoteInput('');
                              setActiveNoteTimestamp(null);
                            }
                          }}
                          className="bg-[#4A1572] text-white rounded-lg px-3 py-1 text-[11px] font-medium"
                        >
                          Save note
                        </button>
                        <button onClick={() => { setActiveNoteTimestamp(null); setNoteInput(''); }} className="text-[11px] text-text-tertiary">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes panel (desktop — study mode only) */}
        {viewMode === 'study' && (
          <div className="hidden lg:block lg:w-[300px] shrink-0">
            <h3 className="text-[13px] font-medium text-text-primary mb-3">My notes</h3>

            {activeNoteTimestamp !== null && (
              <div className="bg-[#F3EAF9] rounded-xl p-3 mb-3">
                <p className="text-[10px] text-[#4A1572] mb-1">Adding note at {formatTime(activeNoteTimestamp)}</p>
                <p className="text-[11px] text-text-secondary italic mb-2 line-clamp-2">
                  &ldquo;{MOCK_TRANSCRIPT.find((l) => l.start === activeNoteTimestamp)?.text}&rdquo;
                </p>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Type your note..."
                  rows={3}
                  className="w-full bg-white border border-[#9B59B6] rounded-lg px-3 py-2 text-[12px] focus:outline-none resize-none"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      if (noteInput.trim()) {
                        const line = MOCK_TRANSCRIPT.find((l) => l.start === activeNoteTimestamp);
                        setNotes([...notes, { timestamp: activeNoteTimestamp, text: noteInput, highlightedText: line?.text || '' }]);
                        setNoteInput('');
                        setActiveNoteTimestamp(null);
                      }
                    }}
                    className="bg-[#4A1572] text-white rounded-lg px-3 py-1.5 text-[11px] font-medium"
                  >
                    Save
                  </button>
                  <button onClick={() => { setActiveNoteTimestamp(null); setNoteInput(''); }} className="text-[11px] text-text-tertiary">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map((note, i) => (
                  <div key={i} className="bg-white border border-black/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-[#378ADD] bg-[#EBF4FF] px-1.5 py-0.5 rounded">{formatTime(note.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary italic mb-1 border-l-2 border-[#9B59B6]/30 pl-2">
                      &ldquo;{note.highlightedText.slice(0, 80)}...&rdquo;
                    </p>
                    <p className="text-[12px] text-text-primary">{note.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[12px] text-text-tertiary">Tap any transcript line to add a note</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Quote Modal */}
      {shareQuote && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/50" onClick={() => { setShareQuote(null); setCopied(false); }} />
          <div className="fixed inset-x-4 bottom-4 z-[90] max-w-md mx-auto lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[400px]">
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Quote card preview */}
              <div className="bg-[#3D1260] p-6 text-white">
                <p className="text-[14px] leading-relaxed italic">&ldquo;{shareQuote.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-1 h-8 bg-[#9B59B6] rounded-full" />
                  <div>
                    <p className="text-[12px] font-medium">{sermon.pastor}</p>
                    <p className="text-[10px] text-white/60">{sermon.title}</p>
                  </div>
                </div>
                <p className="text-[9px] text-white/40 mt-3">EHCC Plus · Enthronement House Christian Center</p>
              </div>

              {/* Share actions */}
              <div className="p-4">
                <p className="text-[13px] font-medium text-text-primary mb-3">Share this quote</p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`"${shareQuote.text}"\n\n— ${sermon.pastor}, ${sermon.title}\n\nWatch on EHCC Plus`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-black/10 hover:bg-surface transition-colors"
                  >
                    <MessageCircle size={20} className="text-[#25D366]" />
                    <span className="text-[10px] text-text-secondary">WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`"${shareQuote.text}"\n\n— ${sermon.pastor}, ${sermon.title}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-black/10 hover:bg-surface transition-colors"
                  >
                    <Copy size={20} className="text-text-tertiary" />
                    <span className="text-[10px] text-text-secondary">{copied ? 'Copied!' : 'Copy text'}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://ehcc.plus/watch/${id}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-black/10 hover:bg-surface transition-colors"
                  >
                    <LinkIcon size={20} className="text-text-tertiary" />
                    <span className="text-[10px] text-text-secondary">Copy link</span>
                  </button>
                </div>
                <button
                  onClick={() => { setShareQuote(null); setCopied(false); }}
                  className="w-full mt-3 py-2 text-[13px] text-text-tertiary hover:text-text-primary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
