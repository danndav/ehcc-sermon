'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api';

const PROGRAMME_OPTIONS = [
  { value: 'sunday_service', label: 'Sunday Service' },
  { value: 'midweek_service', label: 'Midweek Service' },
  { value: '3dg', label: '3 Days of Glory' },
  { value: 'morning_by_morning', label: 'Morning by Morning' },
  { value: 'tod', label: 'Throne of David' },
  { value: 'special', label: 'Special' },
];

interface Pastor { id: string; name: string; }
interface Series { id: string; title: string; }

export default function SermonEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sermon fields
  const [title, setTitle] = useState('');
  const [pastorId, setPastorId] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [programme, setProgramme] = useState('sunday_service');
  const [accessLevel, setAccessLevel] = useState('free');
  const [status, setStatus] = useState('draft');
  const [threeDgDay, setThreeDgDay] = useState('1');
  const [threeDgSession, setThreeDgSession] = useState('morning');
  const [specialName, setSpecialName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState(0);

  // Metadata
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [transcriptTimestamps, setTranscriptTimestamps] = useState<any[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    Promise.all([
      adminGet<any>(`/admin/sermons/${params.id}`),
      adminGet<Pastor[]>('/admin/sermons/pastors/all'),
      adminGet<Series[]>('/admin/sermons/series/all'),
      fetch(`http://localhost:3005/api/v1/sermons/${params.id}/metadata`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([sermon, pastorList, series, metadata]) => {
      if (sermon) {
        setTitle(sermon.title || '');
        setPastorId(sermon.pastorId || '');
        setSeriesId(sermon.seriesId || '');
        setProgramme(sermon.programmeType || 'sunday_service');
        setAccessLevel(sermon.isFree ? 'free' : 'paid');
        setStatus(sermon.status || 'draft');
        setThreeDgDay(String(sermon.threeDgDay || 1));
        setThreeDgSession(sermon.programmeSession || 'morning');
        setSpecialName(sermon.specialProgrammeName || '');
        setYoutubeUrl(sermon.youtubeUrl || '');
        setThumbnailUrl(sermon.thumbnailUrl || '');
        setDuration(sermon.duration || 0);
      }
      setPastors(pastorList || []);
      setSeriesList(series || []);
      if (metadata) {
        setTags((metadata.tags || []).join(', '));
        setSummary(metadata.summary || '');
        setTranscriptText(metadata.transcriptText || '');
        setTranscriptTimestamps(metadata.transcriptTimestamps || []);
      }
    }).finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await adminPatch(`/admin/sermons/${params.id}`, {
        title,
        pastorId: pastorId || null,
        seriesId: seriesId || null,
        programmeType: programme,
        isFree: accessLevel === 'free',
        specialProgrammeName: programme === 'special' ? specialName : null,
        threeDgDay: programme === '3dg' ? Number(threeDgDay) : null,
        programmeSession: programme === '3dg' ? threeDgSession : null,
      });
      setSuccess('Saved!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    await adminPost(`/admin/sermons/${params.id}/publish`);
    setStatus('published');
    setSuccess('Published!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleUnpublish = async () => {
    await adminPost(`/admin/sermons/${params.id}/unpublish`);
    setStatus('draft');
    setSuccess('Unpublished');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this sermon? This cannot be undone.')) return;
    await adminDelete(`/admin/sermons/${params.id}`);
    router.push('/sermons');
  };

  const handleTranscribe = async () => {
    setError('');
    try {
      // Transcribe — sends YouTube URL directly to AssemblyAI (no download needed)
      setSuccess('Transcribing — this takes about 1-2 minutes...');
      await adminPost(`/admin/media/${params.id}/transcribe`);

      // Step 3: Reload metadata
      const metadata = await fetch(`http://localhost:3005/api/v1/sermons/${params.id}/metadata`).then(r => r.ok ? r.json() : null);
      if (metadata) {
        setTranscriptText(metadata.transcriptText || '');
        setTranscriptTimestamps(metadata.transcriptTimestamps || []);
        setTags((metadata.tags || []).join(', '));
        setSummary(metadata.summary || '');
      }
      setSuccess('Transcription complete!');
    } catch (err: any) {
      setError(err.message || 'Transcription failed. Check the server logs.');
    }
  };

  if (loading) return <PageSkeleton type="form" />;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl">
      <Link href="/sermons" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} /> Back to sermons
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Edit sermon</h1>
        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize ${
          status === 'published' ? 'bg-teal-light text-teal' : status === 'draft' ? 'bg-amber-light text-amber' : status === 'transcribed' ? 'bg-[#F3EAF9] text-[#4A1572]' : 'bg-surface text-text-tertiary'
        }`}>{status}</span>
      </div>

      {/* Thumbnail preview */}
      {thumbnailUrl && (
        <div className="mb-4">
          <img src={thumbnailUrl} alt="" className="w-full max-w-md h-48 object-cover rounded-xl" />
        </div>
      )}

      {/* Main details */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Pastor / Speaker</label>
              <select value={pastorId} onChange={(e) => setPastorId(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                <option value="">Select pastor</option>
                {pastors.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Series</label>
              <select value={seriesId} onChange={(e) => setSeriesId(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                <option value="">No series</option>
                {seriesList.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Programme type</label>
              <select value={programme} onChange={(e) => setProgramme(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                {PROGRAMME_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Access level</label>
              <div className="flex gap-2">
                <button onClick={() => setAccessLevel('free')} className={`flex-1 py-2.5 rounded-lg text-[12px] border transition-colors ${accessLevel === 'free' ? 'bg-teal-light border-teal text-teal font-medium' : 'border-black/10 text-text-secondary'}`}>Free</button>
                <button onClick={() => setAccessLevel('paid')} className={`flex-1 py-2.5 rounded-lg text-[12px] border transition-colors ${accessLevel === 'paid' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>Paid</button>
              </div>
            </div>
          </div>
          {programme === '3dg' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Day</label>
                <select value={threeDgDay} onChange={(e) => setThreeDgDay(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                  <option value="1">Day 1</option><option value="2">Day 2</option><option value="3">Day 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Session</label>
                <select value={threeDgSession} onChange={(e) => setThreeDgSession(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                  <option value="morning">Morning</option><option value="evening">Evening</option>
                </select>
              </div>
            </div>
          )}
          {programme === 'special' && (
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Special programme name</label>
              <input type="text" value={specialName} onChange={(e) => setSpecialName(e.target.value)} placeholder="e.g. Easter Convention 2025" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
          )}
          {youtubeUrl && (
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">YouTube URL</label>
              <p className="text-[13px] text-text-tertiary">{youtubeUrl}</p>
            </div>
          )}
          {duration > 0 && (
            <p className="text-[12px] text-text-tertiary">Duration: {Math.round(duration / 60)} minutes</p>
          )}
        </div>
      </div>

      {/* AI content */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-medium text-text-primary">AI-generated content</h2>
          <button onClick={handleTranscribe} className="inline-flex items-center gap-1.5 text-[12px] text-[#4A1572] font-medium hover:opacity-80">
            <Sparkles size={14} /> {transcriptText ? 'Re-generate' : 'Generate transcript'}
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Tags</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags will appear after AI processing" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
          </div>
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Summary will appear after AI processing" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-medium text-text-primary">Transcript</h2>
          {transcriptText ? (
            <button onClick={() => setShowTranscript(!showTranscript)} className="text-[12px] text-[#4A1572] font-medium">
              {showTranscript ? 'Collapse' : 'Show transcript'}
            </button>
          ) : (
            <span className="text-[11px] text-text-tertiary">No transcript yet — click &quot;Generate transcript&quot; above</span>
          )}
        </div>
        {showTranscript && transcriptTimestamps.length > 0 && (
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {transcriptTimestamps.map((line: any, i: number) => (
              <div key={i} className="flex gap-2 border-l-2 border-black/[0.06] pl-3 py-1">
                <span className="text-[10px] text-[#378ADD] shrink-0 w-10">{formatTime(line.start)}</span>
                <p className="text-[12px] text-text-secondary leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>
        )}
        {showTranscript && transcriptTimestamps.length === 0 && transcriptText && (
          <div className="max-h-[400px] overflow-y-auto">
            <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-wrap">{transcriptText}</p>
          </div>
        )}
      </div>

      {/* Status messages */}
      {error && <p className="text-[13px] text-coral mb-3">{error}</p>}
      {success && <p className="text-[13px] text-teal mb-3">{success}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="bg-[#4A1572] text-white rounded-lg px-6 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save changes
        </button>
        {status === 'published' ? (
          <button onClick={handleUnpublish} className="border border-coral text-coral rounded-lg px-6 py-2.5 text-[13px] font-medium hover:bg-coral-light transition-colors">
            Unpublish
          </button>
        ) : (
          <button onClick={handlePublish} className="border border-teal text-teal rounded-lg px-6 py-2.5 text-[13px] font-medium hover:bg-teal-light transition-colors">
            Publish now
          </button>
        )}
        <button onClick={handleDelete} className="border border-black/15 rounded-lg px-6 py-2.5 text-[13px] text-coral hover:bg-coral-light transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}
