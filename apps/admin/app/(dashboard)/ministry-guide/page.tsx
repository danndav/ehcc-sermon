'use client';

import { useState, useEffect } from 'react';
import { Handshake, TrendingUp, AlertTriangle, Download, UserPlus, Users, X, Search, Check, ChevronDown, FileText } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminPost, adminFetch, adminDelete } from '@/lib/api';

interface UserInfo {
  id: number;
  name: string;
  eaNumber: string | null;
  branchId: number | null;
  phoneNumber: string | null;
}

interface Assignment {
  id: string;
  leaderId: number;
  memberId: number;
  notes: string | null;
  leader: UserInfo;
  member: UserInfo;
}

interface WeeklyReport {
  totalAssignments: number;
  followedUp: number;
  notFollowedUp: number;
  compliancePercent: number;
  leaders: { leader: UserInfo; total: number; done: number; pending: number }[];
}

interface NotFollowedUp {
  assignmentId: string;
  leaderId: number;
  memberId: number;
  leaderName: string;
  leaderEaNumber: string | null;
  memberName: string;
  memberEaNumber: string | null;
  memberPhone: string | null;
}

const BRANCH_NAMES: Record<number, string> = {
  1: 'HQ', 2: 'Lekki', 3: 'Oshogbo', 4: 'Ogbomosho', 5: 'Abeokuta', 6: 'UK', 7: 'Canada', 8: 'USA',
};

export default function MinistryGuidePage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [assignments, setAssignments] = useState<{ data: Assignment[]; total: number }>({ data: [], total: 0 });
  const [notFollowedUp, setNotFollowedUp] = useState<NotFollowedUp[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'report' | 'assignments' | 'missing'>('report');
  const [leaderReports, setLeaderReports] = useState<any[]>([]);
  const [expandedLeaderId, setExpandedLeaderId] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Assign form
  const [assignLeaderId, setAssignLeaderId] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [assignNotes, setAssignNotes] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [leaderSearch, setLeaderSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [leaderDropdownOpen, setLeaderDropdownOpen] = useState(false);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportData, assignData, missingData, usersData, leaderReportsData] = await Promise.all([
        adminGet<WeeklyReport>('/admin/ministry-guide/weekly-report').catch(() => null),
        adminGet<{ data: Assignment[]; total: number }>('/admin/ministry-guide/assignments?limit=200').catch(() => ({ data: [], total: 0 })),
        adminGet<NotFollowedUp[]>('/admin/ministry-guide/not-followed-up').catch(() => []),
        adminGet<{ users: UserInfo[]; total: number }>('/admin/users?limit=3000').catch(() => ({ users: [], total: 0 })),
        adminGet<{ data: any[]; total: number }>('/admin/ministry-guide/leader-reports').catch(() => ({ data: [], total: 0 })),
      ]);
      if (reportData) setReport(reportData);
      setAssignments(assignData);
      setNotFollowedUp(missingData);
      setUsers(usersData.users || []);
      setLeaderReports(leaderReportsData.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    setAssignError('');
    if (!assignLeaderId) {
      setAssignError('Select a leader');
      return;
    }
    if (selectedMembers.length === 0) {
      setAssignError('Select at least one member');
      return;
    }
    setAssigning(true);
    try {
      if (selectedMembers.length === 1) {
        await adminPost('/admin/ministry-guide/assign', {
          leaderId: assignLeaderId,
          memberId: selectedMembers[0],
          notes: assignNotes || undefined,
        });
      } else {
        await adminPost('/admin/ministry-guide/bulk-assign', {
          leaderId: assignLeaderId,
          memberIds: selectedMembers,
        });
      }

      setShowAssignModal(false);
      setAssignLeaderId(null);
      setSelectedMembers([]);
      setAssignNotes('');
      setLeaderSearch('');
      setMemberSearch('');
      await loadData();
    } catch (err: any) {
      setAssignError(err.message || 'Failed to assign');
    } finally {
      setAssigning(false);
    }
  };

  const toggleMember = (id: number) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const filterUsers = (search: string) => {
    if (!search.trim()) return users.filter(u => u.name).sort((a, b) => a.name.localeCompare(b.name));
    const q = search.toLowerCase();
    return users
      .filter(u => u.name && (u.name.toLowerCase().includes(q) || (u.eaNumber && u.eaNumber.toLowerCase().includes(q))))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleRemoveAssignment = async (id: string) => {
    if (!confirm('Remove this assignment?')) return;
    try {
      await adminDelete(`/admin/ministry-guide/assignments/${id}`);
      await loadData();
    } catch {}
  };

  const handleExportCsv = async () => {
    const res = await adminFetch('/admin/ministry-guide/export/csv');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ministry-guide-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatName = (name: string) => name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

  const getLeaderReport = (leaderId: number) => leaderReports.find((r: any) => r.leaderId === leaderId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Ministry Guide</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">Assign members to leaders for weekly follow-up</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 px-3 py-2 bg-[#4A1572] text-white rounded-lg text-[12px] font-medium hover:bg-[#3D1260] transition-colors">
            <UserPlus size={14} />
            Assign
          </button>
          <button onClick={handleExportCsv} className="flex items-center gap-2 px-3 py-2 border border-black/10 rounded-lg text-[12px] font-medium text-text-secondary hover:bg-surface transition-colors">
            <Download size={14} />
            CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center mb-2">
            <Handshake size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.totalAssignments ?? '—'}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Total assignments</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-teal-light text-teal flex items-center justify-center mb-2">
            <TrendingUp size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.followedUp ?? '—'}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Followed up</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-coral-light text-coral flex items-center justify-center mb-2">
            <AlertTriangle size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.notFollowedUp ?? '—'}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Not followed up</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-light text-amber flex items-center justify-center mb-2">
            <Users size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.compliancePercent ?? '—'}%</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Compliance</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        <button onClick={() => setActiveTab('report')} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'report' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          Leaders ({report?.leaders?.length ?? 0})
        </button>
        <button onClick={() => setActiveTab('assignments')} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'assignments' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          All Assignments ({assignments.total})
        </button>
        <button onClick={() => setActiveTab('missing')} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'missing' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          Not Reached Out ({notFollowedUp.length})
        </button>
      </div>

      {/* Tables */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        {loading ? (
          <PageSkeleton type="table" />
        ) : activeTab === 'report' ? (
          /* Leader summary — expandable cards */
          !report?.leaders?.length ? (
            <p className="p-8 text-center text-[13px] text-text-tertiary">No assignments yet</p>
          ) : (
            <div className="divide-y divide-black/[0.04]">
              {report.leaders.map((l) => {
                const leaderReport = getLeaderReport(l.leader.id);
                const isExpanded = expandedLeaderId === l.leader.id;
                return (
                  <div key={l.leader.id}>
                    <button
                      onClick={() => setExpandedLeaderId(isExpanded ? null : l.leader.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-text-primary">{formatName(l.leader.name)}</span>
                            <span className="text-[11px] text-[#4A1572]">{l.leader.eaNumber || ''}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[11px] text-text-tertiary">{l.total} members</span>
                            <span className="text-[11px] text-teal">{l.done} done</span>
                            {l.pending > 0 && <span className="text-[11px] text-coral">{l.pending} pending</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {leaderReport ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-light text-teal font-medium">Report submitted</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral-light text-coral font-medium">No report</span>
                        )}
                        {l.pending === 0 ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-light text-teal font-medium">All reached</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-light text-amber font-medium">{l.pending} left</span>
                        )}
                        <ChevronDown size={14} className={`text-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-black/[0.06]">
                        {leaderReport ? (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={14} className="text-[#4A1572]" />
                              <span className="text-[12px] font-medium text-text-secondary">Weekly Report</span>
                              <span className="text-[10px] text-text-tertiary">
                                {new Date(leaderReport.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="bg-surface/50 rounded-lg p-3">
                              <div className="text-[12px] text-text-primary leading-relaxed" dangerouslySetInnerHTML={{ __html: leaderReport.report }} />
                              {leaderReport.challenges && (
                                <div className="mt-2 pt-2 border-t border-black/[0.06]">
                                  <p className="text-[10px] font-medium text-text-tertiary uppercase mb-0.5">Challenges</p>
                                  <p className="text-[12px] text-text-secondary">{leaderReport.challenges}</p>
                                </div>
                              )}
                              {leaderReport.prayerPoints && (
                                <div className="mt-2 pt-2 border-t border-black/[0.06]">
                                  <p className="text-[10px] font-medium text-text-tertiary uppercase mb-0.5">Prayer Points</p>
                                  <p className="text-[12px] text-text-secondary">{leaderReport.prayerPoints}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 py-4 text-center bg-surface/30 rounded-lg">
                            <FileText size={20} className="mx-auto text-text-tertiary mb-1" />
                            <p className="text-[12px] text-text-tertiary">No weekly report submitted yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === 'assignments' ? (
          /* All assignments */
          assignments.data.length === 0 ? (
            <p className="p-8 text-center text-[13px] text-text-tertiary">No assignments yet. Click "Assign" to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Leader</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Member</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Member EA</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Phone</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.data.map((a, i) => (
                    <tr key={a.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-[13px] text-text-primary">{formatName(a.leader.name)}</p>
                        <p className="text-[10px] text-[#4A1572]">{a.leader.eaNumber || ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] text-text-primary">{formatName(a.member.name)}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><span className="text-[12px] text-[#4A1572] font-medium">{a.member.eaNumber || '—'}</span></td>
                      <td className="px-4 py-3 hidden md:table-cell"><span className="text-[12px] text-text-secondary">{a.member.phoneNumber || '—'}</span></td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleRemoveAssignment(a.id)} className="text-[11px] text-coral hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'missing' ? (
          /* Not followed up */
          notFollowedUp.length === 0 ? (
            <p className="p-8 text-center text-[13px] text-text-tertiary">All leaders have followed up this week!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Leader</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Leader EA</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Member</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Member EA</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Member Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {notFollowedUp.map((nf, i) => (
                    <tr key={nf.assignmentId} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <td className="px-4 py-3 text-[13px] text-text-primary">{formatName(nf.leaderName)}</td>
                      <td className="px-4 py-3"><span className="text-[12px] text-[#4A1572] font-medium">{nf.leaderEaNumber || '—'}</span></td>
                      <td className="px-4 py-3 text-[13px] text-text-primary">{formatName(nf.memberName)}</td>
                      <td className="px-4 py-3"><span className="text-[12px] text-[#4A1572] font-medium">{nf.memberEaNumber || '—'}</span></td>
                      <td className="px-4 py-3 hidden md:table-cell"><span className="text-[12px] text-text-secondary">{nf.memberPhone || '—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowAssignModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl border border-black/10 w-[90%] max-w-lg p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-medium text-text-primary">Assign Members to Leader</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-text-tertiary hover:text-text-primary"><X size={18} /></button>
            </div>

            {assignError && (
              <div className="px-3 py-2 bg-coral-light rounded-lg mb-3">
                <span className="text-[12px] text-coral">{assignError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Leader search dropdown */}
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Leader</label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] bg-white cursor-pointer flex items-center justify-between"
                    onClick={() => { setLeaderDropdownOpen(!leaderDropdownOpen); setMemberDropdownOpen(false); }}
                  >
                    {assignLeaderId ? (
                      <span className="text-text-primary">
                        {(() => { const u = users.find(u => u.id === assignLeaderId); return u ? `${formatName(u.name)} ${u.eaNumber ? `(${u.eaNumber})` : ''}` : ''; })()}
                      </span>
                    ) : (
                      <span className="text-text-tertiary">Search by name or EA number...</span>
                    )}
                    <Search size={14} className="text-text-tertiary" />
                  </div>
                  {leaderDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-[5]" onClick={() => { setLeaderDropdownOpen(false); setLeaderSearch(''); }} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg z-10 overflow-hidden shadow-lg">
                        <div className="p-2 border-b border-black/[0.06]">
                          <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                            <input
                              autoFocus
                              type="text"
                              value={leaderSearch}
                              onChange={(e) => setLeaderSearch(e.target.value)}
                              placeholder="Type name or EA number..."
                              className="w-full pl-8 pr-3 py-1.5 border border-black/10 rounded text-[12px] focus:outline-none focus:border-[#4A1572]"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filterUsers(leaderSearch).slice(0, 50).map(u => (
                            <button
                              key={u.id}
                              onClick={() => { setAssignLeaderId(u.id); setLeaderDropdownOpen(false); setLeaderSearch(''); }}
                              className={`w-full px-3 py-2 text-left hover:bg-surface flex items-center justify-between ${assignLeaderId === u.id ? 'bg-[#F3EAF9]' : ''}`}
                            >
                              <div>
                                <p className="text-[12px] text-text-primary">{formatName(u.name)}</p>
                                <p className="text-[10px] text-[#4A1572]">{u.eaNumber || `ID: ${u.id}`}</p>
                              </div>
                              {assignLeaderId === u.id && <Check size={14} className="text-[#4A1572]" />}
                            </button>
                          ))}
                          {filterUsers(leaderSearch).length === 0 && (
                            <p className="px-3 py-3 text-[12px] text-text-tertiary text-center">No users found</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Members multi-select search */}
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">
                  Members {selectedMembers.length > 0 && <span className="text-[#4A1572]">({selectedMembers.length} selected)</span>}
                </label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] bg-white cursor-pointer flex items-center justify-between"
                    onClick={() => { setMemberDropdownOpen(!memberDropdownOpen); setLeaderDropdownOpen(false); }}
                  >
                    {selectedMembers.length > 0 ? (
                      <span className="text-text-primary truncate">
                        {selectedMembers.slice(0, 3).map(id => {
                          const u = users.find(u => u.id === id);
                          return u ? formatName(u.name) : `#${id}`;
                        }).join(', ')}
                        {selectedMembers.length > 3 && ` +${selectedMembers.length - 3} more`}
                      </span>
                    ) : (
                      <span className="text-text-tertiary">Search and select members...</span>
                    )}
                    <Search size={14} className="text-text-tertiary" />
                  </div>
                  {memberDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-[5]" onClick={() => { setMemberDropdownOpen(false); setMemberSearch(''); }} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg z-10 overflow-hidden shadow-lg">
                        <div className="p-2 border-b border-black/[0.06]">
                          <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                            <input
                              autoFocus
                              type="text"
                              value={memberSearch}
                              onChange={(e) => setMemberSearch(e.target.value)}
                              placeholder="Type name or EA number..."
                              className="w-full pl-8 pr-3 py-1.5 border border-black/10 rounded text-[12px] focus:outline-none focus:border-[#4A1572]"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filterUsers(memberSearch).filter(u => u.id !== assignLeaderId).slice(0, 50).map(u => {
                            const isSelected = selectedMembers.includes(u.id);
                            return (
                              <button
                                key={u.id}
                                onClick={() => toggleMember(u.id)}
                                className={`w-full px-3 py-2 text-left hover:bg-surface flex items-center justify-between ${isSelected ? 'bg-[#F3EAF9]' : ''}`}
                              >
                                <div>
                                  <p className="text-[12px] text-text-primary">{formatName(u.name)}</p>
                                  <p className="text-[10px] text-[#4A1572]">{u.eaNumber || `ID: ${u.id}`}</p>
                                </div>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[#4A1572] border-[#4A1572]' : 'border-black/20'}`}>
                                  {isSelected && <Check size={10} className="text-white" />}
                                </div>
                              </button>
                            );
                          })}
                          {filterUsers(memberSearch).filter(u => u.id !== assignLeaderId).length === 0 && (
                            <p className="px-3 py-3 text-[12px] text-text-tertiary text-center">No users found</p>
                          )}
                        </div>
                        <div className="p-2 border-t border-black/[0.06]">
                          <button
                            onClick={() => { setMemberDropdownOpen(false); setMemberSearch(''); }}
                            className="w-full py-1.5 bg-[#4A1572] text-white rounded text-[12px] font-medium hover:bg-[#3D1260] transition-colors"
                          >
                            Done ({selectedMembers.length} selected)
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Selected chips */}
                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedMembers.map(id => {
                      const u = users.find(u => u.id === id);
                      return (
                        <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3EAF9] text-[#4A1572] text-[11px]">
                          {u ? formatName(u.name) : `#${id}`}
                          {u?.eaNumber && <span className="text-[#4A1572]/60">({u.eaNumber})</span>}
                          <button onClick={() => toggleMember(id)} className="hover:text-coral ml-0.5"><X size={10} /></button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="Any notes about this assignment..."
                  className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] focus:outline-none focus:border-[#4A1572]"
                />
              </div>
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="w-full py-2.5 bg-[#4A1572] text-white rounded-lg text-[13px] font-medium hover:bg-[#3D1260] transition-colors disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : `Assign ${selectedMembers.length} member${selectedMembers.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
