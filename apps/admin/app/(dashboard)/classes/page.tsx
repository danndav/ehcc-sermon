'use client';

import { useState } from 'react';
import { Plus, X, GraduationCap, Users, Upload } from 'lucide-react';

const MOCK_CLASSES = [
  { id: '1', title: 'Foundations of Faith', category: 'university', instructor: 'Rev Deji Olabode', lessons: 8, status: 'active', enrolled: 45 },
  { id: '2', title: 'Spiritual Leadership', category: 'university', instructor: 'Dr Seun Olabode', lessons: 6, status: 'active', enrolled: 23 },
  { id: '3', title: 'Marriage & Family', category: 'university', instructor: 'Rev & Dr Olabode', lessons: 5, status: 'completed', enrolled: 67 },
  { id: '4', title: 'Membership Class', category: 'membership', instructor: 'Rev Deji Olabode', lessons: 4, status: 'active', enrolled: 120 },
];

export default function ClassesManagementPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [category, setCategory] = useState('university');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Classes</h1>
        <button onClick={() => setShowCreate(true)} className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Create class
        </button>
      </div>

      {showCreate && (
        <div className="bg-white border border-[#9B59B6] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">New class</h2>
            <button onClick={() => setShowCreate(false)} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Class title</label>
              <input type="text" placeholder="e.g. Foundations of the Gospel" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Description</label>
              <textarea placeholder="Brief description of the class..." rows={2} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Category</label>
                <div className="flex gap-2">
                  <button onClick={() => setCategory('university')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] border transition-colors ${category === 'university' ? 'bg-amber-light border-amber text-amber font-medium' : 'border-black/10 text-text-secondary'}`}>
                    <GraduationCap size={14} /> University
                  </button>
                  <button onClick={() => setCategory('membership')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] border transition-colors ${category === 'membership' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'border-black/10 text-text-secondary'}`}>
                    <Users size={14} /> Membership
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Instructor</label>
                <select className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]">
                  <option value="">Select instructor</option>
                  <option>Rev Deji Olabode</option>
                  <option>Dr Seun Olabode</option>
                  <option>Minister Joseph Sanni</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Duration</label>
              <input type="text" placeholder="e.g. 8 weeks" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Thumbnail</label>
              <div className="border border-dashed border-black/15 rounded-lg px-3 py-3 text-center">
                <Upload size={16} className="mx-auto text-text-tertiary mb-1" />
                <p className="text-[11px] text-text-tertiary">Click to upload</p>
              </div>
            </div>
            <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all">
              Create class
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Instructor</th>
              <th className="text-right text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Lessons</th>
              <th className="text-right text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Enrolled</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Status</th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CLASSES.map((cls, i) => (
              <tr key={cls.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{cls.title}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${cls.category === 'membership' ? 'bg-[#F3EAF9] text-[#4A1572]' : 'bg-amber-light text-amber'}`}>
                    {cls.category === 'membership' ? <><Users size={10} /> Membership</> : <><GraduationCap size={10} /> University</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{cls.instructor}</td>
                <td className="px-4 py-3 text-[13px] text-text-secondary text-right">{cls.lessons}</td>
                <td className="px-4 py-3 text-[13px] text-text-secondary text-right hidden lg:table-cell">{cls.enrolled}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${cls.status === 'active' ? 'bg-teal-light text-teal' : 'bg-surface text-text-tertiary'}`}>{cls.status}</span>
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
