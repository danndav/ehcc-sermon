'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newSermon: true,
    prayerReminder: true,
    weeklySummary: false,
    sermonMemories: true,
  });
  const [language, setLanguage] = useState('english');

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl">
      <Link href="/profile" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} />
        Back to profile
      </Link>

      <h1 className="text-page-title text-text-primary mb-5">Settings</h1>

      {/* Notification preferences */}
      <section className="mb-6">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">Notifications</h2>
        <div className="space-y-3">
          {[
            { key: 'newSermon', label: 'New sermon alerts' },
            { key: 'prayerReminder', label: 'Prayer meeting reminder' },
            { key: 'weeklySummary', label: 'Weekly summary email' },
            { key: 'sermonMemories', label: 'Sermon memories' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-text-primary">{item.label}</span>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-[#4A1572]' : 'bg-black/15'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? 'left-5' : 'left-1'
                }`} />
              </button>
            </label>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="mb-6">
        <h2 className="text-[14px] font-medium text-text-primary mb-3">Transcript language</h2>
        <div className="flex gap-2 flex-wrap">
          {['english', 'yoruba', 'igbo', 'hausa'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-[12px] capitalize transition-colors ${
                language === lang
                  ? 'bg-[#F3EAF9] border border-[#9B59B6] text-[#4A1572] font-medium'
                  : 'border border-black/10 text-text-secondary'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* Change password */}
      <section>
        <h2 className="text-[14px] font-medium text-text-primary mb-3">Change password</h2>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="password"
            placeholder="Current password"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors"
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors"
          />
          <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
            Update password
          </button>
        </form>
      </section>
    </div>
  );
}
