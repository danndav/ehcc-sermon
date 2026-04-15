'use client';

import { useState, useEffect } from 'react';
import { Handshake, CheckCircle, Phone, MessageSquare, ChevronDown, Clock, FileText, AlertTriangle } from 'lucide-react';
import { apiGet, apiFetch } from '@/lib/api';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Skeleton } from '@/components/ui/skeleton';

interface MemberInfo {
  id: number;
  name: string;
  eaNumber: string | null;
  phoneNumber: string | null;
  branchId: number | null;
}

interface FollowupLog {
  id: string;
  comment: string;
  reachedOutAt: string;
}

interface AssignedMember {
  assignmentId: string;
  member: MemberInfo;
  notes: string | null;
  followedUpThisWeek: boolean;
  lastLog: FollowupLog | null;
}

export default function MinistryGuidePage() {
  const [members, setMembers] = useState<AssignedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // History state
  const [historyMap, setHistoryMap] = useState<Map<string, FollowupLog[]>>(new Map());
  const [loadingHistory, setLoadingHistory] = useState<string | null>(null);

  // Weekly report state
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [reportContent, setReportContent] = useState('');
  const [reportChallenges, setReportChallenges] = useState('');
  const [reportPrayerPoints, setReportPrayerPoints] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersData, reportData] = await Promise.all([
        apiGet<AssignedMember[]>('/ministry-guide/my-members').catch(() => []),
        apiGet<any>('/ministry-guide/weekly-report/current').catch(() => null),
      ]);
      setMembers(membersData);
      setCurrentReport(reportData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    const stripped = reportContent.replace(/<[^>]*>/g, '').trim();
    if (!stripped) {
      setReportError('Please write your report');
      return;
    }
    setReportError('');
    setReportSuccess('');
    setSubmittingReport(true);
    try {
      const res = await apiFetch('/ministry-guide/weekly-report', {
        method: 'POST',
        body: JSON.stringify({
          report: reportContent,
          challenges: reportChallenges || undefined,
          prayerPoints: reportPrayerPoints || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error: ${res.status}`);
      }
      setReportSuccess('Report submitted!');
      setReportContent('');
      setReportChallenges('');
      setReportPrayerPoints('');
      await loadData();
    } catch (err: any) {
      setReportError(err.message || 'Failed to submit');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleLogFollowup = async (assignmentId: string) => {
    if (!comment.trim()) {
      setError('Please enter a comment about your follow-up');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await apiFetch('/ministry-guide/followup', {
        method: 'POST',
        body: JSON.stringify({ assignmentId, comment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error: ${res.status}`);
      }
      setSuccess('Follow-up logged!');
      setComment('');
      setExpandedId(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to log follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const loadHistory = async (assignmentId: string) => {
    if (historyMap.has(assignmentId)) return;
    setLoadingHistory(assignmentId);
    try {
      const data = await apiGet<{ data: FollowupLog[]; total: number }>(`/ministry-guide/followup/${assignmentId}/history?limit=10`);
      setHistoryMap(prev => new Map(prev).set(assignmentId, data.data));
    } catch {
    } finally {
      setLoadingHistory(null);
    }
  };

  const toggleExpand = (assignmentId: string) => {
    if (expandedId === assignmentId) {
      setExpandedId(null);
    } else {
      setExpandedId(assignmentId);
      setComment('');
      setError('');
      setSuccess('');
      loadHistory(assignmentId);
    }
  };

  const formatName = (name: string) => name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

  const doneCount = members.filter(m => m.followedUpThisWeek).length;
  const pendingCount = members.length - doneCount;

  if (loading) return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-3 w-64" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-black/5 rounded-xl p-3 text-center space-y-2">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-2.5 w-14 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-black/5 rounded-xl px-4 py-3 flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-text-primary">Ministry Guide</h1>
        <p className="text-[12px] text-text-tertiary mt-0.5">Follow up with your assigned members this week</p>
      </div>

      {members.length > 0 && (
      <>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-black/10 rounded-xl p-3 text-center">
          <p className="text-[18px] font-medium text-text-primary">{members.length}</p>
          <p className="text-[10px] text-text-tertiary">Assigned</p>
        </div>
        <div className="bg-white border border-teal/30 rounded-xl p-3 text-center bg-teal-light/20">
          <p className="text-[18px] font-medium text-teal">{doneCount}</p>
          <p className="text-[10px] text-text-tertiary">Done</p>
        </div>
        <div className={`bg-white border rounded-xl p-3 text-center ${pendingCount > 0 ? 'border-coral/30 bg-coral-light/20' : 'border-black/10'}`}>
          <p className={`text-[18px] font-medium ${pendingCount > 0 ? 'text-coral' : 'text-text-primary'}`}>{pendingCount}</p>
          <p className="text-[10px] text-text-tertiary">Pending</p>
        </div>
      </div>

      {/* Weekly Report */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-[#4A1572]" />
          <h2 className="text-[15px] font-medium text-text-primary">Weekly Report</h2>
        </div>

        {currentReport ? (
          <div className="bg-teal-light/30 border border-teal/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-teal" />
              <span className="text-[12px] font-medium text-teal">Submitted this week</span>
            </div>
            <div className="text-[13px] text-text-primary" dangerouslySetInnerHTML={{ __html: currentReport.report }} />
            {currentReport.challenges && (
              <div className="mt-2 pt-2 border-t border-teal/10">
                <p className="text-[11px] font-medium text-text-secondary mb-0.5">Challenges</p>
                <p className="text-[12px] text-text-secondary">{currentReport.challenges}</p>
              </div>
            )}
            {currentReport.prayerPoints && (
              <div className="mt-2 pt-2 border-t border-teal/10">
                <p className="text-[11px] font-medium text-text-secondary mb-0.5">Prayer Points</p>
                <p className="text-[12px] text-text-secondary">{currentReport.prayerPoints}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {reportError && (
              <div className="flex items-center gap-2 px-3 py-2 bg-coral-light rounded-lg mb-3">
                <AlertTriangle size={14} className="text-coral" />
                <span className="text-[12px] text-coral">{reportError}</span>
              </div>
            )}
            {reportSuccess && (
              <div className="flex items-center gap-2 px-3 py-2 bg-teal-light rounded-lg mb-3">
                <CheckCircle size={14} className="text-teal" />
                <span className="text-[12px] text-teal">{reportSuccess}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1.5">Report</label>
                <RichTextEditor
                  content={reportContent}
                  onChange={setReportContent}
                  placeholder="Summarize your follow-ups this week..."
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Challenges (optional)</label>
                <textarea
                  value={reportChallenges}
                  onChange={(e) => setReportChallenges(e.target.value)}
                  rows={2}
                  placeholder="Any challenges you faced..."
                  className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] text-text-primary resize-none focus:outline-none focus:border-[#4A1572]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Prayer points (optional)</label>
                <textarea
                  value={reportPrayerPoints}
                  onChange={(e) => setReportPrayerPoints(e.target.value)}
                  rows={2}
                  placeholder="Prayer requests for your members..."
                  className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] text-text-primary resize-none focus:outline-none focus:border-[#4A1572]"
                />
              </div>
              <button
                onClick={handleSubmitReport}
                disabled={submittingReport}
                className="w-full py-2.5 bg-[#4A1572] text-white rounded-lg text-[13px] font-medium hover:bg-[#3D1260] transition-colors disabled:opacity-50"
              >
                {submittingReport ? 'Submitting...' : 'Submit Weekly Report'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members list */}
      {members.length > 0 && (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.assignmentId} className="bg-white border border-black/10 rounded-xl overflow-hidden">
              {/* Member row */}
              <button
                onClick={() => toggleExpand(m.assignmentId)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${
                    m.followedUpThisWeek ? 'bg-teal-light text-teal' : 'bg-surface text-text-tertiary'
                  }`}>
                    {m.followedUpThisWeek ? <CheckCircle size={16} /> : formatName(m.member.name).split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-text-primary">{formatName(m.member.name)}</p>
                    <div className="flex items-center gap-2">
                      {m.member.eaNumber && <span className="text-[10px] text-[#4A1572]">{m.member.eaNumber}</span>}
                      {m.member.phoneNumber && <span className="text-[10px] text-text-tertiary">{m.member.phoneNumber}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.followedUpThisWeek && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-light text-teal font-medium">Done</span>
                  )}
                  <ChevronDown size={16} className={`text-text-tertiary transition-transform ${expandedId === m.assignmentId ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expanded section */}
              {expandedId === m.assignmentId && (
                <div className="px-4 pb-4 border-t border-black/[0.06]">
                  {/* Quick actions */}
                  {m.member.phoneNumber && (
                    <div className="flex gap-2 py-3">
                      <a
                        href={`tel:${m.member.phoneNumber}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary hover:bg-surface transition-colors"
                      >
                        <Phone size={13} />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${m.member.phoneNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border border-black/10 text-text-secondary hover:bg-surface transition-colors"
                      >
                        <MessageSquare size={13} />
                        WhatsApp
                      </a>
                    </div>
                  )}

                  {/* Log follow-up form */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-text-secondary mb-1">Log follow-up</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      placeholder="e.g. Called and prayed with them. They're doing well..."
                      className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] text-text-primary resize-none focus:outline-none focus:border-[#4A1572]"
                    />
                    {error && <p className="text-[11px] text-coral mt-1">{error}</p>}
                    {success && <p className="text-[11px] text-teal mt-1">{success}</p>}
                    <button
                      onClick={() => handleLogFollowup(m.assignmentId)}
                      disabled={submitting}
                      className="mt-2 px-4 py-2 bg-[#4A1572] text-white rounded-lg text-[12px] font-medium hover:bg-[#3D1260] transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Log Follow-up'}
                    </button>
                  </div>

                  {/* Past follow-ups */}
                  {loadingHistory === m.assignmentId ? (
                    <p className="text-[11px] text-text-tertiary">Loading history...</p>
                  ) : (historyMap.get(m.assignmentId) || []).length > 0 && (
                    <div>
                      <p className="text-[11px] font-medium text-text-secondary mb-1.5">Past follow-ups</p>
                      <div className="space-y-1.5">
                        {(historyMap.get(m.assignmentId) || []).map(log => (
                          <div key={log.id} className="flex gap-2 px-3 py-2 bg-surface/50 rounded-lg">
                            <Clock size={12} className="text-text-tertiary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[12px] text-text-primary">{log.comment}</p>
                              <p className="text-[10px] text-text-tertiary mt-0.5">
                                {new Date(log.reachedOutAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                {' '}
                                {new Date(log.reachedOutAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* Empty state for non-leaders */}
      {!loading && members.length === 0 && (
        <div className="text-center py-12 bg-white border border-black/10 rounded-xl">
          <Handshake size={32} className="mx-auto text-text-tertiary mb-2" />
          <p className="text-[13px] text-text-tertiary">No members assigned to you yet</p>
          <p className="text-[12px] text-text-tertiary mt-1">Your admin will assign members for you to follow up with</p>
        </div>
      )}
    </div>
  );
}
