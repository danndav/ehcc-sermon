'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Youtube, Headphones, Video } from 'lucide-react';

const PROGRAMME_OPTIONS = [
  { value: 'sunday_service', label: 'Sunday Service' },
  { value: 'midweek_service', label: 'Midweek Service' },
  { value: '3dg', label: '3 Days of Glory' },
  { value: 'morning_by_morning', label: 'Morning by Morning' },
  { value: 'tod', label: 'Throne of David' },
  { value: 'special', label: 'Special' },
];

const PASTORS = [
  { id: '1', name: 'Rev Deji Olabode' },
  { id: '2', name: 'Dr Seun Olabode' },
  { id: '3', name: 'Minister Joseph Sanni' },
  { id: '4', name: 'Rev Gbeniyi Eboda' },
  { id: '5', name: 'Pastor Korede Komaya' },
];

export default function SermonUploadPage() {
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'youtube'>('file');
  const [programme, setProgramme] = useState('sunday_service');
  const [threeDgDay, setThreeDgDay] = useState('1');
  const [threeDgSession, setThreeDgSession] = useState('morning');
  const [accessLevel, setAccessLevel] = useState('free');

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

        {mediaType === 'video' && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => setUploadMethod('file')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${uploadMethod === 'file' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}>
              <Upload size={14} /> Upload file
            </button>
            <button onClick={() => setUploadMethod('youtube')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${uploadMethod === 'youtube' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'border-black/10 text-text-tertiary'}`}>
              <Youtube size={14} /> YouTube URL
            </button>
          </div>
        )}

        {uploadMethod === 'file' ? (
          <div className="border-2 border-dashed border-black/15 rounded-xl p-8 text-center">
            <Upload size={24} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-[13px] text-text-secondary">Drag and drop your {mediaType} file here</p>
            <p className="text-[11px] text-text-tertiary mt-1">or click to browse</p>
          </div>
        ) : (
          <input type="text" placeholder="Paste YouTube URL here..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
        )}
      </div>

      {/* Step 2: Details */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">2. Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Title</label>
            <input type="text" placeholder="Sermon title" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Pastor / Speaker</label>
              <select className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                <option value="">Select pastor</option>
                {PASTORS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Series (optional)</label>
              <select className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                <option value="">No series</option>
                <option value="1">Finding Peace</option>
                <option value="2">Power of Faith</option>
              </select>
            </div>
          </div>

          {/* Programme type */}
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Programme type</label>
            <select value={programme} onChange={(e) => setProgramme(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
              {PROGRAMME_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          {/* 3DG fields */}
          {programme === '3dg' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Day</label>
                <select value={threeDgDay} onChange={(e) => setThreeDgDay(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                  <option value="1">Day 1</option>
                  <option value="2">Day 2</option>
                  <option value="3">Day 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Session</label>
                <select value={threeDgSession} onChange={(e) => setThreeDgSession(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>
          )}

          {programme === 'special' && (
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Programme name</label>
              <input type="text" placeholder="e.g. Easter Convention 2025" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] transition-colors" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Access level</label>
              <div className="flex gap-2">
                <button onClick={() => setAccessLevel('free')} className={`flex-1 py-2 rounded-lg text-[12px] border transition-colors ${accessLevel === 'free' ? 'bg-teal-light border-teal text-teal font-medium' : 'border-black/10 text-text-secondary'}`}>Free</button>
                <button onClick={() => setAccessLevel('paid')} className={`flex-1 py-2 rounded-lg text-[12px] border transition-colors ${accessLevel === 'paid' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>Paid</button>
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Thumbnail</label>
              <div className="border border-dashed border-black/15 rounded-lg px-3 py-2 text-center">
                <p className="text-[11px] text-text-tertiary">Upload image</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: AI Suggestions (placeholder) */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-text-primary mb-2">3. AI suggestions</h2>
        <p className="text-[12px] text-text-tertiary">After upload and transcription, AI will suggest tags, summary, and description.</p>
        <div className="mt-3 bg-[#F3EAF9] rounded-lg p-3">
          <p className="text-[11px] text-[#4A1572]">Upload a sermon to generate AI suggestions</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="bg-[#4A1572] text-white rounded-lg px-6 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
          Publish now
        </button>
        <button className="border border-black/15 rounded-lg px-6 py-2.5 text-[13px] text-text-secondary hover:bg-white transition-colors">
          Save as draft
        </button>
        <button className="border border-black/15 rounded-lg px-6 py-2.5 text-[13px] text-text-secondary hover:bg-white transition-colors">
          Schedule
        </button>
      </div>
    </div>
  );
}
