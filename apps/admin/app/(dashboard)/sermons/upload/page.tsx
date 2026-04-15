'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Youtube, Headphones, Video, Check, Loader2 } from 'lucide-react';
import { adminGet, adminPost, adminFetch } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

const PROGRAMME_OPTIONS = [
  { value: 'sunday_service', label: 'Sunday Service' },
  { value: 'midweek_service', label: 'Midweek Service' },
  { value: '3dg', label: '3 Days of Glory' },
  { value: 'morning_by_morning', label: 'Morning by Morning' },
  { value: 'tod', label: 'Throne of David' },
  { value: 'special', label: 'Special' },
];

const BRANCHES = [
  { id: 1, name: 'HQ Lagos' },
  { id: 2, name: 'Lekki' },
  { id: 3, name: 'Oshogbo' },
  { id: 4, name: 'Ogbomosho' },
  { id: 5, name: 'Abeokuta' },
  { id: 6, name: 'UK' },
  { id: 7, name: 'Canada' },
  { id: 8, name: 'USA' },
];

interface Pastor { id: string; name: string; }
interface Series { id: string; title: string; }

export default function SermonUploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // Data from API
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [pastorId, setPastorId] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'youtube' | 'url'>('file');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [programme, setProgramme] = useState('sunday_service');
  const [threeDgDay, setThreeDgDay] = useState('1');
  const [threeDgSession, setThreeDgSession] = useState('morning');
  const [specialName, setSpecialName] = useState('');
  const [accessLevel, setAccessLevel] = useState('free');
  const [branchId, setBranchId] = useState('1');
  const [file, setFile] = useState<File | null>(null);

  const [duration, setDuration] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [fetchingYt, setFetchingYt] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    adminGet<Pastor[]>('/admin/sermons/pastors/all').then(setPastors).catch(() => {});
    adminGet<Series[]>('/admin/sermons/series/all').then(setSeriesList).catch(() => {});
  }, []);

  // Auto-fetch YouTube info when URL is pasted
  const handleYoutubeUrl = async (url: string) => {
    setYoutubeUrl(url);
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) return;

    setFetchingYt(true);
    try {
      const info = await adminGet<any>(`/admin/media/youtube-info?url=${encodeURIComponent(url)}`);
      if (info.sermonTitle) setTitle(info.sermonTitle);
      if (info.programmeType) setProgramme(info.programmeType);
      if (info.duration) setDuration(info.duration);
      if (info.thumbnailUrl) setThumbnailUrl(info.thumbnailUrl);

      // Match pastor from the list, or set the name for auto-creation
      if (info.pastorName) {
        const match = pastors.find(p => p.name.toLowerCase().includes(info.pastorName.toLowerCase()));
        if (match) {
          setPastorId(match.id);
          setPastorName(match.name);
        } else {
          setPastorId('');
          setPastorName(info.pastorName);
        }
      }

      setSuccess(`Auto-detected: "${info.sermonTitle}" — ${info.programmeType?.replace('_', ' ')} — ${Math.round(info.duration / 60)} min`);
      setTimeout(() => setSuccess(''), 5000);
    } catch {
      // Silent fail — admin can fill manually
    } finally {
      setFetchingYt(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published' | 'auto') => {
    if (!title.trim()) { setError('Title is required'); return; }
    setError('');
    setSaving(true);

    try {
      // Step 0: If pastor name is set but no pastorId, create the pastor first
      let finalPastorId = pastorId;
      if (!finalPastorId && pastorName.trim()) {
        try {
          const newPastor = await adminPost<any>('/admin/sermons/pastors', { name: pastorName.trim() });
          finalPastorId = newPastor.id;
          setPastors([...pastors, newPastor]);
        } catch {
          // If pastor creation fails, continue without pastor
        }
      }

      // Step 1: Create the sermon record
      const sermon = await adminPost<any>('/admin/sermons', {
        title,
        pastorId: finalPastorId || undefined,
        seriesId: seriesId || undefined,
        mediaType,
        youtubeUrl: uploadMethod === 'youtube' ? youtubeUrl : undefined,
        videoUrl: uploadMethod === 'url' ? directUrl : undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        isFree: accessLevel === 'free',
        duration: duration || undefined,
        programmeType: programme,
        specialProgrammeName: programme === 'special' ? specialName : undefined,
        threeDgDay: programme === '3dg' ? Number(threeDgDay) : undefined,
        programmeSession: programme === '3dg' ? threeDgSession : undefined,
        branchId: Number(branchId),
        status: status === 'auto' ? 'draft' : status,
        autoPublish: status === 'auto',
      });

      // Step 2: Handle media upload
      if (uploadMethod === 'file' && file) {
        // File upload → R2
        const formData = new FormData();
        formData.append('file', file);

        const token = (await import('@/lib/api')).getAdminToken();
        const uploadRes = await fetch(`${API_BASE_URL}/admin/media/upload/${sermon.id}`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!uploadRes.ok) {
          setSuccess(`Sermon created but video upload failed — you can upload later.`);
          setTimeout(() => router.push('/sermons'), 2000);
          return;
        }
      } else if (uploadMethod === 'youtube' && youtubeUrl) {
        // YouTube → download → R2 → queue transcription
        setSuccess('Sermon created! Downloading YouTube video — this may take a few minutes...');
        try {
          await adminPost(`/admin/media/import-youtube/${sermon.id}`, { youtubeUrl });
        } catch {
          setSuccess('Sermon created but YouTube download failed — you can retry from the edit page.');
          setTimeout(() => router.push('/sermons'), 2000);
          return;
        }
      }

      // Step 3: If publishing now, call publish endpoint
      if (status === 'published') {
        await adminPost(`/admin/sermons/${sermon.id}/publish`);
      }

      const messages = {
        auto: 'Sermon saved! Will auto-publish once transcript is ready.',
        published: 'Sermon published!',
        draft: 'Sermon saved as draft.',
      };
      setSuccess(messages[status]);
      setTimeout(() => router.push('/sermons'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save sermon');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link href="/sermons" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} />
        Back to sermons
      </Link>

      <h1 className="text-[22px] font-medium text-text-primary mb-6">Upload sermon</h1>

      {/* Step 1: Media Type & Upload */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">1. Media</h2>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMediaType('video')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] border transition-colors ${mediaType === 'video' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>
            <Video size={16} /> Video
          </button>
          <button onClick={() => setMediaType('audio')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] border transition-colors ${mediaType === 'audio' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>
            <Headphones size={16} /> Audio
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setUploadMethod('file')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${uploadMethod === 'file' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}>
            <Upload size={14} /> Upload file
          </button>
          <button onClick={() => setUploadMethod('youtube')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${uploadMethod === 'youtube' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}>
            <Youtube size={14} /> YouTube URL
          </button>
          <button onClick={() => setUploadMethod('url')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${uploadMethod === 'url' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}>
            Direct URL
          </button>
        </div>

        {uploadMethod === 'file' && (
          <>
            <input ref={fileRef} type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-black/15 rounded-xl p-8 text-center cursor-pointer hover:border-[#9B59B6] transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <Check size={18} className="text-teal" />
                  <p className="text-[13px] text-text-primary">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
                </div>
              ) : (
                <>
                  <Upload size={24} className="mx-auto text-text-tertiary mb-2" />
                  <p className="text-[13px] text-text-secondary">Click to select your {mediaType} file</p>
                  <p className="text-[11px] text-text-tertiary mt-1">MP4, MOV, MP3, M4A up to 5GB</p>
                </>
              )}
            </div>
          </>
        )}
        {uploadMethod === 'youtube' && (
          <div>
            <div className="relative">
              <input type="text" value={youtubeUrl} onChange={(e) => handleYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=... or https://youtu.be/..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
              {fetchingYt && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#4A1572]">Fetching info...</span>}
            </div>
            {thumbnailUrl && (
              <div className="mt-3 flex gap-3 items-start">
                <img src={thumbnailUrl} alt="" className="w-32 h-20 object-cover rounded-lg" />
                <div className="text-[12px] text-text-secondary">
                  {duration > 0 && <p>Duration: {Math.round(duration / 60)} min</p>}
                  <p className="text-[11px] text-text-tertiary mt-0.5">Details auto-filled from YouTube</p>
                </div>
              </div>
            )}
          </div>
        )}
        {uploadMethod === 'url' && (
          <input type="text" value={directUrl} onChange={(e) => setDirectUrl(e.target.value)} placeholder="https://example.com/sermon-video.mp4" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
        )}
      </div>

      {/* Step 2: Details */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">2. Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sermon title" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Pastor / Speaker</label>
              <input
                type="text"
                value={pastorName}
                onChange={(e) => {
                  setPastorName(e.target.value);
                  // Check if typed name matches an existing pastor
                  const match = pastors.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
                  setPastorId(match ? match.id : '');
                }}
                list="pastor-list"
                placeholder="Type or select pastor name"
                className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors"
              />
              <datalist id="pastor-list">
                {pastors.map((p) => <option key={p.id} value={p.name} />)}
              </datalist>
              {pastorName && !pastorId && (
                <p className="text-[10px] text-[#4A1572] mt-1">New pastor — will be created automatically</p>
              )}
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Series (optional)</label>
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
              <label className="block text-[12px] text-text-secondary mb-1">Branch</label>
              <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                {BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
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
              <label className="block text-[12px] text-text-secondary mb-1">Programme name</label>
              <input type="text" value={specialName} onChange={(e) => setSpecialName(e.target.value)} placeholder="e.g. Easter Convention 2025" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
            </div>
          )}

          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Access level</label>
            <div className="flex gap-2">
              <button onClick={() => setAccessLevel('free')} className={`flex-1 py-2 rounded-lg text-[12px] border transition-colors ${accessLevel === 'free' ? 'bg-teal-light border-teal text-teal font-medium' : 'border-black/10 text-text-secondary'}`}>Free</button>
              <button onClick={() => setAccessLevel('paid')} className={`flex-1 py-2 rounded-lg text-[12px] border transition-colors ${accessLevel === 'paid' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>Paid</button>
            </div>
          </div>
        </div>
      </div>

      {/* Error / Success */}
      {error && <p className="text-[13px] text-coral mb-3">{error}</p>}
      {success && <p className="text-[13px] text-teal mb-3">{success}</p>}

      {/* Publish mode info */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">3. Publishing</h2>
        <p className="text-[12px] text-text-tertiary mb-3">Choose when this sermon goes live for members</p>
        <div className="space-y-2">
          <button
            onClick={() => handleSave('auto')}
            disabled={saving}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-[#9B59B6] bg-[#F3EAF9] text-left disabled:opacity-50"
          >
            <div className="w-5 h-5 rounded-full border-2 border-[#4A1572] flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4A1572]" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#4A1572]">Auto-publish after transcript</p>
              <p className="text-[11px] text-[#4A1572]/60 mt-0.5">Sermon is saved as draft. Once transcription completes, it goes live automatically with transcript ready for members.</p>
            </div>
            {saving && <Loader2 size={14} className="animate-spin text-[#4A1572] shrink-0 mt-1" />}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-black/10 hover:border-black/20 text-left transition-colors disabled:opacity-50"
          >
            <div className="w-5 h-5 rounded-full border-2 border-black/20 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-medium text-text-primary">Publish now</p>
              <p className="text-[11px] text-text-tertiary mt-0.5">Publish immediately — transcript will appear later when ready.</p>
            </div>
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-black/10 hover:border-black/20 text-left transition-colors disabled:opacity-50"
          >
            <div className="w-5 h-5 rounded-full border-2 border-black/20 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-medium text-text-primary">Save as draft</p>
              <p className="text-[11px] text-text-tertiary mt-0.5">Save without publishing. You can review and publish manually later.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
