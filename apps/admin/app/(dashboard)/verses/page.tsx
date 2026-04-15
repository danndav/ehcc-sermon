'use client';

import { useEffect, useState } from 'react';
import { Plus, BookOpen, Calendar, Edit2, Trash2, Check, Loader2 } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminPatch, adminDelete } from '../../../lib/api';

type VerseType = 'WEEK' | 'YEAR';

interface Verse {
  id: string;
  type: VerseType;
  scripture: string;
  reference: string;
  translation: string | null;
  branchId: number | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  setBy: string | null;
  createdAt: string;
}

interface Branch {
  id: number;
  code: string | null;
  name: string | null;
}

export default function VersesPage() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | VerseType>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [formType, setFormType] = useState<VerseType>('WEEK');
  const [formScripture, setFormScripture] = useState('');
  const [formReference, setFormReference] = useState('');
  const [formTranslation, setFormTranslation] = useState('NIV');
  const [formBranchId, setFormBranchId] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formSetBy, setFormSetBy] = useState('Rev Deji Olabode');

  const loadData = async () => {
    setLoading(true);
    try {
      const [versesData, branchesData] = await Promise.all([
        adminGet<Verse[]>('/admin/sermons/verses'),
        adminGet<Branch[]>('/admin/branches').catch(() => []),
      ]);
      setVerses(versesData);
      setBranches(branchesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = activeTab === 'all' ? verses : verses.filter((v) => v.type === activeTab);

  const resetForm = () => {
    setFormType('WEEK');
    setFormScripture('');
    setFormReference('');
    setFormTranslation('NIV');
    setFormBranchId('');
    setFormStartDate('');
    setFormEndDate('');
    setFormSetBy('Rev Deji Olabode');
    setEditingId(null);
    setSaveError(null);
  };

  const openEdit = (verse: Verse) => {
    setFormType(verse.type);
    setFormScripture(verse.scripture);
    setFormReference(verse.reference);
    setFormTranslation(verse.translation || 'NIV');
    setFormBranchId(verse.branchId ? String(verse.branchId) : '');
    setFormStartDate(verse.startDate ? verse.startDate.split('T')[0] : '');
    setFormEndDate(verse.endDate ? verse.endDate.split('T')[0] : '');
    setFormSetBy(verse.setBy || '');
    setEditingId(verse.id);
    setSaveError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formScripture.trim() || !formReference.trim() || !formStartDate) {
      setSaveError('Scripture, reference and start date are required');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        type: formType,
        scripture: formScripture.trim(),
        reference: formReference.trim(),
        translation: formTranslation || undefined,
        branchId: formBranchId ? Number(formBranchId) : undefined,
        startDate: formStartDate,
        endDate: formEndDate || undefined,
        setBy: formSetBy.trim() || undefined,
      };
      if (editingId) {
        await adminPatch(`/admin/sermons/verses/${editingId}`, payload);
      } else {
        await adminPost('/admin/sermons/verses', payload);
      }
      setShowForm(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDelete(`/admin/sermons/verses/${id}`);
      setVerses((prev) => prev.filter((v) => v.id !== id));
    } catch {}
  };

  const toggleActive = async (verse: Verse) => {
    try {
      await adminPatch(`/admin/sermons/verses/${verse.id}`, { isActive: !verse.isActive });
      setVerses((prev) => prev.map((v) => v.id === verse.id ? { ...v, isActive: !v.isActive } : v));
    } catch {}
  };

  const getBranchName = (branchId: number | null) => {
    if (!branchId) return null;
    const branch = branches.find((b) => b.id === branchId);
    return branch?.name || branch?.code || `Branch #${branchId}`;
  };

  if (loading) {
    return <PageSkeleton type="cards" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-red-500">Failed to load verses: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Verses</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">Manage verse of the week and verse of the year</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 bg-[#4A1572] text-white rounded-lg px-4 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          Add verse
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        {(['all', 'WEEK', 'YEAR'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#4A1572] text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'WEEK' ? 'Verse of the Week' : 'Verse of the Year'}
          </button>
        ))}
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white border border-black/10 rounded-xl p-5 mb-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-4">
            {editingId ? 'Edit verse' : 'New verse'}
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Type</label>
                <select value={formType} onChange={(e) => setFormType(e.target.value as VerseType)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                  <option value="WEEK">Verse of the Week</option>
                  <option value="YEAR">Verse of the Year</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Set by</label>
                <input value={formSetBy} onChange={(e) => setFormSetBy(e.target.value)} placeholder="Rev Deji Olabode" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Scripture *</label>
              <textarea value={formScripture} onChange={(e) => setFormScripture(e.target.value)} rows={3} placeholder="Enter the verse text..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Reference *</label>
                <input value={formReference} onChange={(e) => setFormReference(e.target.value)} placeholder="John 3:16" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Translation</label>
                <select value={formTranslation} onChange={(e) => setFormTranslation(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                  <option value="NIV">NIV</option>
                  <option value="KJV">KJV</option>
                  <option value="NKJV">NKJV</option>
                  <option value="ESV">ESV</option>
                  <option value="AMP">AMP</option>
                  <option value="MSG">MSG</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Branch</label>
                <select value={formBranchId} onChange={(e) => setFormBranchId(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none">
                  <option value="">All branches</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name || b.code}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Start date *</label>
                <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">End date</label>
                <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
            </div>

            {saveError && <p className="text-[12px] text-red-500">{saveError}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} disabled={saving} className="bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-1.5">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingId ? 'Update' : 'Save'}
              </button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="border border-black/15 rounded-lg px-5 py-2.5 text-[13px] text-text-secondary hover:bg-surface transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verse list */}
      <div className="space-y-2">
        {filtered.map((verse) => (
          <div key={verse.id} className="bg-white border border-black/10 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    verse.type === 'YEAR'
                      ? 'bg-[#F3EAF9] text-[#4A1572]'
                      : 'bg-teal-light text-teal'
                  }`}>
                    {verse.type === 'YEAR' ? 'Year' : 'Week'}
                  </span>
                  {verse.isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-light text-teal">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface text-text-tertiary">Inactive</span>
                  )}
                  {!verse.branchId ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700">All branches</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface text-text-secondary">
                      {getBranchName(verse.branchId)}
                    </span>
                  )}
                </div>

                <p className="text-[14px] text-text-primary italic leading-relaxed mb-1.5">
                  &ldquo;{verse.scripture}&rdquo;
                </p>
                <p className="text-[13px] font-medium text-[#4A1572]">
                  {verse.reference} {verse.translation && <span className="text-text-tertiary font-normal">({verse.translation})</span>}
                </p>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-text-tertiary">
                  {verse.setBy && (
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      Set by {verse.setBy}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {verse.startDate?.split('T')[0]} — {verse.endDate?.split('T')[0] || 'ongoing'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(verse)}
                  title={verse.isActive ? 'Deactivate' : 'Activate'}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    verse.isActive ? 'text-teal hover:bg-teal-light' : 'text-text-tertiary hover:bg-surface'
                  }`}
                >
                  <Check size={16} />
                </button>
                <button onClick={() => openEdit(verse)} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:bg-surface transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(verse.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-coral hover:bg-coral-light transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={32} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-[13px] text-text-tertiary">No verses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
