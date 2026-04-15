'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost } from '../../../lib/api';

interface User {
  id: number;
  eaNumber: string | null;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  role: string;
  isVerified: boolean;
  isSuspended: boolean;
  isStaff: boolean;
  department: string | null;
  branchId: number | null;
  lastLoginAt: string | null;
  createdAt: string;
}

const roleStyles: Record<string, string> = {
  super_admin: 'bg-[#F3EAF9] text-[#4A1572]',
  admin: 'bg-[#F3EAF9] text-[#4A1572]',
  moderator: 'bg-blue-50 text-blue-700',
  data_officer: 'bg-blue-50 text-blue-700',
  subscriber: 'bg-teal-light text-teal',
  member: 'bg-surface text-text-secondary',
  prayer_team: 'bg-amber-50 text-amber-700',
  guest: 'bg-surface text-text-tertiary',
};

const ROLES = ['all', 'subscriber', 'member', 'prayer_team', 'admin', 'super_admin', 'moderator', 'data_officer'];

const roleLabel = (r: string) => {
  if (r === 'prayer_team') return 'Prayer team';
  if (r === 'data_officer') return 'Data officer';
  if (r === 'super_admin') return 'Super admin';
  return r;
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const limit = 30;

  const loadUsers = useCallback(async (p: number, searchVal: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (searchVal.trim()) params.set('search', searchVal.trim());
      if (role && role !== 'all') params.set('role', role);
      const res = await adminGet<{ users: User[]; total: number }>(`/admin/users?${params}`);
      setUsers(res.users);
      setTotal(res.total);
      setPage(p);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(1, '', 'all'); }, [loadUsers]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadUsers(1, val, roleFilter);
    }, 400);
  };

  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    loadUsers(1, search, role);
  };

  const toggleSuspend = async (user: User) => {
    try {
      if (user.isSuspended) {
        await adminPost(`/admin/users/${user.id}/unsuspend`);
      } else {
        await adminPost(`/admin/users/${user.id}/suspend`);
      }
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u));
    } catch {}
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const timeAgo = (d: string | null) => {
    if (!d) return '—';
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading && users.length === 0 && !search) {
    return <PageSkeleton type="table" />;
  }

  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-red-500">Failed to load users: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Users</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">{total.toLocaleString()} {search || roleFilter !== 'all' ? 'matching' : 'total'} users</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, email or EA number..."
            className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-[#4A1572]"
          />
          {loading && search && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-text-tertiary" />
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ROLES.map((r) => (
            <button key={r} onClick={() => handleRoleChange(r)} className={`px-3 py-1.5 rounded-lg text-[12px] border capitalize transition-colors ${roleFilter === r ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572] font-medium' : 'bg-white border-black/10 text-text-secondary'}`}>
              {roleLabel(r)}
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
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">EA #</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Joined</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Last active</th>
                <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-text-tertiary">
                    {search ? `No users found for "${search}"` : 'No users found'}
                  </td>
                </tr>
              ) : users.map((user, i) => (
                <tr key={user.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-text-primary">{user.name}</p>
                    <p className="text-[11px] text-text-tertiary md:hidden">{user.email || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary hidden md:table-cell">{user.email || '—'}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary font-mono hidden lg:table-cell">{user.eaNumber || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${roleStyles[user.role] || 'bg-surface text-text-tertiary'}`}>
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-text-tertiary hidden md:table-cell">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-[11px] text-text-tertiary hidden lg:table-cell">{timeAgo(user.lastLoginAt)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {user.isSuspended ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600">Suspended</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-light text-teal">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSuspend(user)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        user.isSuspended
                          ? 'text-teal border border-teal/20 hover:bg-teal-light'
                          : 'text-red-500 border border-red-200 hover:bg-red-50'
                      }`}
                    >
                      {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-black/[0.06]">
          <p className="text-[12px] text-text-tertiary">
            {total > 0
              ? `Showing ${((page - 1) * limit) + 1}–${Math.min(page * limit, total)} of ${total.toLocaleString()} users`
              : 'No users'
            }
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadUsers(page - 1, search, roleFilter)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary hover:bg-surface disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <span className="text-[12px] text-text-secondary">Page {page} of {Math.max(totalPages, 1)}</span>
            <button
              onClick={() => loadUsers(page + 1, search, roleFilter)}
              disabled={page >= totalPages || totalPages <= 1}
              className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary hover:bg-surface disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
