'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderOpen, Clock } from 'lucide-react';

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('personal');

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  const templates = [
    { name: 'Sermon notes', template: `## Sermon: \n## Speaker: \n## Date: ${today}\n\n## Key points\n\n1. \n2. \n3. \n\n## Scripture references\n\n- \n\n## Personal takeaway\n\n\n\n#sermon` },
    { name: 'Prayer journal', template: `## Prayer — ${today}\n\n### Thanksgiving\n\n\n### Requests\n\n\n### Declarations\n\n\n#prayer` },
    { name: 'Bible study', template: `## Passage: \n\n### Context\n\n\n### Key verses\n\n> \n\n### Observations\n\n\n### Application\n\n\n#bible-study` },
    { name: 'Daily note', template: `## ${today}\n\n### Morning thoughts\n\n\n### Today I'm grateful for\n\n1. \n2. \n3. \n\n### Reflections\n\n\n#daily` },
    { name: 'Blank', template: '' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/notes" className="text-text-tertiary hover:text-text-primary">
            <ArrowLeft size={18} />
          </Link>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="bg-surface border border-black/10 rounded-lg px-2.5 py-1 text-[12px] focus:outline-none focus:border-[#4A1572]"
          >
            <option value="sermon">Sermon notes</option>
            <option value="prayer">Prayer journal</option>
            <option value="bible-study">Bible study</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        <button className="bg-[#4A1572] text-white rounded-lg px-4 py-1.5 text-[12px] font-medium hover:opacity-90 transition-all">
          Save
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-[20px] font-medium text-text-primary placeholder:text-text-tertiary focus:outline-none mb-4"
          />

          {/* Templates */}
          {!content && (
            <div className="mb-6">
              <p className="text-[12px] text-text-tertiary mb-2">Start from a template:</p>
              <div className="flex gap-2 flex-wrap">
                {templates.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => { setContent(t.template); if (t.name !== 'Blank') setFolder(t.name === 'Sermon notes' ? 'sermon' : t.name === 'Prayer journal' ? 'prayer' : t.name === 'Bible study' ? 'bible-study' : 'personal'); }}
                    className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary hover:border-[#9B59B6] hover:bg-[#F3EAF9] hover:text-[#4A1572] transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing... Use **bold**, ## headings, - lists, and #tags"
            className="w-full min-h-[400px] text-[14px] text-text-primary leading-relaxed placeholder:text-text-tertiary focus:outline-none resize-none"
          />

          <div className="mt-4 pt-4 border-t border-black/[0.06]">
            <p className="text-[10px] text-text-tertiary">
              Formatting: **bold** · *italic* · ## heading · - list · &gt; quote · #tag · [[link to note]]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
