import { Plus } from 'lucide-react';

const ADMINS = [
  { name: 'Tunde Balogun', email: 'tunde@ehcc.org', lastLogin: '30 min ago' },
  { name: 'Rev Deji Olabode', email: 'deji@ehcc.org', lastLogin: '2 hours ago' },
];

export default function AdminAccountsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Admin accounts</h1>
      <div className="bg-white border border-black/10 rounded-xl p-5">
        <div className="space-y-3 mb-4">
          {ADMINS.map((admin) => (
            <div key={admin.email} className="flex items-center justify-between py-2 border-b border-black/[0.06] last:border-0">
              <div>
                <p className="text-[13px] font-medium text-text-primary">{admin.name}</p>
                <p className="text-[11px] text-text-tertiary">{admin.email} · Last login: {admin.lastLogin}</p>
              </div>
              <button className="text-[11px] text-coral hover:opacity-80">Remove</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="email" placeholder="Invite by email" className="flex-1 bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#4A1572]" />
          <button className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-1.5">
            <Plus size={14} /> Invite
          </button>
        </div>
      </div>
    </div>
  );
}
