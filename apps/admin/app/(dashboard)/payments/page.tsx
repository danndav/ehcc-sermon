import { MOCK_PAYMENTS, MOCK_STATS } from '@/lib/mock-data';

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Revenue & payments</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary">This month</p>
          <p className="text-[20px] font-medium text-text-primary mt-1">{MOCK_STATS.monthlyRevenue}</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary">Last month</p>
          <p className="text-[20px] font-medium text-text-primary mt-1">₦945,000</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary">All time</p>
          <p className="text-[20px] font-medium text-text-primary mt-1">₦8,430,000</p>
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-black/[0.06] flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-text-primary">Transactions</h2>
          <button className="text-[12px] text-[#4A1572] font-medium hover:opacity-80">Export CSV</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Plan</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Amount</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Date</th>
              <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYMENTS.map((pay, i) => (
              <tr key={pay.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{pay.name}</td>
                <td className="px-4 py-3 text-[13px] text-text-secondary hidden sm:table-cell">{pay.plan}</td>
                <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{pay.amount}</td>
                <td className="px-4 py-3 text-[11px] text-text-tertiary hidden md:table-cell">{pay.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${pay.status === 'success' ? 'bg-teal-light text-teal' : 'bg-coral-light text-coral'}`}>{pay.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
