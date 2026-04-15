'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2, Trash2, X } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminDelete } from '../../../../lib/api';

interface PrayerRecording {
  id: string;
  title: string;
  ledBy: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  duration: number | null;
  transcript: string | null;
  recordedAt: string | null;
  createdAt: string;
}

export default function PrayerRecordingsPage() {
  const [recordings, setRecordings] = useState<PrayerRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form
  const [formTitle, setFormTitle] = useState('');
  const [formLedBy, setFormLedBy] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formRecordedAt, setFormRecordedAt] = useState('');

  const loadRecordings = () => {
    adminGet<{ data: PrayerRecording[] }>('/admin/prayer/recordings?limit=100')
      .then((res) => setRecordings(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRecordings(); }, []);

  const handleCreate = async () => {
    if (!formTitle.trim()) { setSaveError('Title is required'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      await adminPost('/admin/prayer/recordings', {
        title: formTitle.trim(),
        ledBy: formLedBy.trim() || undefined,
        videoUrl: formVideoUrl.trim() || undefined,
        recordedAt: formRecordedAt || undefined,
      });
      setShowForm(false);
      setFormTitle(''); setFormLedBy(''); setFormVideoUrl(''); setFormRecordedAt('');
      setLoading(true);
      loadRecordings();
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDelete(`/admin/prayer/recordings/${id}`);
      setRecordings((prev) => prev.filter((r) => r.id !== id));
    } catch {}
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <PageSkeleton type="table" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-red-500">Failed to load recordings: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Prayer recordings</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2"
        >
          <Plus size={16} /> Add recording
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-[#9B59B6] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">New recording</h2>
            <button onClick={() => setShowForm(false)} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Title *</label>
                <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Nightly Prayer — April 15" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Led by</label>
                <input value={formLedBy} onChange={(e) => setFormLedBy(e.target.value)} placeholder="e.g. Rev Deji Olabode" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Video/Audio URL</label>
                <input value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} placeholder="https://..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Date recorded</label>
                <input type="date" value={formRecordedAt} onChange={(e) => setFormRecordedAt(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
            </div>
            {saveError && <p className="text-[12px] text-red-500">{saveError}</p>}
            <button onClick={handleCreate} disabled={saving} className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-1.5">
              {saving && <Loader2 size={14} className="animate-spin" />}
              Add recording
            </button>
          </div>
        </div>
      )}

      {recordings.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-xl p-8 text-center">
          <p className="text-[13px] text-text-tertiary">No recordings yet</p>
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Title</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Led by</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Duration</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((rec, i) => (
                <tr key={rec.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                  <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{rec.title}</td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{rec.ledBy || '—'}</td>
                  <td className="px-4 py-3 text-[11px] text-text-tertiary">{formatDate(rec.recordedAt || rec.createdAt)}</td>
                  <td className="px-4 py-3 text-[11px] text-text-tertiary hidden sm:table-cell">{formatDuration(rec.duration)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(rec.id)} className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-surface transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
