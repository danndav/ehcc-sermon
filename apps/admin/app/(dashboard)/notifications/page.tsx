'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Send notification</h1>
      <div className="bg-white border border-black/10 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Audience</label>
          <div className="flex gap-2">
            {[{ value: 'all', label: 'All users' }, { value: 'subscribers', label: 'Subscribers only' }, { value: 'free', label: 'Free members' }].map((a) => (
              <button key={a.value} onClick={() => setAudience(a.value)} className={`px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${audience === a.value ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>{a.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
        </div>
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={4} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
        </div>
        <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Send size={14} /> Send notification
        </button>
      </div>
    </div>
  );
}
