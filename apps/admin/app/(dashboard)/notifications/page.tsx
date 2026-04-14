'use client';

import { useState } from 'react';
import { Send, Clock } from 'lucide-react';

const NOTIFICATION_HISTORY = [
  { id: '1', title: 'New sermon: Open Heavens D3 Evening', audience: 'All users', sentAt: '3 Apr 2025, 9:00 PM', delivered: 312 },
  { id: '2', title: 'Nightly prayer starts in 30 minutes', audience: 'All users', sentAt: '2 Apr 2025, 11:30 PM', delivered: 198 },
  { id: '3', title: 'Your subscription renews tomorrow', audience: 'Subscribers', sentAt: '1 Apr 2025, 10:00 AM', delivered: 89 },
  { id: '4', title: 'New series: Power of Faith is live', audience: 'All users', sentAt: '28 Mar 2025, 8:00 AM', delivered: 287 },
];

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send form */}
        <div className="bg-white border border-black/10 rounded-xl p-5">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Send notification</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Audience</label>
              <div className="flex gap-2">
                {[{ value: 'all', label: 'All users' }, { value: 'subscribers', label: 'Subscribers' }, { value: 'free', label: 'Free members' }].map((a) => (
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
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={3} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={scheduleMode} onChange={(e) => setScheduleMode(e.target.checked)} className="accent-[#4A1572]" />
                <span className="text-[12px] text-text-secondary">Schedule for later</span>
              </label>
              {scheduleMode && (
                <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="mt-2 w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              )}
            </div>
            <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
              {scheduleMode ? <><Clock size={14} /> Schedule</> : <><Send size={14} /> Send now</>}
            </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-white border border-black/10 rounded-xl p-5">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Notification history</h2>
          <div className="space-y-3">
            {NOTIFICATION_HISTORY.map((n) => (
              <div key={n.id} className="py-2.5 border-b border-black/[0.06] last:border-0">
                <p className="text-[13px] font-medium text-text-primary">{n.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-text-tertiary">{n.sentAt}</span>
                  <span className="text-[10px] text-text-tertiary">·</span>
                  <span className="text-[10px] text-text-tertiary">{n.audience}</span>
                  <span className="text-[10px] text-text-tertiary">·</span>
                  <span className="text-[10px] text-teal">{n.delivered} delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
