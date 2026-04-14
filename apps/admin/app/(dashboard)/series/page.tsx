import { Plus } from 'lucide-react';

const MOCK_SERIES = [
  { id: '1', title: 'Finding Peace', episodes: 4, status: 'active' },
  { id: '2', title: 'Power of Faith', episodes: 6, status: 'active' },
  { id: '3', title: 'Walking in Purpose', episodes: 3, status: 'completed' },
  { id: '4', title: '3DG April 2025 — Open Heavens', episodes: 6, status: 'active' },
];

export default function SeriesManagementPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Series</h1>
        <button className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Create series
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOCK_SERIES.map((series) => (
          <div key={series.id} className="bg-white border border-black/10 rounded-xl p-4">
            <h3 className="text-[14px] font-medium text-text-primary">{series.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-text-tertiary">{series.episodes} episodes</span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${series.status === 'active' ? 'bg-teal-light text-teal' : 'bg-surface text-text-tertiary'}`}>{series.status}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="text-[11px] text-[#4A1572] font-medium hover:opacity-80">Edit</button>
              <button className="text-[11px] text-text-tertiary hover:text-coral">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
