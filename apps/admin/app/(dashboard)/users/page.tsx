'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';

const roleStyles: Record<string, string> = {
  admin: 'bg-[#F3EAF9] text-[#4A1572]',
  subscriber: 'bg-teal-light text-teal',
  member: 'bg-surface text-text-secondary',
  prayer_team: 'bg-amber-light text-amber',
};

export default function UsersManagementPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = MOCK_USERS.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Users</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-[#4A1572]" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'subscriber', 'member', 'prayer_team', 'admin'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-[12px] border capitalize transition-colors ${roleFilter === r ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'bg-white border-black/10 text-text-secondary'}`}>
              {r === 'prayer_team' ? 'Prayer team' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Subscription</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Joined</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Last active</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-text-primary">{user.name}</p>
                    <p className="text-[11px] text-text-tertiary md:hidden">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${roleStyles[user.role] || 'bg-surface text-text-tertiary'}`}>
                      {user.role === 'prayer_team' ? 'Prayer team' : user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-[11px] capitalize ${user.subscriptionStatus === 'active' ? 'text-teal' : user.subscriptionStatus === 'cancelled' ? 'text-coral' : 'text-text-tertiary'}`}>
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-text-tertiary hidden md:table-cell">{user.joinDate}</td>
                  <td className="px-4 py-3 text-[11px] text-text-tertiary hidden lg:table-cell">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
