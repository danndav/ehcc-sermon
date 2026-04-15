'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, ChevronRight, Loader2, X, Pencil } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminPatch } from '../../../lib/api';

interface Branch {
  id: number;
  code: string | null;
  name: string | null;
  location: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  isActive: boolean;
}

interface BranchForm {
  code: string;
  name: string;
  location: string;
  country: string;
  state: string;
  city: string;
}

const emptyForm: BranchForm = { code: '', name: '', location: '', country: '', state: '', city: '' };

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadBranches = () => {
    adminGet<Branch[]>('/admin/branches')
      .then(setBranches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBranches(); }, []);

  const openCreate = () => {
    setEditingBranch(null);
    setForm(emptyForm);
    setSaveError(null);
    setShowModal(true);
  };

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setForm({
      code: branch.code || '',
      name: branch.name || '',
      location: branch.location || '',
      country: branch.country || '',
      state: branch.state || '',
      city: branch.city || '',
    });
    setSaveError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      setSaveError('Code and name are required');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        location: form.location.trim() || undefined,
        country: form.country.trim() || undefined,
        state: form.state.trim() || undefined,
        city: form.city.trim() || undefined,
      };
      if (editingBranch) {
        await adminPatch(`/admin/branches/${editingBranch.id}`, payload);
      } else {
        await adminPost('/admin/branches', payload);
      }
      setShowModal(false);
      setLoading(true);
      loadBranches();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save branch');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (branch: Branch) => {
    try {
      await adminPatch(`/admin/branches/${branch.id}`, { isActive: !branch.isActive });
      setBranches((prev) => prev.map((b) => b.id === branch.id ? { ...b, isActive: !b.isActive } : b));
    } catch {}
  };

  if (loading) {
    return <PageSkeleton type="cards" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-red-500">Failed to load branches: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Branches</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">Manage church branches and locations</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#4A1572] text-white text-[13px] font-medium rounded-lg hover:bg-[#3a1159] transition-colors"
        >
          <Plus size={16} />
          Add Branch
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary mb-1">Total branches</p>
          <p className="text-[20px] font-medium text-text-primary">{branches.length}</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary mb-1">Active</p>
          <p className="text-[20px] font-medium text-text-primary">{branches.filter(b => b.isActive).length}</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary mb-1">Countries</p>
          <p className="text-[20px] font-medium text-text-primary">{new Set(branches.map(b => b.country).filter(Boolean)).size}</p>
        </div>
      </div>

      {/* Branch list */}
      {branches.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-xl p-8 text-center">
          <MapPin size={32} className="mx-auto text-text-tertiary mb-2" />
          <p className="text-[14px] text-text-secondary">No branches found</p>
          <p className="text-[12px] text-text-tertiary mt-1">Click "Add Branch" to create one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white border border-black/10 rounded-xl p-4 hover:border-[#9B59B6]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    branch.code === 'HQ' ? 'bg-[#F3EAF9] text-[#4A1572]' : 'bg-surface text-text-secondary'
                  }`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-medium text-text-primary">{branch.name || 'Unnamed'}</p>
                      {branch.code && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface text-text-tertiary">{branch.code}</span>
                      )}
                      {branch.code === 'HQ' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F3EAF9] text-[#4A1572]">Headquarters</span>
                      )}
                    </div>
                    <p className="text-[12px] text-text-tertiary mt-0.5">{branch.location || [branch.city, branch.state, branch.country].filter(Boolean).join(', ') || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleActive(branch)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-colors ${
                      branch.isActive ? 'bg-teal-light text-teal hover:bg-teal/20' : 'bg-surface text-text-tertiary hover:bg-black/10'
                    }`}
                  >
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => openEdit(branch)}
                    className="p-1.5 rounded-lg hover:bg-surface text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/10">
              <h2 className="text-[16px] font-medium text-text-primary">
                {editingBranch ? 'Edit Branch' : 'Add Branch'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-surface text-text-tertiary">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-text-tertiary mb-1">Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g. PH"
                    maxLength={10}
                    className="w-full px-3 py-2 text-[13px] border border-black/10 rounded-lg focus:outline-none focus:border-[#9B59B6] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary mb-1">Country</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. Nigeria"
                    className="w-full px-3 py-2 text-[13px] border border-black/10 rounded-lg focus:outline-none focus:border-[#9B59B6] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-text-tertiary mb-1">Branch Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Enthronement Assembly Port Harcourt"
                  className="w-full px-3 py-2 text-[13px] border border-black/10 rounded-lg focus:outline-none focus:border-[#9B59B6] bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-text-tertiary mb-1">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Port Harcourt, Nigeria"
                  className="w-full px-3 py-2 text-[13px] border border-black/10 rounded-lg focus:outline-none focus:border-[#9B59B6] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-text-tertiary mb-1">State</label>
                  <input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="e.g. Rivers"
                    className="w-full px-3 py-2 text-[13px] border border-black/10 rounded-lg focus:outline-none focus:border-[#9B59B6] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary mb-1">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Port Harcourt"
                    className="w-full px-3 py-2 text-[13px] border border-black/10 rounded-lg focus:outline-none focus:border-[#9B59B6] bg-white"
                  />
                </div>
              </div>

              {saveError && (
                <p className="text-[12px] text-red-500">{saveError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-5 border-t border-black/10">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-[13px] text-text-secondary hover:bg-surface rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A1572] text-white text-[13px] font-medium rounded-lg hover:bg-[#3a1159] transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingBranch ? 'Save Changes' : 'Add Branch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
