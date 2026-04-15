'use client';

import { useState, useEffect } from 'react';
import { Clock, Download } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet } from '@/lib/api';

interface PrayerLog {
  id: string;
  userId: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  loggedDate: string;
  createdAt: string;
}

interface UserInfo {
  id: number;
  eaNumber: string | null;
  name: string;
}

export default function PrayerLogsPage() {
  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState<Map<number, UserInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([
      adminGet<{ data: PrayerLog[]; total: number }>(`/admin/prayer/logs?page=${page}&limit=50`).catch(() => ({ data: [], total: 0 })),
      adminGet<{ users: UserInfo[]; total: number }>('/admin/users?limit=3000').catch(() => ({ users: [], total: 0 })),
    ]).then(([logsResult, usersResult]) => {
      setLogs(logsResult.data || []);
      setTotal(logsResult.total || 0);
      const userMap = new Map<number, UserInfo>();
      (usersResult.users || []).forEach((u: UserInfo) => userMap.set(u.id, u));
      setUsers(userMap);
    }).finally(() => setLoading(false));
  }, [page]);

  const formatName = (name: string) => name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

  const totalMinutes = logs.reduce((sum, l) => sum + l.durationMinutes, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Prayer Logs</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">Member prayer time submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary mb-1">Total entries</p>
          <p className="text-[20px] font-medium text-text-primary">{total}</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary mb-1">Total hours (this page)</p>
          <p className="text-[20px] font-medium text-[#4A1572]">{Math.round(totalMinutes / 60 * 10) / 10}</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <p className="text-[11px] text-text-tertiary mb-1">Unique members (this page)</p>
          <p className="text-[20px] font-medium text-teal">
            {new Set(logs.map(l => l.userId)).size}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        {loading ? (
          <PageSkeleton type="table" />
        ) : logs.length === 0 ? (
          <p className="p-8 text-center text-[13px] text-text-tertiary">No prayer logs yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Member</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">EA Number</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Start</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">End</th>
                  <th className="text-right text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const user = users.get(log.userId);
                  return (
                    <tr key={log.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <td className="px-4 py-3 text-[13px] text-text-primary">{user ? formatName(user.name) : `User #${log.userId}`}</td>
                      <td className="px-4 py-3"><span className="text-[12px] text-[#4A1572] font-medium">{user?.eaNumber || '—'}</span></td>
                      <td className="px-4 py-3 hidden md:table-cell text-[12px] text-text-secondary">{new Date(log.loggedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3 text-[12px] text-text-primary">{log.startTime}</td>
                      <td className="px-4 py-3 text-[12px] text-text-primary">{log.endTime}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[12px] text-teal font-medium">{Math.floor(log.durationMinutes / 60)}h {log.durationMinutes % 60}m</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 50 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary disabled:opacity-30">Previous</button>
          <span className="px-3 py-1.5 text-[12px] text-text-tertiary">Page {page}</span>
          <button onClick={() => setPage(page + 1)} disabled={logs.length < 50} className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
