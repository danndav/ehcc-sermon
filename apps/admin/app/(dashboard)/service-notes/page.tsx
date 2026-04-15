'use client';

import { useState, useEffect } from 'react';
import { FileCheck, AlertTriangle, Clock, TrendingUp, Download, Users } from 'lucide-react';
import { PageSkeleton } from '@/components/skeleton';
import { adminGet, adminFetch } from '@/lib/api';

interface Submission {
  id: string;
  user_id: number;
  userName: string;
  eaNumber: string | null;
  programme_type: string;
  service_date: string;
  submission_type: string;
  is_late: boolean;
  created_at: string;
  userBranchId: number | null;
}

interface WeeklyReport {
  totalSubmissions: number;
  lateSubmissions: number;
  missingCount: number;
  compliancePercent: number;
  submissions: Submission[];
}

interface MissingWorker {
  userId: number;
  name: string;
  eaNumber: string | null;
  branchId: number | null;
  role: string;
  attendedInPerson: boolean;
}

const PROGRAMME_LABELS: Record<string, string> = {
  sunday_service: 'Sunday Service',
  midweek_service: 'Midweek Service',
  '3dg': '3 Days of Glory',
  special: 'Special',
};

const BRANCH_NAMES: Record<number, string> = {
  1: 'HQ',
  2: 'Lekki',
  3: 'Oshogbo',
  4: 'Ogbomosho',
  5: 'Abeokuta',
  6: 'UK',
  7: 'Canada',
  8: 'USA',
};

export default function ServiceNotesPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [missing, setMissing] = useState<MissingWorker[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<{ data: any[]; total: number }>({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'week' | 'all' | 'missing'>('week');
  const [page, setPage] = useState(1);
  const [filterProgramme, setFilterProgramme] = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      loadAllSubmissions();
    }
  }, [activeTab, page, filterProgramme, filterBranch]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportData, missingData] = await Promise.all([
        adminGet<WeeklyReport>('/admin/service-notes/weekly-report').catch(() => null),
        adminGet<MissingWorker[]>('/admin/service-notes/missing').catch(() => []),
      ]);
      if (reportData) setReport(reportData);
      setMissing(missingData);
    } finally {
      setLoading(false);
    }
  };

  const loadAllSubmissions = async () => {
    let path = `/admin/service-notes?page=${page}&limit=50`;
    if (filterProgramme) path += `&programmeType=${filterProgramme}`;
    if (filterBranch) path += `&branchId=${filterBranch}`;
    const data = await adminGet<{ data: any[]; total: number }>(path).catch(() => ({ data: [], total: 0 }));
    setAllSubmissions(data);
  };

  const handleExportCsv = async () => {
    const res = await adminFetch('/admin/service-notes/export/csv');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service-notes-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatName = (name: string) => {
    return name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Service Notes</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">Track worker service note submissions</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3 py-2 bg-[#4A1572] text-white rounded-lg text-[12px] font-medium hover:bg-[#3D1260] transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center mb-2">
            <FileCheck size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.totalSubmissions ?? '—'}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Submissions this week</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-coral-light text-coral flex items-center justify-center mb-2">
            <Users size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.missingCount ?? '—'}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Missing</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-light text-amber flex items-center justify-center mb-2">
            <Clock size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.lateSubmissions ?? '—'}</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Late submissions</p>
        </div>
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-teal-light text-teal flex items-center justify-center mb-2">
            <TrendingUp size={18} />
          </div>
          <p className="text-[20px] font-medium text-text-primary">{report?.compliancePercent ?? '—'}%</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">Compliance</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        <button onClick={() => setActiveTab('week')} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'week' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          This Week ({report?.totalSubmissions ?? 0})
        </button>
        <button onClick={() => { setActiveTab('all'); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'all' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          All Submissions
        </button>
        <button onClick={() => setActiveTab('missing')} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${activeTab === 'missing' ? 'bg-[#4A1572] text-white' : 'bg-surface text-text-secondary'}`}>
          Missing ({missing.length})
        </button>
      </div>

      {/* Filters for "All" tab */}
      {activeTab === 'all' && (
        <div className="flex gap-2 mb-4">
          <select
            value={filterProgramme}
            onChange={(e) => { setFilterProgramme(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 bg-white text-text-secondary"
          >
            <option value="">All programmes</option>
            {Object.entries(PROGRAMME_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={filterBranch}
            onChange={(e) => { setFilterBranch(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 bg-white text-text-secondary"
          >
            <option value="">All branches</option>
            {Object.entries(BRANCH_NAMES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        {loading ? (
          <PageSkeleton type="table" />
        ) : activeTab === 'missing' ? (
          /* Missing Workers Table */
          missing.length === 0 ? (
            <p className="p-8 text-center text-[13px] text-text-tertiary">All workers have submitted their notes!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Member</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">EA Number</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Branch</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Role</th>
                    <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Attended?</th>
                  </tr>
                </thead>
                <tbody>
                  {missing.map((worker, i) => (
                    <tr key={worker.userId} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-[13px] text-text-primary">{formatName(worker.name)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-[#4A1572] font-medium">{worker.eaNumber || '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-[12px] text-text-secondary">{worker.branchId ? BRANCH_NAMES[worker.branchId] || `Branch ${worker.branchId}` : '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-[11px] capitalize text-text-secondary">{worker.role.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3">
                        {worker.attendedInPerson ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-light text-teal font-medium">Yes</span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface text-text-tertiary">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Submissions Table (This Week / All) */
          (() => {
            const rows = activeTab === 'week' ? (report?.submissions || []) : allSubmissions.data;
            return rows.length === 0 ? (
              <p className="p-8 text-center text-[13px] text-text-tertiary">No submissions found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/[0.06]">
                      <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Member</th>
                      <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">EA Number</th>
                      <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Programme</th>
                      <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Date</th>
                      <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Type</th>
                      <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Submitted</th>
                      <th className="text-left text-[11px] font-medium text-text-tertiary uppercase tracking-wider px-4 py-3">Late?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((sub: any, i: number) => (
                      <tr key={sub.id} className={`border-b border-black/[0.04] last:border-0 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                        <td className="px-4 py-3">
                          <p className="text-[13px] text-text-primary">{sub.userName ? formatName(sub.userName) : `User #${sub.user_id || sub.userId}`}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-[#4A1572] font-medium">{sub.eaNumber || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-text-secondary">{PROGRAMME_LABELS[sub.programme_type || sub.programmeType] || sub.programme_type || sub.programmeType}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-[12px] text-text-secondary">{formatDate(sub.service_date || sub.serviceDate)}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            (sub.submission_type || sub.submissionType) === 'typed' ? 'bg-[#F3EAF9] text-[#4A1572]' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {(sub.submission_type || sub.submissionType) === 'typed' ? 'Typed' : 'Upload'}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-[12px] text-text-secondary">{formatDateTime(sub.created_at || sub.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          {(sub.is_late ?? sub.isLate) ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-coral-light text-coral font-medium">Late</span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-light text-teal font-medium">On time</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()
        )}
      </div>

      {/* Pagination for all records */}
      {activeTab === 'all' && allSubmissions.total > 50 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary disabled:opacity-30">Previous</button>
          <span className="px-3 py-1.5 text-[12px] text-text-tertiary">Page {page}</span>
          <button onClick={() => setPage(page + 1)} disabled={allSubmissions.data.length < 50} className="px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
