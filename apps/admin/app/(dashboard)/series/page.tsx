'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Image, Trash2, Edit2 } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminPatch, adminDelete, adminFetch, getAdminToken } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

interface Series {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function SeriesManagementPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formThumbnail, setFormThumbnail] = useState<File | null>(null);
  const [formThumbnailPreview, setFormThumbnailPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadSeries = async () => {
    try {
      const data = await adminGet<Series[]>('/admin/sermons/series/all');
      setSeriesList(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSeries(); }, []);

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormThumbnail(null);
    setFormThumbnailPreview('');
    setEditingId(null);
  };

  const handleFileSelect = (file: File | null) => {
    setFormThumbnail(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFormThumbnailPreview(url);
    } else {
      setFormThumbnailPreview('');
    }
  };

  const uploadThumbnail = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = getAdminToken();
      // Upload to R2 via a simple presigned approach — for now store as base64 data URL
      // In production this would go to R2/S3
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    } catch {
      return null;
    }
  };

  const handleSave = async () => {
    if (!formTitle.trim()) return;
    setSaving(true);

    try {
      let thumbnailUrl: string | null = null;
      if (formThumbnail) {
        thumbnailUrl = await uploadThumbnail(formThumbnail);
      }

      if (editingId) {
        const updateData: any = { title: formTitle, description: formDescription || null };
        if (thumbnailUrl) updateData.thumbnailUrl = thumbnailUrl;
        await adminPatch(`/admin/sermons/series/${editingId}`, updateData);
      } else {
        await adminPost('/admin/sermons/series', {
          title: formTitle,
          description: formDescription || null,
          thumbnailUrl,
        });
      }

      setShowCreate(false);
      resetForm();
      loadSeries();
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleEdit = (series: Series) => {
    setFormTitle(series.title);
    setFormDescription(series.description || '');
    setFormThumbnailPreview(series.thumbnailUrl || '');
    setEditingId(series.id);
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this series?')) return;
    await adminDelete(`/admin/sermons/series/${id}`);
    loadSeries();
  };

  const handleToggleActive = async (series: Series) => {
    await adminPatch(`/admin/sermons/series/${series.id}`, { isActive: !series.isActive });
    loadSeries();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Series</h1>
        <button onClick={() => { resetForm(); setShowCreate(true); }} className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Create series
        </button>
      </div>

      {/* Create / Edit form */}
      {showCreate && (
        <div className="bg-white border border-[#9B59B6] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">{editingId ? 'Edit series' : 'New series'}</h2>
            <button onClick={() => { setShowCreate(false); resetForm(); }} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Title</label>
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Series title" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Description</label>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Brief description..." rows={2} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Thumbnail</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
              {formThumbnailPreview ? (
                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-black/10">
                  <img src={formThumbnailPreview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => { setFormThumbnail(null); setFormThumbnailPreview(''); }} className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-black/15 rounded-lg px-3 py-4 text-center cursor-pointer hover:border-[#9B59B6] transition-colors"
                >
                  <Image size={20} className="mx-auto text-text-tertiary mb-1" />
                  <p className="text-[11px] text-text-tertiary">Click to upload thumbnail</p>
                </div>
              )}
            </div>
            <button onClick={handleSave} disabled={saving} className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update series' : 'Create series'}
            </button>
          </div>
        </div>
      )}

      {/* Series list */}
      {loading ? (
        <PageSkeleton type="cards" />
      ) : seriesList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[13px] text-text-tertiary">No series yet</p>
          <button onClick={() => setShowCreate(true)} className="text-[13px] text-[#4A1572] font-medium mt-2">Create your first series</button>
        </div>
      ) : (
        <div className="space-y-3">
          {seriesList.map((series) => (
            <div key={series.id} className="bg-white border border-black/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                {series.thumbnailUrl && (
                  <img src={series.thumbnailUrl} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-medium text-text-primary">{series.title}</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${series.isActive ? 'bg-teal-light text-teal' : 'bg-surface text-text-tertiary'}`}>
                      {series.isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  {series.description && <p className="text-[12px] text-text-secondary mt-0.5">{series.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(series)} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:bg-surface"><Edit2 size={14} /></button>
                  <button onClick={() => handleToggleActive(series)} className="text-[11px] text-text-tertiary hover:text-[#4A1572] px-2">
                    {series.isActive ? 'Complete' : 'Reactivate'}
                  </button>
                  <button onClick={() => handleDelete(series.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-coral"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
