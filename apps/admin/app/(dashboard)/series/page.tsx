'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const MOCK_SERIES = [
  { id: '1', title: 'Finding Peace', description: 'Discovering God\'s peace in every season', episodes: 4, status: 'active' },
  { id: '2', title: 'Power of Faith', description: 'Walking by faith in every area of life', episodes: 6, status: 'active' },
  { id: '3', title: 'Walking in Purpose', description: 'Discovering your divine calling', episodes: 3, status: 'completed' },
  { id: '4', title: '3DG April 2025 — Open Heavens', description: 'Three Days of Glory, April 2025', episodes: 6, status: 'active' },
];

export default function SeriesManagementPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Series</h1>
        <button onClick={() => setShowCreate(true)} className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Create series
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white border border-[#9B59B6] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">New series</h2>
            <button onClick={() => setShowCreate(false)} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Title</label>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Series title" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Description</label>
              <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief description..." rows={2} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Thumbnail</label>
              <div className="border border-dashed border-black/15 rounded-lg px-3 py-3 text-center">
                <p className="text-[11px] text-text-tertiary">Click to upload thumbnail image</p>
              </div>
            </div>
            <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all">
              Create series
            </button>
          </div>
        </div>
      )}

      {/* Series list */}
      <div className="space-y-3">
        {MOCK_SERIES.map((series) => (
          <div key={series.id} className="bg-white border border-black/10 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-medium text-text-primary">{series.title}</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${series.status === 'active' ? 'bg-teal-light text-teal' : 'bg-surface text-text-tertiary'}`}>{series.status}</span>
                </div>
                <p className="text-[12px] text-text-secondary mt-0.5">{series.description}</p>
                <p className="text-[11px] text-text-tertiary mt-1">{series.episodes} episodes</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="text-[11px] text-[#4A1572] font-medium hover:opacity-80">Edit</button>
                <button className="text-[11px] text-text-tertiary hover:text-coral">{series.status === 'active' ? 'Complete' : 'Reactivate'}</button>
                <button className="text-[11px] text-text-tertiary hover:text-coral">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
