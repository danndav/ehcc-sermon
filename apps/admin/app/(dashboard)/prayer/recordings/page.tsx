import { Plus } from 'lucide-react';

const MOCK_RECORDINGS = [
  { id: '1', title: 'Nightly Prayer — April 12', ledBy: 'Rev Deji Olabode', date: '12 Apr 2025', duration: '58 min' },
  { id: '2', title: 'Nightly Prayer — April 11', ledBy: 'Dr Seun Olabode', date: '11 Apr 2025', duration: '62 min' },
  { id: '3', title: 'Nightly Prayer — April 10', ledBy: 'Min Joseph Sanni', date: '10 Apr 2025', duration: '55 min' },
];

export default function PrayerRecordingsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Prayer recordings</h1>
        <button className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Upload recording
        </button>
      </div>
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Led by</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Date</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Duration</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RECORDINGS.map((rec, i) => (
              <tr key={rec.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{rec.title}</td>
                <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{rec.ledBy}</td>
                <td className="px-4 py-3 text-[11px] text-text-tertiary">{rec.date}</td>
                <td className="px-4 py-3 text-[11px] text-text-tertiary hidden sm:table-cell">{rec.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
