'use client';

import { useState } from 'react';
import { Heart, Gift, Sprout, HandCoins } from 'lucide-react';

const GIVING_TYPES = [
  { id: 'tithe', label: 'Tithe', icon: Heart, description: 'Your faithful 10%' },
  { id: 'offering', label: 'Offering', icon: Gift, description: 'A generous gift to God' },
  { id: 'seed', label: 'Seed', icon: Sprout, description: 'Sow into good ground' },
  { id: 'special', label: 'Special', icon: HandCoins, description: 'Building, missions, welfare' },
];

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function GivePage() {
  const [selectedType, setSelectedType] = useState('tithe');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-xl mx-auto">
      <h1 className="text-page-title text-text-primary mb-2">Give</h1>
      <p className="text-[13px] text-text-secondary mb-6">Your giving advances the Kingdom and blesses the house of God.</p>

      {/* Giving type */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {GIVING_TYPES.map((type) => {
          const Icon = type.icon;
          const active = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-3 rounded-xl border text-left transition-colors ${
                active
                  ? 'bg-[#F3EAF9] border-[#9B59B6]'
                  : 'bg-white border-black/10 hover:border-black/20'
              }`}
            >
              <Icon size={18} className={active ? 'text-[#4A1572]' : 'text-text-tertiary'} />
              <p className={`text-[13px] font-medium mt-1.5 ${active ? 'text-[#4A1572]' : 'text-text-primary'}`}>{type.label}</p>
              <p className="text-[10px] text-text-tertiary mt-0.5">{type.description}</p>
            </button>
          );
        })}
      </div>

      {/* Amount */}
      <div className="mb-5">
        <p className="text-[13px] font-medium text-text-primary mb-2">Select amount</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setAmount(String(amt)); setCustomAmount(false); }}
              className={`py-2.5 rounded-lg text-[13px] font-medium border transition-colors ${
                amount === String(amt) && !customAmount
                  ? 'bg-[#4A1572] border-[#4A1572] text-white'
                  : 'bg-white border-black/10 text-text-primary hover:border-black/20'
              }`}
            >
              ₦{amt.toLocaleString()}
            </button>
          ))}
        </div>
        <div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">₦</span>
            <input
              type="number"
              value={customAmount ? amount : ''}
              onChange={(e) => { setAmount(e.target.value); setCustomAmount(true); }}
              onFocus={() => setCustomAmount(true)}
              placeholder="Enter custom amount"
              className="w-full bg-surface border border-black/[0.15] rounded-lg pl-8 pr-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="mb-5">
        <p className="text-[13px] font-medium text-text-primary mb-2">Payment method</p>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-lg text-[12px] font-medium bg-[#F3EAF9] border border-[#9B59B6] text-[#4A1572]">
            Paystack
          </button>
          <button className="flex-1 py-2.5 rounded-lg text-[12px] border border-black/10 text-text-secondary">
            Bank transfer
          </button>
        </div>
      </div>

      {/* Give button */}
      <button
        disabled={!amount}
        className="w-full bg-[#4A1572] text-white rounded-lg py-3 text-[14px] font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {amount ? `Give ₦${Number(amount).toLocaleString()}` : 'Enter an amount'}
      </button>

      {/* Scripture */}
      <p className="text-center text-[11px] text-text-tertiary mt-4 italic">
        &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo; — 2 Corinthians 9:7
      </p>
    </div>
  );
}
