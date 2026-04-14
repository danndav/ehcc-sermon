'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';

const MOCK_GIVING_STATS = {
  thisMonth: '\u20A62,450,000',
  lastMonth: '\u20A61,890,000',
  allTime: '\u20A618,340,000',
  tithes: '\u20A61,200,000',
  offerings: '\u20A6680,000',
  seeds: '\u20A6420,000',
  special: '\u20A6150,000',
};

const MOCK_DONATIONS = [
  { id: '1', name: 'Anonymous', type: 'Tithe', amount: '\u20A650,000', date: '14 Apr 2025', method: 'Paystack' },
  { id: '2', name: 'Adaeze Okonkwo', type: 'Offering', amount: '\u20A610,000', date: '13 Apr 2025', method: 'Paystack' },
  { id: '3', name: 'Anonymous', type: 'Seed', amount: '\u20A6100,000', date: '13 Apr 2025', method: 'Bank transfer' },
  { id: '4', name: 'Emmanuel Musa', type: 'Tithe', amount: '\u20A620,000', date: '12 Apr 2025', method: 'Paystack' },
  { id: '5', name: 'Grace Nwosu', type: 'Special', amount: '\u20A65,000', date: '11 Apr 2025', method: 'Paystack' },
  { id: '6', name: 'Anonymous', type: 'Offering', amount: '\u20A615,000', date: '10 Apr 2025', method: 'Bank transfer' },
];

export default function GivingAdminPage() {
  const [tab, setTab] = useState<'overview' | 'settings'>('overview');

  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Giving & donations</h1>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('overview')} className={`px-4 py-2 rounded-lg text-[13px] border transition-colors ${tab === 'overview' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'bg-white border-black/10 text-text-secondary'}`}>
          Overview
        </button>
        <button onClick={() => setTab('settings')} className={`px-4 py-2 rounded-lg text-[13px] border transition-colors ${tab === 'settings' ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'bg-white border-black/10 text-text-secondary'}`}>
          Settings
        </button>
      </div>

      {tab === 'overview' ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-white border border-black/10 rounded-xl p-4">
              <p className="text-[11px] text-text-tertiary">This month</p>
              <p className="text-[20px] font-medium text-text-primary mt-1">{MOCK_GIVING_STATS.thisMonth}</p>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-4">
              <p className="text-[11px] text-text-tertiary">Last month</p>
              <p className="text-[20px] font-medium text-text-primary mt-1">{MOCK_GIVING_STATS.lastMonth}</p>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-4">
              <p className="text-[11px] text-text-tertiary">All time</p>
              <p className="text-[20px] font-medium text-text-primary mt-1">{MOCK_GIVING_STATS.allTime}</p>
            </div>
          </div>

          {/* Breakdown by type */}
          <div className="bg-white border border-black/10 rounded-xl p-4 mb-5">
            <h2 className="text-[14px] font-medium text-text-primary mb-3">This month by type</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Tithes', value: MOCK_GIVING_STATS.tithes, color: 'text-[#4A1572]' },
                { label: 'Offerings', value: MOCK_GIVING_STATS.offerings, color: 'text-teal' },
                { label: 'Seeds', value: MOCK_GIVING_STATS.seeds, color: 'text-amber' },
                { label: 'Special', value: MOCK_GIVING_STATS.special, color: 'text-coral' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className={`text-[16px] font-medium ${item.color}`}>{item.value}</p>
                  <p className="text-[11px] text-text-tertiary">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-black/[0.06] flex items-center justify-between">
              <h2 className="text-[14px] font-medium text-text-primary">Recent donations</h2>
              <button className="text-[12px] text-[#4A1572] font-medium hover:opacity-80">Export CSV</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Donor</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Type</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Amount</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Method</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DONATIONS.map((d, i) => (
                  <tr key={d.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                    <td className="px-4 py-3 text-[13px] text-text-primary">{d.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                        d.type === 'Tithe' ? 'bg-[#F3EAF9] text-[#4A1572]' : d.type === 'Offering' ? 'bg-teal-light text-teal' : d.type === 'Seed' ? 'bg-amber-light text-amber' : 'bg-coral-light text-coral'
                      }`}>{d.type}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-primary">{d.amount}</td>
                    <td className="px-4 py-3 text-[11px] text-text-tertiary hidden md:table-cell">{d.date}</td>
                    <td className="px-4 py-3 text-[11px] text-text-tertiary hidden sm:table-cell">{d.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Settings tab */
        <div className="max-w-2xl space-y-4">
          <div className="bg-white border border-black/10 rounded-xl p-5">
            <h2 className="text-[14px] font-medium text-text-primary mb-3">Paystack settings</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Paystack public key</label>
                <input type="text" defaultValue="pk_live_..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] font-mono focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Paystack secret key</label>
                <input type="password" defaultValue="sk_live_..." className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] font-mono focus:outline-none focus:border-[#4A1572]" />
              </div>
              <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all">Save keys</button>
            </div>
          </div>
          <div className="bg-white border border-black/10 rounded-xl p-5">
            <h2 className="text-[14px] font-medium text-text-primary mb-3">Bank transfer details</h2>
            <p className="text-[12px] text-text-tertiary mb-3">Shown to users who choose bank transfer</p>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Bank name</label>
                <input type="text" defaultValue="GTBank" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Account number</label>
                <input type="text" defaultValue="0123456789" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <div>
                <label className="block text-[12px] text-text-secondary mb-1">Account name</label>
                <input type="text" defaultValue="Enthronement House Christian Center" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
              </div>
              <button className="bg-[#4A1572] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-all">Save details</button>
            </div>
          </div>
          <div className="bg-white border border-black/10 rounded-xl p-5">
            <h2 className="text-[14px] font-medium text-text-primary mb-3">Giving categories</h2>
            <p className="text-[12px] text-text-tertiary mb-3">Categories shown to users on the giving page</p>
            <div className="flex flex-wrap gap-2">
              {['Tithe', 'Offering', 'Seed', 'Special'].map((cat) => (
                <span key={cat} className="px-3 py-1 rounded-lg text-[12px] border border-black/10 bg-white text-text-primary flex items-center gap-2">
                  {cat} <button className="text-text-tertiary hover:text-coral text-[10px]">&times;</button>
                </span>
              ))}
              <button className="px-3 py-1 rounded-lg text-[12px] border border-dashed border-black/15 text-text-tertiary hover:border-[#4A1572] hover:text-[#4A1572] transition-colors">
                + Add category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
