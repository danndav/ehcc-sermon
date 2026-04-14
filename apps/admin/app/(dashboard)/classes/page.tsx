import { Plus, GraduationCap, Users } from 'lucide-react';

const MOCK_CLASSES = [
  { id: '1', title: 'Foundations of Faith', category: 'university', instructor: 'Rev Deji Olabode', lessons: 8, status: 'active' },
  { id: '2', title: 'Spiritual Leadership', category: 'university', instructor: 'Dr Seun Olabode', lessons: 6, status: 'active' },
  { id: '3', title: 'Marriage & Family', category: 'university', instructor: 'Rev & Dr Olabode', lessons: 5, status: 'completed' },
  { id: '4', title: 'Membership Class', category: 'membership', instructor: 'Rev Deji Olabode', lessons: 4, status: 'active' },
];

export default function ClassesManagementPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Classes</h1>
        <button className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Create class
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Instructor</th>
              <th className="text-right text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Lessons</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Status</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CLASSES.map((cls, i) => (
              <tr key={cls.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{cls.title}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                    cls.category === 'membership' ? 'bg-[#F3EAF9] text-[#4A1572]' : 'bg-amber-light text-amber'
                  }`}>
                    {cls.category === 'membership' ? <><Users size={10} /> Membership</> : <><GraduationCap size={10} /> University</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{cls.instructor}</td>
                <td className="px-4 py-3 text-[13px] text-text-secondary text-right">{cls.lessons}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${cls.status === 'active' ? 'bg-teal-light text-teal' : 'bg-surface text-text-tertiary'}`}>{cls.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-[11px] text-[#4A1572] font-medium">Edit</button>
                  <button className="text-[11px] text-text-tertiary hover:text-coral">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
