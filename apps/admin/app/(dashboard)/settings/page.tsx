'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AppSettingsPage() {
  const [featuredSermonId, setFeaturedSermonId] = useState('1');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [trialDays, setTrialDays] = useState('7');

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Settings</h1>

      <div className="space-y-4">
        <div className="bg-white border border-black/10 rounded-xl p-5">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">General</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Featured sermon ID</label>
              <input type="text" value={featuredSermonId} onChange={(e) => setFeaturedSermonId(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Default trial period (days)</label>
              <input type="number" value={trialDays} onChange={(e) => setTrialDays(e.target.value)} className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]" />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-[13px] text-text-primary">Maintenance mode</span>
              <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-10 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-coral' : 'bg-black/15'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${maintenanceMode ? 'left-5' : 'left-1'}`} />
              </button>
            </label>
          </div>
          <button className="mt-4 bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all">Save settings</button>
        </div>

        <div className="bg-white border border-black/10 rounded-xl p-5">
          <h2 className="text-[14px] font-medium text-text-primary mb-2">Admin accounts</h2>
          <p className="text-[12px] text-text-tertiary mb-3">Manage who has admin access</p>
          <Link href="/settings/admins" className="text-[13px] text-[#4A1572] font-medium hover:opacity-80">Manage admins →</Link>
        </div>
      </div>
    </div>
  );
}
