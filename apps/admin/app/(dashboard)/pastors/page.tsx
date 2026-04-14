'use client';

import { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';

const PASTORS = [
  { id: '1', name: 'Rev Deji Olabode', role: 'Senior Pastor', bio: 'Senior Pastor of EHCC', sermons: 15, hasPhoto: true },
  { id: '2', name: 'Dr Seun Olabode', role: 'Co-Pastor', bio: 'Co-Pastor and head of women\'s ministry', sermons: 7, hasPhoto: true },
  { id: '3', name: 'Minister Joseph Sanni', role: 'Minister', bio: 'Minister at EHCC', sermons: 4, hasPhoto: false },
  { id: '4', name: 'Rev Gbeniyi Eboda', role: 'Reverend', bio: 'Reverend at EHCC', sermons: 2, hasPhoto: false },
  { id: '5', name: 'Pastor Korede Komaya', role: 'Pastor', bio: 'Pastor at EHCC', sermons: 2, hasPhoto: false },
];

export default function PastorsManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formBio, setFormBio] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Pastors / Speakers</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Add pastor
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white border border-[#9B59B6] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">Add new pastor</h2>
            <button onClick={() => setShowForm(false)} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-surface border-2 border-dashed border-black/15 flex items-center justify-center shrink-0 cursor-pointer hover:border-[#4A1572] transition-colors">
                <Upload size={20} className="text-text-tertiary" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-[12px] text-text-secondary mb-1">Full name</label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Pastor John Doe" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
                </div>
                <div>
                  <label className="block text-[12px] text-text-secondary mb-1">Role / Title</label>
                  <input type="text" value={formRole} onChange={(e) => setFormRole(e.target.value)} placeholder="e.g. Associate Pastor" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Bio</label>
              <textarea value={formBio} onChange={(e) => setFormBio(e.target.value)} placeholder="Brief biography..." rows={3} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
            </div>
            <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all">
              Add pastor
            </button>
          </div>
        </div>
      )}

      {/* Pastors table */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Pastor</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Role</th>
              <th className="text-right text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Sermons</th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {PASTORS.map((p, i) => {
              const initials = p.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
              return (
                <tr key={p.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${p.hasPhoto ? 'bg-[#F3EAF9] text-[#4A1572]' : 'bg-surface text-text-tertiary'}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">{p.name}</p>
                        <p className="text-[10px] text-text-tertiary md:hidden">{p.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{p.role}</td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary text-right">{p.sermons}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button className="text-[11px] text-[#4A1572] font-medium">Edit</button>
                      <button className="text-[11px] text-text-tertiary hover:text-coral">Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
