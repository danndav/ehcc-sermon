'use client';

import { useState } from 'react';

export default function PrayerSettingsPage() {
  const [teamsLink, setTeamsLink] = useState('https://teams.microsoft.com/l/meetup-join/...');
  const [meetingTime, setMeetingTime] = useState('00:00');

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Prayer settings</h1>
      <div className="bg-white border border-black/10 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Microsoft Teams meeting link</label>
          <input type="text" value={teamsLink} onChange={(e) => setTeamsLink(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
        </div>
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Meeting time</label>
          <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
        </div>
        <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all">Save settings</button>
      </div>
    </div>
  );
}
