'use client';

import { useState } from 'react';
import { Plus, X, Video, Headphones, Search } from 'lucide-react';

const MOCK_KIDS_CONTENT = [
  { id: 'k1', title: 'David and Goliath', instructor: 'Min Joseph Sanni', duration: '15 min', mediaType: 'video', status: 'published', ageGroup: 'All ages' },
  { id: 'k2', title: 'Noah\'s Ark Adventure', instructor: 'Dr Seun Olabode', duration: '12 min', mediaType: 'video', status: 'published', ageGroup: 'Ages 4-8' },
  { id: 'k3', title: 'The Good Shepherd', instructor: 'Min Joseph Sanni', duration: '14 min', mediaType: 'video', status: 'published', ageGroup: 'All ages' },
  { id: 'k4', title: 'Daniel and the Lions', instructor: 'Dr Seun Olabode', duration: '13 min', mediaType: 'video', status: 'draft', ageGroup: 'Ages 4-8' },
  { id: 'k5', title: 'Joseph the Dreamer', instructor: 'Min Joseph Sanni', duration: '16 min', mediaType: 'audio', status: 'published', ageGroup: 'Ages 8-12' },
  { id: 'k6', title: 'The Miracle of the Loaves', instructor: 'Dr Seun Olabode', duration: '11 min', mediaType: 'video', status: 'published', ageGroup: 'All ages' },
];

const statusStyles: Record<string, string> = {
  published: 'bg-teal-light text-teal',
  draft: 'bg-amber-light text-amber',
};

export default function KidsManagementPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [mediaType, setMediaType] = useState('video');
  const [ageGroup, setAgeGroup] = useState('all');

  const filtered = MOCK_KIDS_CONTENT.filter((item) => {
    if (search) return item.title.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Kids content</h1>
        <button onClick={() => setShowUpload(true)} className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Upload kids content
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="bg-white border border-[#9B59B6] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">Upload new kids content</h2>
            <button onClick={() => setShowUpload(false)} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Title</label>
              <input type="text" placeholder="e.g. Moses and the Red Sea" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Instructor / Teacher</label>
                <select className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                  <option value="">Select</option>
                  <option>Min Joseph Sanni</option>
                  <option>Dr Seun Olabode</option>
                  <option>Rev Deji Olabode</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Age group</label>
                <select className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                  <option>All ages</option>
                  <option>Ages 4-8</option>
                  <option>Ages 8-12</option>
                  <option>Teens</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Media type</label>
              <div className="flex gap-2">
                <button onClick={() => setMediaType('video')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] border transition-colors ${mediaType === 'video' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>
                  <Video size={16} /> Video
                </button>
                <button onClick={() => setMediaType('audio')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] border transition-colors ${mediaType === 'audio' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>
                  <Headphones size={16} /> Audio
                </button>
              </div>
            </div>
            <div className="border-2 border-dashed border-black/15 rounded-xl p-6 text-center">
              <p className="text-[13px] text-text-secondary">Drag and drop {mediaType} file here or click to browse</p>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Tags (comma separated)</label>
              <input type="text" placeholder="e.g. Bible Story, Courage, Faith" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <div className="flex gap-2">
              <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all">Publish</button>
              <button className="border border-black/15 rounded-lg px-5 py-2 text-[13px] text-text-secondary hover:bg-surface transition-colors">Save as draft</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search kids content..." className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-[#4A1572]" />
      </div>

      {/* Table */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Instructor</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Age group</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Status</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-medium text-text-primary">{item.title}</p>
                  <p className="text-[10px] text-text-tertiary">{item.duration}</p>
                </td>
                <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{item.instructor}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {item.mediaType === 'video' ? <Video size={14} className="text-text-tertiary" /> : <Headphones size={14} className="text-text-tertiary" />}
                </td>
                <td className="px-4 py-3 text-[11px] text-text-tertiary hidden lg:table-cell">{item.ageGroup}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${statusStyles[item.status]}`}>{item.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button className="text-[11px] text-[#4A1572] font-medium">Edit</button>
                    <button className="text-[11px] text-text-tertiary hover:text-coral">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
