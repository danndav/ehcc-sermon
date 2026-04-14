import { Plus } from 'lucide-react';

const PASTORS = [
  { id: '1', name: 'Rev Deji Olabode', role: 'Senior Pastor', sermons: 15 },
  { id: '2', name: 'Dr Seun Olabode', role: 'Co-Pastor', sermons: 7 },
  { id: '3', name: 'Minister Joseph Sanni', role: 'Minister', sermons: 4 },
  { id: '4', name: 'Rev Gbeniyi Eboda', role: 'Reverend', sermons: 2 },
  { id: '5', name: 'Pastor Korede Komaya', role: 'Pastor', sermons: 2 },
];

export default function PastorsManagementPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Pastors / Speakers</h1>
        <button className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Add pastor
        </button>
      </div>
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Role</th>
              <th className="text-right text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Sermons</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {PASTORS.map((p, i) => (
              <tr key={p.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{p.name}</td>
                <td className="px-4 py-3 text-[13px] text-text-secondary">{p.role}</td>
                <td className="px-4 py-3 text-[13px] text-text-secondary text-right">{p.sermons}</td>
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
