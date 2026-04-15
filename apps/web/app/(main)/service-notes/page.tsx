'use client';

import { useState, useEffect, useRef } from 'react';
import { FileCheck, Upload, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiGet, apiFetch, apiUpload } from '@/lib/api';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Skeleton } from '@/components/ui/skeleton';

interface ServiceNote {
  id: string;
  programmeType: string;
  specialProgrammeName: string | null;
  serviceDate: string;
  submissionType: string;
  typedContent: string | null;
  fileName: string | null;
  isLate: boolean;
  deadline: string;
  createdAt: string;
}

const PROGRAMME_LABELS: Record<string, string> = {
  sunday_service: 'Sunday Service',
  midweek_service: 'Midweek Service',
  '3dg': '3 Days of Glory',
  special: 'Special',
};

const PROGRAMME_OPTIONS = [
  { value: 'sunday_service', label: 'Sunday Service' },
  { value: 'midweek_service', label: 'Midweek Service' },
  { value: '3dg', label: '3 Days of Glory' },
  { value: 'special', label: 'Special Programme' },
];

export default function ServiceNotesPage() {
  const [currentWeek, setCurrentWeek] = useState<ServiceNote[]>([]);
  const [pastNotes, setPastNotes] = useState<{ data: ServiceNote[]; total: number }>({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [programmeType, setProgrammeType] = useState('sunday_service');
  const [specialName, setSpecialName] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitType, setSubmitType] = useState<'typed' | 'upload'>('typed');
  const [typedContent, setTypedContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deadline countdown
  const [deadlineText, setDeadlineText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(updateDeadline, 60000);
    updateDeadline();
    return () => clearInterval(timer);
  }, []);

  const updateDeadline = () => {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const nextSunday = new Date(now);
    nextSunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
    nextSunday.setUTCHours(7, 0, 0, 0);

    if (now >= nextSunday && dayOfWeek === 0) {
      nextSunday.setUTCDate(nextSunday.getUTCDate() + 7);
    }

    const diff = nextSunday.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      setDeadlineText(`${days}d ${hours % 24}h left`);
    } else {
      setDeadlineText(`${hours}h ${minutes}m left`);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [week, past] = await Promise.all([
        apiGet<ServiceNote[]>('/service-notes/my/current-week').catch(() => []),
        apiGet<{ data: ServiceNote[]; total: number }>('/service-notes/my?limit=20').catch(() => ({ data: [], total: 0 })),
      ]);
      setCurrentWeek(week);
      setPastNotes(past);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (submitType === 'typed') {
        const stripped = typedContent.replace(/<[^>]*>/g, '').trim();
        if (!stripped) {
          setError('Please enter your service notes');
          return;
        }
        const res = await apiFetch('/service-notes', {
          method: 'POST',
          body: JSON.stringify({
            programmeType,
            specialProgrammeName: programmeType === 'special' ? specialName : undefined,
            serviceDate,
            typedContent,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Error: ${res.status}`);
        }
      } else {
        if (!selectedFile) {
          setError('Please select a file');
          return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('programmeType', programmeType);
        formData.append('serviceDate', serviceDate);
        if (programmeType === 'special' && specialName) {
          formData.append('specialProgrammeName', specialName);
        }

        const res = await apiUpload('/service-notes/upload', formData);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Error: ${res.status}`);
        }
      }

      setSuccess('Service note submitted successfully!');
      setTypedContent('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    try {
      const res = await apiFetch(`/service-notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await loadData();
    } catch {
      setError('Failed to delete submission');
    }
  };

  const getStatusForProgramme = (type: string) => {
    return currentWeek.find(n => n.programmeType === type);
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-text-primary">Service Notes</h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">Submit your notes for services you watched online</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-light rounded-lg">
          <Clock size={14} className="text-amber" />
          <span className="text-[12px] font-medium text-amber">{deadlineText}</span>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {PROGRAMME_OPTIONS.map(opt => {
          const note = getStatusForProgramme(opt.value);
          return (
            <div key={opt.value} className={`border rounded-xl p-3 ${note ? 'border-teal/30 bg-teal-light/30' : 'border-black/10 bg-white'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                {note ? (
                  <CheckCircle size={16} className="text-teal" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-black/20" />
                )}
                <span className="text-[11px] font-medium text-text-primary">{opt.label}</span>
              </div>
              <p className="text-[10px] text-text-tertiary">
                {note ? (note.isLate ? 'Submitted late' : 'Submitted') : 'Pending'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Submit form */}
      <div className="bg-white border border-black/10 rounded-xl p-5 mb-6">
        <h2 className="text-[15px] font-medium text-text-primary mb-4">Submit Notes</h2>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 bg-coral-light rounded-lg mb-4">
            <AlertTriangle size={14} className="text-coral" />
            <span className="text-[12px] text-coral">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 px-3 py-2 bg-teal-light rounded-lg mb-4">
            <CheckCircle size={14} className="text-teal" />
            <span className="text-[12px] text-teal">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Programme type */}
          <div>
            <label className="block text-[12px] font-medium text-text-secondary mb-1.5">Programme</label>
            <select
              value={programmeType}
              onChange={(e) => setProgrammeType(e.target.value)}
              className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] text-text-primary bg-white focus:outline-none focus:border-[#4A1572]"
            >
              {PROGRAMME_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Special programme name */}
          {programmeType === 'special' && (
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1.5">Programme name</label>
              <input
                type="text"
                value={specialName}
                onChange={(e) => setSpecialName(e.target.value)}
                placeholder="e.g. Easter Convention Day 2"
                className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] text-text-primary focus:outline-none focus:border-[#4A1572]"
              />
            </div>
          )}

          {/* Service date */}
          <div>
            <label className="block text-[12px] font-medium text-text-secondary mb-1.5">Service date</label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full px-3 py-2 border border-black/10 rounded-lg text-[13px] text-text-primary focus:outline-none focus:border-[#4A1572]"
            />
          </div>

          {/* Submission type toggle */}
          <div>
            <label className="block text-[12px] font-medium text-text-secondary mb-1.5">Submission type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSubmitType('typed')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                  submitType === 'typed' ? 'border-[#4A1572] bg-[#F3EAF9] text-[#4A1572]' : 'border-black/10 text-text-secondary'
                }`}
              >
                <FileText size={14} />
                Type notes
              </button>
              <button
                type="button"
                onClick={() => setSubmitType('upload')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                  submitType === 'upload' ? 'border-[#4A1572] bg-[#F3EAF9] text-[#4A1572]' : 'border-black/10 text-text-secondary'
                }`}
              >
                <Upload size={14} />
                Upload file
              </button>
            </div>
          </div>

          {/* Content area */}
          {submitType === 'typed' ? (
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1.5">Your notes</label>
              <RichTextEditor
                content={typedContent}
                onChange={setTypedContent}
                placeholder="Write your service notes here..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1.5">Upload file</label>
              <div className="border-2 border-dashed border-black/10 rounded-lg p-6 text-center">
                <Upload size={24} className="mx-auto text-text-tertiary mb-2" />
                <p className="text-[12px] text-text-tertiary mb-2">PDF, JPEG, PNG, HEIC, DOC, DOCX (max 10MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="text-[12px]"
                />
                {selectedFile && (
                  <p className="text-[12px] text-teal mt-2">{selectedFile.name}</p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#4A1572] text-white rounded-lg text-[13px] font-medium hover:bg-[#3D1260] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Notes'}
          </button>
        </form>
      </div>

      {/* Past submissions */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-black/[0.06]">
          <h2 className="text-[14px] font-medium text-text-primary">Past Submissions</h2>
        </div>
        {loading ? (
          <div className="divide-y divide-black/[0.04]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 py-3 space-y-2">
                <Skeleton className="h-3.5 w-1/2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-2.5 w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : pastNotes.data.length === 0 ? (
          <p className="p-6 text-center text-[13px] text-text-tertiary">No submissions yet</p>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {pastNotes.data.map((note) => (
              <div key={note.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-text-primary">
                      {PROGRAMME_LABELS[note.programmeType] || note.programmeType}
                      {note.specialProgrammeName && ` — ${note.specialProgrammeName}`}
                    </p>
                    {note.isLate && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-coral-light text-coral font-medium">Late</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-text-tertiary">
                      {new Date(note.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-text-tertiary capitalize">{note.submissionType}</span>
                    {note.fileName && <span className="text-[11px] text-[#4A1572]">{note.fileName}</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-[11px] text-coral hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
