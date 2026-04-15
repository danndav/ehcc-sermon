'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark, Play, Pause, Copy, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { API_BASE_URL, PROGRAMME_LABELS } from '@/lib/constants';
import { apiFetch } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

const PAID_ACCESS_ROLES = ['subscriber'];

interface SermonData {
  id: string;
  title: string;
  pastorId: string | null;
  youtubeUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  programmeType: string;
  isFree: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface TranscriptLine {
  start: number;
  end: number;
  text: string;
}

export default function WatchClient({ id }: { id: string }) {
  const [sermon, setSermon] = useState<SermonData | null>(null);
  const [pastorName, setPastorName] = useState('');
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'reading' | 'study'>('split');
  const [notes, setNotes] = useState<{ timestamp: number; text: string; highlightedText: string }[]>([]);
  const [activeNoteTimestamp, setActiveNoteTimestamp] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [shareQuote, setShareQuote] = useState<{ text: string; timestamp: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/sermons/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`${API_BASE_URL}/sermons/${id}/transcript`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([sermonData, transcriptData, pastors]) => {
      if (sermonData) {
        setSermon(sermonData);
        const pastor = pastors.find((p: any) => p.id === sermonData.pastorId);
        setPastorName(pastor?.name || 'Unknown');
        // Track view count
        apiFetch(`/sermons/${id}/view`, { method: 'POST' }).catch(() => {});
      }
      if (transcriptData?.timestamps) {
        setTranscript(transcriptData.timestamps);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white p-4 md:p-6 space-y-4">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="w-full aspect-video rounded-xl" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
  if (!sermon) return <div className="min-h-screen flex items-center justify-center"><p className="text-[13px] text-text-tertiary">Sermon not found</p></div>;

  // Paywall check for paid sermons
  const user = getUser();
  const hasPaidAccess = user && PAID_ACCESS_ROLES.includes(user.role);
  if (!sermon.isFree && !hasPaidAccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white border-b border-black/[0.06] px-4 py-3 flex items-center gap-3">
          <Link href="/sermons" className="text-text-primary">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-[13px] text-text-secondary">Back to sermons</span>
        </div>

        {/* Blurred thumbnail */}
        <div className="relative aspect-video max-h-[300px] overflow-hidden">
          {sermon.thumbnailUrl ? (
            <img src={sermon.thumbnailUrl} alt="" className="w-full h-full object-cover blur-lg scale-110" />
          ) : (
            <div className="w-full h-full bg-hero" />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Play size={24} className="text-white/60 ml-1" />
            </div>
          </div>
        </div>

        {/* Sermon info */}
        <div className="px-4 py-3">
          <h1 className="text-[15px] font-medium text-text-primary">{sermon.title}</h1>
          <p className="text-[11px] text-text-tertiary mt-0.5">{pastorName}</p>
        </div>

        {/* Paywall message */}
        <div className="px-4 pb-8">
          <div className="bg-[#F3EAF9] rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#4A1572] flex items-center justify-center mx-auto mb-3">
              <Play size={20} className="text-white ml-0.5" />
            </div>
            <h2 className="text-[16px] font-medium text-[#4A1572] mb-1">Premium Content</h2>
            <p className="text-[13px] text-[#4A1572]/70 mb-4">
              Subscribe to watch this sermon and get access to all premium content.
            </p>
            {!user ? (
              <Link href="/login" className="inline-block bg-[#4A1572] text-white rounded-lg px-6 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all">
                Log in to watch
              </Link>
            ) : (
              <Link href="/profile" className="inline-block bg-[#4A1572] text-white rounded-lg px-6 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all">
                Subscribe now
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const totalDuration = sermon.duration || 0;
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  const date = sermon.publishedAt || sermon.createdAt;
  const formattedDate = new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Extract YouTube video ID
  const youtubeVideoId = sermon.youtubeUrl
    ? sermon.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&?/]+)/)?.[1]
    : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-black/[0.06] px-4 py-3 flex items-center gap-3">
        <Link href="/sermons" className="text-text-primary">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-[13px] text-text-secondary">Now watching</span>
        <div className="ml-auto flex items-center gap-3">
          <button className="text-text-tertiary hover:text-text-primary"><Share2 size={18} /></button>
          <button className="text-text-tertiary hover:text-text-primary"><Bookmark size={18} /></button>
        </div>
      </div>

      {/* Video Player */}
      {viewMode !== 'reading' && (
        <div className="relative bg-hero aspect-video max-h-[400px]">
          {youtubeVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : sermon.thumbnailUrl ? (
            <div className="w-full h-full relative">
              <img src={sermon.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" />
                </div>
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play size={32} className="text-white/40" />
            </div>
          )}
        </div>
      )}

      {/* Sermon Info */}
      <div className="px-4 py-3">
        <h1 className="text-[15px] font-medium text-text-primary">{sermon.title}</h1>
        <p className="text-[11px] text-text-tertiary mt-0.5">
          {pastorName} · {formattedDate} · {totalDuration > 0 ? `${Math.round(totalDuration / 60)} min` : ''}
        </p>
        {sermon.programmeType && (
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] bg-[#F3EAF9] text-[#4A1572]">
            {PROGRAMME_LABELS[sermon.programmeType] || sermon.programmeType}
          </span>
        )}
      </div>

      {/* View mode toggle */}
      <div className="px-4 mb-3">
        <div className="flex bg-surface rounded-full p-0.5">
          {(['split', 'reading', 'study'] as const).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`flex-1 py-1.5 text-[11px] font-medium rounded-full transition-colors capitalize ${viewMode === mode ? 'bg-[#F3EAF9] text-[#4A1572]' : 'text-text-tertiary'}`}>
              {mode === 'split' ? 'Split view' : mode === 'reading' ? 'Reading' : 'Study mode'}
            </button>
          ))}
        </div>
      </div>

      {/* Transcript */}
      {transcript.length > 0 ? (
        <div className={`px-4 pb-8 ${viewMode === 'study' ? 'lg:flex lg:gap-4' : ''}`}>
          <div className={viewMode === 'study' ? 'lg:flex-1' : ''}>
            <h3 className="text-[13px] font-medium text-text-primary mb-3">Transcript</h3>
            <div className="space-y-0">
              {transcript.map((line, i) => {
                const startSec = line.start / 1000; // AssemblyAI timestamps are in ms
                const endSec = line.end / 1000;
                const isActive = currentTime >= startSec && currentTime < endSec;
                const hasNote = notes.some((n) => n.timestamp === line.start);
                return (
                  <div key={i}>
                    <button
                      onClick={() => setCurrentTime(startSec)}
                      className={`w-full text-left px-3 py-2 border-l-[3px] transition-colors ${
                        isActive ? 'bg-[#EBF4FF] border-[#378ADD]' : hasNote ? 'bg-[#F3EAF9]/50 border-[#9B59B6]/30' : 'border-transparent hover:bg-surface/50'
                      }`}
                    >
                      <p className={`text-[10px] mb-0.5 ${isActive ? 'text-[#378ADD]' : 'text-text-tertiary'}`}>
                        {formatTime(startSec)}
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {line.text}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareQuote({ text: line.text, timestamp: line.start }); }}
                        className="mt-1 text-[10px] text-text-tertiary hover:text-[#4A1572] inline-flex items-center gap-1"
                      >
                        <Share2 size={10} /> Share quote
                      </button>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes panel (study mode, desktop) */}
          {viewMode === 'study' && (
            <div className="hidden lg:block lg:w-[300px] shrink-0">
              <h3 className="text-[13px] font-medium text-text-primary mb-3">My notes</h3>
              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map((note, i) => (
                    <div key={i} className="bg-white border border-black/10 rounded-xl p-3">
                      <span className="text-[10px] text-[#378ADD] bg-[#EBF4FF] px-1.5 py-0.5 rounded">{formatTime(note.timestamp / 1000)}</span>
                      <p className="text-[11px] text-text-secondary italic mt-1 border-l-2 border-[#9B59B6]/30 pl-2">&ldquo;{note.highlightedText.slice(0, 80)}...&rdquo;</p>
                      <p className="text-[12px] text-text-primary mt-1">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-text-tertiary text-center py-8">Tap any transcript line to add a note</p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Transcript not ready yet */
        <div className={`px-4 pb-8 ${viewMode === 'study' ? 'lg:flex lg:gap-4' : ''}`}>
          <div className={viewMode === 'study' ? 'lg:flex-1' : ''}>
            <h3 className="text-[13px] font-medium text-text-primary mb-3">Transcript</h3>
            <div className="bg-[#F3EAF9] rounded-xl p-4 text-center">
              <div className="w-8 h-8 border-2 border-[#4A1572]/20 border-t-[#4A1572] rounded-full animate-spin mx-auto mb-2" />
              <p className="text-[12px] text-[#4A1572] font-medium">Processing transcript...</p>
              <p className="text-[11px] text-[#4A1572]/60 mt-1">The transcript will appear here once the sermon audio is processed. This usually takes a few minutes.</p>
            </div>
          </div>

          {viewMode === 'study' && (
            <div className="hidden lg:block lg:w-[300px] shrink-0">
              <h3 className="text-[13px] font-medium text-text-primary mb-3">My notes</h3>
              <p className="text-[12px] text-text-tertiary text-center py-8">Notes will be available once the transcript is ready</p>
            </div>
          )}
        </div>
      )}

      {/* Share Quote Modal */}
      {shareQuote && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/50" onClick={() => { setShareQuote(null); setCopied(false); }} />
          <div className="fixed inset-x-4 bottom-4 z-[90] max-w-md mx-auto lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[400px]">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="bg-[#3D1260] p-6 text-white">
                <p className="text-[14px] leading-relaxed italic">&ldquo;{shareQuote.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-1 h-8 bg-[#9B59B6] rounded-full" />
                  <div>
                    <p className="text-[12px] font-medium">{pastorName}</p>
                    <p className="text-[10px] text-white/60">{sermon.title}</p>
                  </div>
                </div>
                <p className="text-[9px] text-white/40 mt-3">EHCC Plus</p>
              </div>
              <div className="p-4">
                <p className="text-[13px] font-medium text-text-primary mb-3">Share this quote</p>
                <div className="grid grid-cols-3 gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(`"${shareQuote.text}"\n\n— ${pastorName}, ${sermon.title}\n\nWatch on EHCC Plus`)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-black/10 hover:bg-surface transition-colors">
                    <MessageCircle size={20} className="text-[#25D366]" />
                    <span className="text-[10px] text-text-secondary">WhatsApp</span>
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(`"${shareQuote.text}"\n\n— ${pastorName}, ${sermon.title}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-black/10 hover:bg-surface transition-colors">
                    <Copy size={20} className="text-text-tertiary" />
                    <span className="text-[10px] text-text-secondary">{copied ? 'Copied!' : 'Copy text'}</span>
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(`https://ehcc.plus/watch/${id}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-black/10 hover:bg-surface transition-colors">
                    <LinkIcon size={20} className="text-text-tertiary" />
                    <span className="text-[10px] text-text-secondary">Copy link</span>
                  </button>
                </div>
                <button onClick={() => { setShareQuote(null); setCopied(false); }} className="w-full mt-3 py-2 text-[13px] text-text-tertiary hover:text-text-primary">Close</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
