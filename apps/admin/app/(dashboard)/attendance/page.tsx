'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ClipboardCheck, Calendar, Users, Plus, X, Loader2, Search } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost } from '@/lib/api';

interface AttendanceRecord {
  id: string;
  userId: number;
  branchId: number | null;
  latitude: number | null;
  longitude: number | null;
  clockedInAt: string;
  clockedOutAt: string | null;
}

interface UserInfo {
  id: number;
  eaNumber: string | null;
  name: string;
  branchId: number | null;
}

export default function AttendancePage() {
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [allTotal, setAllTotal] = useState(0);
  const [users, setUsers] = useState<Map<number, UserInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const [page, setPage] = useState(1);

  // Clock-in modal
  const [showClockIn, setShowClockIn] = useState(false);
  const [clockInSearch, setClockInSearch] = useState('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [clockingIn, setClockingIn] = useState(false);
  const [clockInError, setClockInError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const [today, all, usersResult] = await Promise.all([
        adminGet<{ data: AttendanceRecord[]; count: number }>('/admin/attendance/today').catch(() => ({ data: [], count: 0 })),
        adminGet<{ data: AttendanceRecord[]; total: number }>(`/admin/attendance?page=${p}&limit=50`).catch(() => ({ data: [], total: 0 })),
        adminGet<{ users: UserInfo[]; total: number }>('/admin/users?limit=3000').catch(() => ({ users: [], total: 0 })),
      ]);
      setTodayRecords(today.data || []);
      setTodayCount(today.count || 0);
      setAllRecords(all.data || []);
      setAllTotal(all.total || 0);

      const userMap = new Map<number, UserInfo>();
      (usersResult.users || []).forEach((u: UserInfo) => userMap.set(u.id, u));
      setUsers(userMap);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(page); }, [page, loadData]);

  const handleClockInSearch = (val: string) => {
    setClockInSearch(val);
    setClockInError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await adminGet<{ users: UserInfo[] }>(`/admin/users?search=${encodeURIComponent(val.trim())}&limit=10`);
        setSearchResults(res.users || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Location is not supported on this device'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => reject(new Error('Location access denied. Please enable location to clock in.')),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  };

  const handleClockIn = async (user: UserInfo) => {
    setClockingIn(true);
    setClockInError(null);
    try {
      const { latitude, longitude } = await getLocation();
      await adminPost('/admin/attendance/clock-in', {
        userId: user.id,
        latitude,
        longitude,
        branchId: user.branchId || undefined,
      });
      setShowClockIn(false);
      setClockInSearch('');
      setSearchResults([]);
      loadData(page);
    } catch (err: any) {
      setClockInError(err.message || 'Failed to clock in');
    } finally {
      setClockingIn(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatName = (name: string) => {
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const records = activeTab === 'today' ? todayRecords : allRecords;

  if (loading && todayRecords.length === 0 && allRecords.length === 0) {
    return <PageSkeleton type="table" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Attendance</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">Church attendance clock-in records</p>
        </div>
        <button
          onClick={() => { setShowClockIn(true); setClockInError(null); setClockInSearch(''); setSearchResults([]); }}
          className="flex items-center gap-1.5 bg-[#4A1572] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          Clock in member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center mb-2">
            <ClipboardCheck size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{todayCount}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Clocked in today</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-teal-light text-teal flex items-center justify-center mb-2">
            <Calendar size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{allTotal}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Total records</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Users size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">
            {todayRecords.filter(r => r.clockedOutAt).length}
          </p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Clocked out today</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        <button onClick={() => setActiveTab('today')} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'today' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          Today ({todayCount})
        </button>
        <button onClick={() => setActiveTab('all')} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'all' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          All records
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-[13px] text-text-tertiary">Loading...</p>
        ) : records.length === 0 ? (
          <p className="p-8 text-center text-[13px] text-text-tertiary">
            {activeTab === 'today' ? 'No one has clocked in today' : 'No attendance records yet'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Member</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">EA Number</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Clock In</th>
                  <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Clock Out</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, i) => {
                  const user = users.get(record.userId);
                  return (
                    <tr key={record.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-[13px] text-text-primary">{user ? formatName(user.name) : `User #${record.userId}`}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-[#4A1572] font-medium">{user?.eaNumber || '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-[12px] text-text-secondary">{formatDate(record.clockedInAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-teal font-medium">{formatTime(record.clockedInAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        {record.clockedOutAt ? (
                          <span className="text-[12px] text-coral font-medium">{formatTime(record.clockedOutAt)}</span>
                        ) : (
                          <span className="text-[11px] text-text-tertiary">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination for all records */}
      {activeTab === 'all' && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[12px] text-text-tertiary">
            {allTotal > 0 ? `Showing ${((page - 1) * 50) + 1}–${Math.min(page * 50, allTotal)} of ${allTotal}` : 'No records'}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary disabled:opacity-30">Previous</button>
            <span className="text-[12px] text-text-secondary">Page {page}</span>
            <button onClick={() => setPage(page + 1)} disabled={records.length < 50} className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary disabled:opacity-30">Next</button>
          </div>
        </div>
      )}

      {/* Clock-in Modal */}
      {showClockIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/10">
              <h2 className="text-[16px] font-medium text-text-primary">Clock in a member</h2>
              <button onClick={() => setShowClockIn(false)} className="p-1 rounded-lg hover:bg-surface text-text-tertiary">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <label className="block text-[12px] text-text-secondary mb-2">Search for member by name, email or EA number</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  value={clockInSearch}
                  onChange={(e) => handleClockInSearch(e.target.value)}
                  placeholder="e.g. Daniel or EA0042"
                  autoFocus
                  className="w-full bg-surface border border-black/[0.15] rounded-lg pl-9 pr-3 py-2.5 text-[13px] focus:outline-none focus:border-[#4A1572]"
                />
                {searching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-text-tertiary" />}
              </div>

              {clockInError && (
                <p className="text-[12px] text-red-500 mt-2">{clockInError}</p>
              )}

              {/* Search results */}
              <div className="mt-3 max-h-64 overflow-y-auto">
                {clockInSearch.trim() && !searching && searchResults.length === 0 && (
                  <p className="text-[12px] text-text-tertiary text-center py-4">No members found for &ldquo;{clockInSearch}&rdquo;</p>
                )}
                {searchResults.map((user) => {
                  const alreadyClockedIn = todayRecords.some(r => r.userId === user.id);
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg mb-1 ${alreadyClockedIn ? 'bg-surface/50' : 'hover:bg-surface cursor-pointer'}`}
                      onClick={() => !alreadyClockedIn && !clockingIn && handleClockIn(user)}
                    >
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">{formatName(user.name)}</p>
                        <p className="text-[11px] text-text-tertiary">{user.eaNumber || 'No EA number'}</p>
                      </div>
                      {alreadyClockedIn ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-light text-teal">Already in</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#4A1572] border border-[#4A1572]/20 hover:bg-[#F3EAF9] transition-colors">
                          Clock in
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {clockingIn && (
                <div className="flex items-center justify-center py-3">
                  <Loader2 size={16} className="animate-spin text-[#4A1572]" />
                  <span className="ml-2 text-[12px] text-text-secondary">Clocking in...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
