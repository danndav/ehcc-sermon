'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

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

const MOCK_TRANSCRIPT = [
  'Good morning church. Before we begin, let us quiet our hearts and prepare to receive the Word today.',
  'Today we talk about worry. Anxiety. That feeling that grips you in the night, that whispers fear into your plans.',
  'Peace does not mean the absence of the storm. Peace means the presence of God in the middle of the storm.',
  'The disciples were seasoned fishermen. They had seen storms before. But this storm was different — because this time, the Master was sleeping.',
  'When they woke Him, He did not panic. He spoke to the wind. He spoke to the waves. And everything obeyed.',
  'Some of you are in a storm right now. You feel like God is sleeping. But I want you to know — He is still on the boat with you.',
];

export default function SermonEditPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('Finding Peace in the Storm');
  const [description, setDescription] = useState('A powerful message about finding God\'s peace in the midst of life\'s storms.');
  const [tags, setTags] = useState('Peace, Faith, Anxiety, Trust');
  const [summary, setSummary] = useState('Pastor Emmanuel explores the story of Jesus calming the storm, reminding us that peace is not the absence of trouble but the presence of God.');
  const [pastor, setPastor] = useState('1');
  const [series, setSeries] = useState('1');
  const [programme, setProgramme] = useState('sunday_service');
  const [accessLevel, setAccessLevel] = useState('paid');
  const [status, setStatus] = useState('published');
  const [threeDgDay, setThreeDgDay] = useState('1');
  const [threeDgSession, setThreeDgSession] = useState('morning');
  const [specialName, setSpecialName] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="max-w-4xl">
      <Link href="/sermons" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} /> Back to sermons
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Edit sermon</h1>
        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize ${
          status === 'published' ? 'bg-teal-light text-teal' : status === 'draft' ? 'bg-amber-light text-amber' : 'bg-[#F3EAF9] text-[#4A1572]'
        }`}>{status}</span>
      </div>

      {/* Main details */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
          </div>
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Pastor / Speaker</label>
              <select value={pastor} onChange={(e) => setPastor(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                {PASTORS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Series</label>
              <select value={series} onChange={(e) => setSeries(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                <option value="">No series</option>
                <option value="1">Finding Peace</option>
                <option value="2">Power of Faith</option>
                <option value="4">3DG April 2025</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Programme type</label>
              <select value={programme} onChange={(e) => setProgramme(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
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
                <select value={threeDgDay} onChange={(e) => setThreeDgDay(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                  <option value="1">Day 1</option><option value="2">Day 2</option><option value="3">Day 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Session</label>
                <select value={threeDgSession} onChange={(e) => setThreeDgSession(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
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
        </div>
      </div>

      {/* AI content */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-medium text-text-primary">AI-generated content</h2>
          <button className="inline-flex items-center gap-1.5 text-[12px] text-[#4A1572] font-medium hover:opacity-80">
            <Sparkles size={14} /> Re-generate
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Tags</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
          </div>
          <div>
            <label className="block text-[12px] text-text-secondary mb-1">Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-medium text-text-primary">Transcript</h2>
          <button onClick={() => setShowTranscript(!showTranscript)} className="text-[12px] text-[#4A1572] font-medium">
            {showTranscript ? 'Collapse' : 'Show transcript'}
          </button>
        </div>
        {showTranscript && (
          <div className="space-y-2">
            {MOCK_TRANSCRIPT.map((line, i) => (
              <p key={i} className="text-[12px] text-text-secondary leading-relaxed border-l-2 border-black/[0.06] pl-3 py-1">{line}</p>
            ))}
            <p className="text-[10px] text-text-tertiary mt-2">Transcript can be edited after AI processing</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="bg-[#4A1572] text-white rounded-lg px-6 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
          Save changes
        </button>
        {status === 'published' ? (
          <button className="border border-coral text-coral rounded-lg px-6 py-2.5 text-[13px] font-medium hover:bg-coral-light transition-colors">
            Unpublish
          </button>
        ) : (
          <button className="border border-teal text-teal rounded-lg px-6 py-2.5 text-[13px] font-medium hover:bg-teal-light transition-colors">
            Publish now
          </button>
        )}
        <button className="border border-black/15 rounded-lg px-6 py-2.5 text-[13px] text-text-secondary hover:bg-white transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}
