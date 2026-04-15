'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Clock, Check } from 'lucide-react';
import { PRAYER_CATEGORIES } from '@/lib/constants';
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';
import { PrayerCardSkeleton } from '@/components/ui/skeleton';

interface PrayerRequest {
  id: string;
  userId: string;
  content: string;
  category: string;
  isPublic: boolean;
  prayerCount: number;
  createdAt: string;
}

interface PrayerSettings {
  teamsLink: string | null;
  meetingTime: string;
}

interface PrayerLog {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  loggedDate: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

export default function PrayerPage() {
  const [activeTab, setActiveTab] = useState<'wall' | 'log'>('wall');

  // Prayer Wall state
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [settings, setSettings] = useState<PrayerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [prayingFor, setPrayingFor] = useState<Set<string>>(new Set());
  const [requestText, setRequestText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('healing');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Prayer Log state
  const [prayerSlots, setPrayerSlots] = useState<TimeSlot[]>([{ start: '', end: '' }]);
  const [todayLogs, setTodayLogs] = useState<PrayerLog[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logMessage, setLogMessage] = useState('');

  const loadData = () => {
    Promise.all([
      fetch(`${API_BASE_URL}/prayer/wall`).then(r => r.ok ? r.json() : { data: [] }),
      fetch(`${API_BASE_URL}/prayer/settings`).then(r => r.ok ? r.json() : null),
    ]).then(([wallResult, settingsData]) => {
      setPrayers(wallResult.data || []);
      setSettings(settingsData);
    }).finally(() => setLoading(false));
  };

  const loadLogData = () => {
    const token = getToken();
    if (!token) return;
    Promise.all([
      fetch(`${API_BASE_URL}/prayer/logs/today`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE_URL}/prayer/logs/total`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : { totalMinutes: 0 }),
    ]).then(([logs, total]) => {
      setTodayLogs(logs || []);
      setTotalMinutes(total.totalMinutes || 0);
    });
  };

  useEffect(() => { loadData(); loadLogData(); }, []);

  // Prayer Wall handlers
  const filtered = activeCategory === 'All' ? prayers : prayers.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const handleSubmit = async () => {
    if (!requestText.trim()) return;
    const token = getToken();
    if (!token) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/prayer/request`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content: requestText, category: selectedCategory, isPublic: !isPrivate }) });
      setRequestText(''); setIsPrivate(false); loadData();
    } catch {} finally { setSubmitting(false); }
  };

  const handlePray = async (prayerId: string) => {
    const token = getToken();
    if (!token) return;
    const next = new Set(prayingFor); next.add(prayerId); setPrayingFor(next);
    try { await fetch(`${API_BASE_URL}/prayer/${prayerId}/pray`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); loadData(); } catch {}
  };

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs`;
    return `${Math.floor(diff / 86400)} days`;
  };

  const getInitials = (userId: string) => userId.slice(0, 2).toUpperCase();

  // Prayer Log handlers
  const isSlotValid = (slot: TimeSlot) => {
    if (!slot.start || !slot.end) return false;
    const [sh, sm] = slot.start.split(':').map(Number);
    const [eh, em] = slot.end.split(':').map(Number);
    const duration = ((eh * 60 + em) - (sh * 60 + sm) + 24 * 60) % (24 * 60);
    return duration > 0 && duration < 720;
  };

  const allSlotsValid = prayerSlots.length > 0 && prayerSlots.every(isSlotValid);

  const addSlot = () => setPrayerSlots([...prayerSlots, { start: '', end: '' }]);
  const removeSlot = (i: number) => setPrayerSlots(prayerSlots.filter((_, idx) => idx !== i));
  const updateSlot = (i: number, field: 'start' | 'end', value: string) => {
    const updated = [...prayerSlots];
    updated[i] = { ...updated[i], [field]: value };
    setPrayerSlots(updated);
  };

  const getSlotDuration = (slot: TimeSlot) => {
    if (!slot.start || !slot.end) return 0;
    const [sh, sm] = slot.start.split(':').map(Number);
    const [eh, em] = slot.end.split(':').map(Number);
    return ((eh * 60 + em) - (sh * 60 + sm) + 24 * 60) % (24 * 60);
  };

  const handleSubmitLog = async () => {
    if (!allSlotsValid) return;
    const token = getToken();
    if (!token) return;
    setLogSubmitting(true);
    setLogMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/prayer/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prayerLogs: prayerSlots.map(s => ({ startTime: s.start, endTime: s.end })) }),
      });
      if (res.ok) {
        setLogMessage('Prayer time logged!');
        setPrayerSlots([{ start: '', end: '' }]);
        loadLogData();
        setTimeout(() => setLogMessage(''), 3000);
      } else {
        const data = await res.json();
        setLogMessage(data.message || 'Failed to log prayer time');
      }
    } catch {
      setLogMessage('Failed to log prayer time');
    } finally { setLogSubmitting(false); }
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-page-title text-text-primary">Prayer Room</h1>

      {/* Top tabs */}
      <div className="flex bg-surface rounded-full p-0.5">
        <button onClick={() => setActiveTab('wall')} className={`flex-1 py-2 text-[12px] font-medium rounded-full transition-colors ${activeTab === 'wall' ? 'bg-[#4A1572] text-white' : 'text-text-tertiary'}`}>
          Prayer Wall
        </button>
        <button onClick={() => setActiveTab('log')} className={`flex-1 py-2 text-[12px] font-medium rounded-full transition-colors ${activeTab === 'log' ? 'bg-[#4A1572] text-white' : 'text-text-tertiary'}`}>
          Prayer Log
        </button>
      </div>

      {/* Prayer Streak */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[true, true, true, true, true, false, false].map((done, i) => (
            <div key={i} className={`w-6 h-2 rounded-full ${done ? 'bg-[#4A1572]' : 'border border-black/15'}`} />
          ))}
        </div>
        <span className="text-[11px] text-[#4A1572] font-medium">5 night streak</span>
      </div>

      {/* Nightly Prayer Card */}
      <div className="bg-[#3D1260] rounded-xl p-3 text-white">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] font-medium">Nightly prayer meeting</p>
          <span className="flex items-center gap-1 text-[10px] text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#E24B4A] animate-pulse" /> Live
          </span>
        </div>
        <p className="text-[11px] text-white/70 mb-3">Every night · {settings?.meetingTime || '12:00 AM'}</p>
        {settings?.teamsLink ? (
          <a href={settings.teamsLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#4A4BAD] text-white rounded-lg py-2 text-[13px] font-medium text-center hover:opacity-90 transition-all">Join on Microsoft Teams</a>
        ) : (
          <button className="w-full bg-[#4A4BAD] text-white rounded-lg py-2 text-[13px] font-medium hover:opacity-90 transition-all">Join on Microsoft Teams</button>
        )}
      </div>

      {/* ============ PRAYER WALL TAB ============ */}
      {activeTab === 'wall' && (
        <>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {PRAYER_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-3 py-1 rounded-full text-[10px] border transition-colors ${activeCategory === cat ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]' : 'bg-surface border-black/10 text-text-secondary'}`}>{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <PrayerCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((prayer) => {
                const isPraying = prayingFor.has(prayer.id);
                return (
                  <div key={prayer.id} className="bg-white border border-black/10 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-[28px] h-[28px] rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[10px] font-medium shrink-0">{getInitials(prayer.userId)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[13px] font-medium text-text-primary">Member</span>
                          <span className="text-[10px] text-text-tertiary">{timeAgo(prayer.createdAt)}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] border border-black/10 bg-surface text-text-secondary capitalize">{prayer.category}</span>
                        </div>
                        <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{prayer.content}</p>
                        <button onClick={() => handlePray(prayer.id)} className={`mt-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${isPraying ? 'bg-teal-light border border-[#5DCAA5] text-teal' : 'border border-black/15 text-text-tertiary'}`}>
                          {isPraying ? 'Praying for this' : 'Pray for this'}
                          <span className="ml-1 text-[10px]">{prayer.prayerCount + (isPraying ? 1 : 0)} praying</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && <p className="text-[13px] text-text-tertiary text-center py-8">No prayer requests yet. Be the first to share.</p>}
            </div>
          )}

          <div className="bg-surface rounded-xl p-3">
            <h3 className="text-[13px] font-medium text-text-primary mb-2">Submit a prayer request</h3>
            <textarea value={requestText} onChange={(e) => setRequestText(e.target.value)} placeholder="Share your prayer request here..." rows={3} className="w-full bg-white border border-black/[0.15] rounded-lg px-3 py-2 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] resize-none" />
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="accent-[#4A1572]" />
                <span className="text-[11px] text-text-tertiary">Make private (pastor only)</span>
              </label>
              <button onClick={handleSubmit} disabled={submitting || !requestText.trim()} className="bg-[#4A1572] text-white rounded-lg px-4 py-1.5 text-[12px] font-medium hover:opacity-90 transition-all disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============ PRAYER LOG TAB ============ */}
      {activeTab === 'log' && (
        <>
          {/* Total prayer stats */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#F3EAF9] rounded-xl p-3 text-center">
              <p className="text-[20px] font-medium text-[#4A1572]">{Math.round(totalMinutes / 60 * 10) / 10}</p>
              <p className="text-[10px] text-[#4A1572]/60">Total hours prayed</p>
            </div>
            <div className="flex-1 bg-teal-light rounded-xl p-3 text-center">
              <p className="text-[20px] font-medium text-teal">{todayLogs.length}</p>
              <p className="text-[10px] text-teal/60">Logged today</p>
            </div>
          </div>

          {/* Log prayer time form */}
          <div className="bg-white border border-black/10 rounded-xl p-4">
            <h3 className="text-[13px] font-medium text-text-primary mb-3">Log your prayer time</h3>

            <div className="space-y-3">
              {prayerSlots.map((slot, i) => {
                const duration = getSlotDuration(slot);
                const valid = isSlotValid(slot);
                return (
                  <div key={i}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] text-text-tertiary mb-1">Start time</label>
                        <div className="relative">
                          <input type="time" value={slot.start} onChange={(e) => updateSlot(i, 'start', e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] text-text-tertiary mb-1">End time</label>
                        <div className="relative">
                          <input type="time" value={slot.end} onChange={(e) => updateSlot(i, 'end', e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
                        </div>
                      </div>
                      {prayerSlots.length > 1 && (
                        <button onClick={() => removeSlot(i)} className="mt-4 text-text-tertiary hover:text-coral"><X size={16} /></button>
                      )}
                    </div>
                    {slot.start && slot.end && (
                      <p className={`text-[10px] mt-1 ${valid ? 'text-teal' : 'text-coral'}`}>
                        {valid ? `${Math.floor(duration / 60)}h ${duration % 60}m` : 'Invalid time range'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={addSlot} className="flex items-center gap-1 text-[12px] text-[#4A1572] font-medium mt-3 hover:opacity-80">
              <Plus size={14} /> Add another time slot
            </button>

            <p className="text-[10px] text-text-tertiary mt-2">Note: End time must be after start time. Max 12 hours per slot.</p>

            {logMessage && (
              <p className={`text-[12px] mt-2 ${logMessage.includes('logged') ? 'text-teal' : 'text-coral'}`}>{logMessage}</p>
            )}

            <button
              onClick={handleSubmitLog}
              disabled={logSubmitting || !allSlotsValid}
              className="mt-3 w-full bg-[#4A1572] text-white rounded-lg py-2.5 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {logSubmitting ? 'Submitting...' : 'Log prayer time'}
            </button>
          </div>

          {/* Today's logs */}
          {todayLogs.length > 0 && (
            <div>
              <h3 className="text-[13px] font-medium text-text-primary mb-2">Today&apos;s prayer times</h3>
              <div className="space-y-1.5">
                {todayLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between bg-white border border-black/10 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#4A1572]" />
                      <span className="text-[13px] text-text-primary">{log.startTime} — {log.endTime}</span>
                    </div>
                    <span className="text-[11px] text-teal font-medium">
                      {Math.floor(log.durationMinutes / 60)}h {log.durationMinutes % 60}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
