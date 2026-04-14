import { Plus } from 'lucide-react';

const CODES = [
  { code: 'EHCC2025', discount: '20%', maxUses: 100, used: 34, expires: '31 Dec 2025', active: true },
  { code: 'WELCOME10', discount: '10%', maxUses: null, used: 156, expires: null, active: true },
  { code: 'EASTER24', discount: '25%', maxUses: 50, used: 50, expires: '30 Apr 2024', active: false },
];

export default function DiscountCodesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-text-primary">Discount codes</h1>
        <button className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus size={16} /> Create code
        </button>
      </div>
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Code</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Discount</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Usage</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Expires</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {CODES.map((c, i) => (
              <tr key={c.code} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                <td className="px-4 py-3 text-[13px] font-medium font-mono text-text-primary">{c.code}</td>
                <td className="px-4 py-3 text-[13px] text-[#4A1572] font-medium">{c.discount}</td>
                <td className="px-4 py-3 text-[11px] text-text-tertiary hidden sm:table-cell">{c.used}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                <td className="px-4 py-3 text-[11px] text-text-tertiary hidden md:table-cell">{c.expires || 'No expiry'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${c.active ? 'bg-teal-light text-teal' : 'bg-surface text-text-tertiary'}`}>{c.active ? 'Active' : 'Expired'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
