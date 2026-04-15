'use client';

import { useState, useEffect } from 'react';
import { Shield, Search, Check, X } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost } from '@/lib/api';

const ADMIN_ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full control — settings, roles, branches, everything', color: 'bg-coral-light text-coral' },
  { value: 'admin', label: 'Admin', description: 'Content + users + analytics — no system settings', color: 'bg-[#F3EAF9] text-[#4A1572]' },
  { value: 'moderator', label: 'Moderator', description: 'Upload sermons, manage prayer wall — no user data', color: 'bg-amber-light text-amber' },
  { value: 'data_officer', label: 'Data Officer', description: 'View users, export data, attendance — no content upload', color: 'bg-teal-light text-teal' },
];

interface AdminUser {
  id: number;
  eaNumber: string;
  name: string;
  role: string;
}

export default function AppSettingsPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Add admin form
  const [eaNumber, setEaNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdmins = async () => {
    try {
      const result = await adminGet<{ users: AdminUser[]; total: number }>('/admin/users?limit=200');
      const admins = (result.users || []).filter(u =>
        ['super_admin', 'admin', 'moderator', 'data_officer'].includes(u.role)
      );
      setAdminUsers(admins);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleAddAdmin = async () => {
    if (!eaNumber.trim()) { setError('Enter an EA number'); return; }
    setError('');
    setMessage('');
    setAdding(true);

    try {
      const result = await adminPost<AdminUser>('/admin/users/set-role-by-ea', {
        eaNumber: eaNumber.toUpperCase(),
        role: selectedRole,
      });
      setMessage(`${result.name} is now ${selectedRole.replace('_', ' ')}`);
      setEaNumber('');
      loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed — check the EA number');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (user: AdminUser) => {
    if (!confirm(`Remove ${user.name} (${user.eaNumber}) from admin? They will become a regular member.`)) return;
    try {
      await adminPost('/admin/users/set-role-by-ea', { eaNumber: user.eaNumber, role: 'member' });
      loadAdmins();
    } catch {}
  };

  const getRoleBadge = (role: string) => {
    const opt = ADMIN_ROLE_OPTIONS.find(r => r.value === role);
    return opt ? opt.color : 'bg-surface text-text-tertiary';
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Role Management */}
        <div className="bg-white border border-black/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-[#4A1572]" />
            <h2 className="text-[14px] font-medium text-text-primary">Admin access</h2>
          </div>

          {/* Add new admin */}
          <div className="bg-surface rounded-lg p-3 mb-4">
            <p className="text-[12px] font-medium text-text-primary mb-2">Add admin by EA number</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={eaNumber}
                onChange={(e) => setEaNumber(e.target.value)}
                placeholder="EA/0042"
                className="flex-1 bg-white border border-black/[0.15] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#4A1572]"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white border border-black/[0.15] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#4A1572] appearance-none"
              >
                {ADMIN_ROLE_OPTIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <button
                onClick={handleAddAdmin}
                disabled={adding}
                className="bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 disabled:opacity-50 shrink-0"
              >
                {adding ? '...' : 'Add'}
              </button>
            </div>
            {error && <p className="text-[11px] text-coral mt-1.5">{error}</p>}
            {message && <p className="text-[11px] text-teal mt-1.5">{message}</p>}
          </div>

          {/* Role descriptions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {ADMIN_ROLE_OPTIONS.map(r => (
              <div key={r.value} className="border border-black/[0.06] rounded-lg p-2">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${r.color} mb-1`}>{r.label}</span>
                <p className="text-[10px] text-text-tertiary">{r.description}</p>
              </div>
            ))}
          </div>

          {/* Current admins */}
          <h3 className="text-[12px] font-medium text-text-secondary mb-2">Current admin users</h3>
          {loading ? (
            <PageSkeleton type="table" />
          ) : adminUsers.length > 0 ? (
            <div className="space-y-1.5">
              {adminUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[10px] font-medium">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[13px] text-text-primary">{user.name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}</p>
                      <p className="text-[10px] text-text-tertiary">{user.eaNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getRoleBadge(user.role)} capitalize`}>
                      {user.role.replace('_', ' ')}
                    </span>
                    {user.role !== 'super_admin' && (
                      <button onClick={() => handleRemoveAdmin(user)} className="text-text-tertiary hover:text-coral transition-colors" title="Remove admin access">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-text-tertiary py-4 text-center">No admin users found</p>
          )}
        </div>
      </div>
    </div>
  );
}
