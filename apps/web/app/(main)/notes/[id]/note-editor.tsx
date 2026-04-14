'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, FolderOpen, Link as LinkIcon, MoreHorizontal, Trash2, Clock } from 'lucide-react';

export default function NoteEditor({ id }: { id: string }) {
  const isNew = id === 'new';
  const [title, setTitle] = useState(isNew ? '' : 'Peace in the storm — sermon takeaways');
  const [content, setContent] = useState(isNew ? '' : `Peace is not the absence of the storm — it is the presence of God in the storm.

The disciples panicked, but Jesus slept. His peace was not dependent on circumstances.

## Key takeaways

1. **Peace is a Person** — Jesus IS our peace. It's not something we achieve, it's Someone we know.
2. **Storms reveal faith** — The storm didn't create their fear, it revealed it. What does your current storm reveal about your faith?
3. **He speaks to storms** — Jesus didn't fight the storm. He spoke to it. There's authority in His words.

## Scripture references
- Mark 4:35-41
- Isaiah 26:3 — "You will keep in perfect peace those whose minds are steadfast"
- Philippians 4:6-7

## Personal reflection
I've been anxious about the job situation. But this sermon reminded me that God is not asleep. He's on the boat with me. I need to trust His timing.

#peace #faith #sermon`);
  const [folder, setFolder] = useState(isNew ? 'personal' : 'sermon');
  const [showMeta, setShowMeta] = useState(false);

  // Parse tags from content
  const parsedTags = content.match(/#\w+/g)?.map((t) => t.slice(1)) || [];

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/notes" className="text-text-tertiary hover:text-text-primary">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowMeta(!showMeta)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-text-tertiary hover:bg-surface transition-colors"
            >
              <FolderOpen size={12} />
              <span className="capitalize">{folder}</span>
            </button>
            {parsedTags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag size={10} className="text-text-tertiary" />
                {parsedTags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] text-[#4A1572]">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-tertiary hidden sm:block">
            <Clock size={10} className="inline mr-0.5" />
            {isNew ? 'New note' : 'Edited 10:30 AM'}
          </span>
          <button className="text-text-tertiary hover:text-text-primary">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Metadata panel */}
      {showMeta && (
        <div className="px-4 py-3 bg-surface border-b border-black/[0.06] shrink-0">
          <div className="flex gap-3 flex-wrap">
            <div>
              <p className="text-[10px] text-text-tertiary mb-1">Folder</p>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="bg-white border border-black/10 rounded-lg px-2.5 py-1 text-[12px] focus:outline-none focus:border-[#4A1572]"
              >
                <option value="sermon">Sermon notes</option>
                <option value="prayer">Prayer journal</option>
                <option value="bible-study">Bible study</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] text-text-tertiary mb-1">Linked sermon</p>
              <select className="bg-white border border-black/10 rounded-lg px-2.5 py-1 text-[12px] focus:outline-none focus:border-[#4A1572]">
                <option value="">None</option>
                <option value="1">Finding Peace in the Storm</option>
                <option value="2">Power of Prayer</option>
                <option value="5">Overcoming Fear Through Faith</option>
              </select>
            </div>
          </div>
          <p className="text-[10px] text-text-tertiary mt-2">Tip: Add #tags anywhere in your note and they&apos;ll be detected automatically</p>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-[20px] font-medium text-text-primary placeholder:text-text-tertiary focus:outline-none mb-4"
          />

          {/* Templates (new note only) */}
          {isNew && !content && (
            <div className="mb-6">
              <p className="text-[12px] text-text-tertiary mb-2">Start from a template:</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { name: 'Sermon notes', template: '## Sermon: \n## Speaker: \n## Date: \n\n## Key points\n\n1. \n2. \n3. \n\n## Scripture references\n\n- \n\n## Personal takeaway\n\n\n\n#sermon' },
                  { name: 'Prayer journal', template: '## Prayer — ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '\n\n### Thanksgiving\n\n\n### Requests\n\n\n### Declarations\n\n\n#prayer' },
                  { name: 'Bible study', template: '## Passage: \n\n### Context\n\n\n### Key verses\n\n> \n\n### Observations\n\n\n### Application\n\n\n#bible-study' },
                  { name: 'Daily note', template: '## ' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) + '\n\n### Morning thoughts\n\n\n### Today I\'m grateful for\n\n1. \n2. \n3. \n\n### Reflections\n\n\n#daily' },
                ].map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setContent(t.template)}
                    className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary hover:border-[#9B59B6] hover:bg-[#F3EAF9] hover:text-[#4A1572] transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing... Use **bold**, ## headings, - lists, and #tags"
            className="w-full min-h-[400px] text-[14px] text-text-primary leading-relaxed placeholder:text-text-tertiary focus:outline-none resize-none font-mono"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />

          {/* Markdown hints */}
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
