'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPatch } from '../../../../lib/api';

interface PrayerSettingsData {
  id: string;
  teamsLink: string | null;
  meetingTime: string;
}

export default function PrayerSettingsPage() {
  const [settings, setSettings] = useState<PrayerSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [teamsLink, setTeamsLink] = useState('');
  const [meetingTime, setMeetingTime] = useState('00:00');

  useEffect(() => {
    adminGet<PrayerSettingsData>('/admin/prayer/settings')
      .then((data) => {
        setSettings(data);
        setTeamsLink(data.teamsLink || '');
        setMeetingTime(data.meetingTime || '00:00');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const updated = await adminPatch<PrayerSettingsData>('/admin/prayer/settings', {
        teamsLink: teamsLink.trim() || null,
        meetingTime,
      });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageSkeleton type="form" />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Prayer settings</h1>
      <div className="bg-white border border-black/10 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Microsoft Teams meeting link</label>
          <input
            type="text"
            value={teamsLink}
            onChange={(e) => setTeamsLink(e.target.value)}
            placeholder="https://teams.microsoft.com/l/meetup-join/..."
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]"
          />
        </div>
        <div>
          <label className="block text-[12px] text-text-secondary mb-1">Meeting time</label>
          <input
            type="time"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]"
          />
        </div>
        {error && <p className="text-[12px] text-red-500">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
          {saved ? 'Saved' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
