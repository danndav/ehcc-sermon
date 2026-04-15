'use client';

import { useEffect, useState } from 'react';
import { Plus, X, Loader2, Trash2, Pencil } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminPatch, adminDelete } from '../../../lib/api';

interface Pastor {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  churchRole: string | null;
  branchId: number | null;
  createdAt: string;
}

export default function PastorsManagementPage() {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPastor, setEditingPastor] = useState<Pastor | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formBio, setFormBio] = useState('');

  const loadPastors = () => {
    adminGet<Pastor[]>('/admin/sermons/pastors/all')
      .then(setPastors)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPastors(); }, []);

  const resetForm = () => {
    setFormName('');
    setFormRole('');
    setFormBio('');
    setEditingPastor(null);
    setSaveError(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (pastor: Pastor) => {
    setEditingPastor(pastor);
    setFormName(pastor.name);
    setFormRole(pastor.churchRole || '');
    setFormBio(pastor.bio || '');
    setSaveError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setSaveError('Name is required');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        name: formName.trim(),
        churchRole: formRole.trim() || undefined,
        bio: formBio.trim() || undefined,
      };
      if (editingPastor) {
        await adminPatch(`/admin/sermons/pastors/${editingPastor.id}`, payload);
      } else {
        await adminPost('/admin/sermons/pastors', payload);
      }
      setShowForm(false);
      resetForm();
      setLoading(true);
      loadPastors();
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDelete(`/admin/sermons/pastors/${id}`);
      setPastors((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  if (loading) {
    return <PageSkeleton type="table" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-red-500">Failed to load pastors: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Pastors / Speakers</h1>
        <button onClick={openCreate} className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Add pastor
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white border border-[#9B59B6] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">
              {editingPastor ? 'Edit pastor' : 'Add new pastor'}
            </h2>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Full name *</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Pastor John Doe" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Role / Title</label>
                <input type="text" value={formRole} onChange={(e) => setFormRole(e.target.value)} placeholder="e.g. Associate Pastor" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Bio</label>
              <textarea value={formBio} onChange={(e) => setFormBio(e.target.value)} placeholder="Brief biography..." rows={3} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
            </div>
            {saveError && <p className="text-[12px] text-red-500">{saveError}</p>}
            <button onClick={handleSave} disabled={saving} className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-1.5">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editingPastor ? 'Save changes' : 'Add pastor'}
            </button>
          </div>
        </div>
      )}

      {/* Pastors table */}
      {pastors.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-xl p-8 text-center">
          <p className="text-[13px] text-text-tertiary">No pastors yet. Click "Add pastor" to create one.</p>
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Pastor</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Role</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Bio</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {pastors.map((p, i) => {
                const initials = p.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
                return (
                  <tr key={p.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${p.photoUrl ? 'bg-[#F3EAF9] text-[#4A1572]' : 'bg-surface text-text-tertiary'}`}>
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : initials}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-text-primary">{p.name}</p>
                          <p className="text-[10px] text-text-tertiary md:hidden">{p.churchRole || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{p.churchRole || '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-text-tertiary hidden lg:table-cell max-w-xs truncate">{p.bio || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-text-tertiary hover:text-[#4A1572] hover:bg-surface transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-surface transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
