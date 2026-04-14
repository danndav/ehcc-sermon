'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SermonEditPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('Finding Peace in the Storm');
  const [status, setStatus] = useState('published');

  return (
    <div className="max-w-3xl">
      <Link href="/sermons" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} /> Back to sermons
      </Link>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Edit sermon</h1>
      <div className="bg-white border border-black/10 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
        </div>
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Description</label>
          <textarea rows={3} placeholder="Sermon description..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
        </div>
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Tags (comma separated)</label>
          <input type="text" defaultValue="Peace, Faith, Anxiety" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
        </div>
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">AI Summary</label>
          <textarea rows={2} placeholder="AI-generated summary..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
          <button className="mt-1 text-[11px] text-[#4A1572] font-medium">Re-generate with AI</button>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all">Save changes</button>
          <button className="border border-black/15 rounded-lg px-5 py-2.5 text-[13px] text-text-secondary hover:bg-surface transition-colors">Unpublish</button>
        </div>
      </div>
    </div>
  );
}
