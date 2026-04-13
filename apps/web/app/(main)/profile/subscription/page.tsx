import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl">
      <Link href="/profile" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} />
        Back to profile
      </Link>

      <h1 className="text-page-title text-text-primary mb-5">Subscription</h1>

      {/* Current plan */}
      <div className="bg-white border border-black/10 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-[15px] font-medium text-text-primary">EHCC Plus · Monthly</h2>
            <p className="text-[11px] text-text-tertiary mt-0.5">Renews 13 May 2025</p>
          </div>
          <span className="bg-teal-light text-teal text-[10px] font-medium rounded-lg px-2 py-0.5">Active</span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {['All sermons (free + paid)', 'Offline downloads', 'Study mode & notes', '5-day devotional generator', 'No ads'].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-[12px] text-text-secondary">
              <span className="w-1 h-1 rounded-full bg-[#4A1572]" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full border border-black/15 rounded-lg py-2.5 text-[13px] text-text-secondary hover:bg-surface transition-colors">
          Switch to annual plan (save 2 months)
        </button>
        <button className="w-full border border-[#4A1572] rounded-lg py-2.5 text-[13px] text-[#4A1572] font-medium hover:bg-[#F3EAF9] transition-colors">
          Gift a subscription
        </button>
        <button className="w-full text-[12px] text-text-tertiary hover:text-coral transition-colors py-2">
          Cancel subscription
        </button>
      </div>

      {/* Payment history */}
      <h2 className="text-[14px] font-medium text-text-primary mt-8 mb-3">Payment history</h2>
      <div className="space-y-2">
        {[
          { date: '13 Apr 2025', amount: '\u20A63,000', status: 'Paid' },
          { date: '13 Mar 2025', amount: '\u20A63,000', status: 'Paid' },
          { date: '13 Feb 2025', amount: '\u20A63,000', status: 'Paid' },
        ].map((payment) => (
          <div key={payment.date} className="flex items-center justify-between py-2 border-b border-black/[0.06]">
            <div>
              <p className="text-[13px] text-text-primary">{payment.date}</p>
              <p className="text-[11px] text-text-tertiary">EHCC Plus Monthly</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-medium text-text-primary">{payment.amount}</p>
              <p className="text-[10px] text-teal">{payment.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
