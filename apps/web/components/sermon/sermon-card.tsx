import Link from 'next/link';
import { Video, Headphones } from 'lucide-react';
import { PROGRAMME_SHORT_LABELS } from '@/lib/constants';
import type { ProgrammeType, ProgrammeSession, MediaType } from '@/types/database';

interface SermonCardProps {
  id: string;
  title: string;
  pastor: string;
  date?: string;
  duration?: number | null;
  thumbnailUrl?: string | null;
  tags?: string[];
  isFree?: boolean;
  viewCount?: number;
  progress?: number;
  mediaType?: MediaType;
  programmeType?: ProgrammeType | string;
  specialProgrammeName?: string | null;
  threeDgDay?: number | null;
  programmeSession?: ProgrammeSession | string | null;
  variant?: 'grid' | 'list';
}

const programmeBadgeStyles: Record<string, string> = {
  sunday_service: 'bg-[#F3EAF9] text-[#4A1572]',
  midweek_service: 'bg-amber-light text-amber',
  '3dg': 'bg-coral-light text-coral',
  morning_by_morning: 'bg-teal-light text-teal',
  tod: 'bg-[#E8E0F3] text-[#5B3A8C]',
  special: 'bg-[#FFF4D0] text-[#7A5A00]',
};

function getProgrammeLabel(
  programmeType?: string,
  specialProgrammeName?: string | null,
  threeDgDay?: number | null,
  programmeSession?: string | null,
): string | null {
  if (!programmeType) return null;

  if (programmeType === 'special' && specialProgrammeName) {
    return specialProgrammeName;
  }

  if (programmeType === '3dg') {
    let label = '3DG';
    if (threeDgDay) {
      label += ` D${threeDgDay}`;
      if (programmeSession) {
        label += programmeSession === 'morning' ? ' AM' : ' PM';
      }
    }
    return label;
  }

  return PROGRAMME_SHORT_LABELS[programmeType] || null;
}

export function SermonCard({
  id,
  title,
  pastor,
  date,
  duration,
  thumbnailUrl,
  tags,
  isFree = true,
  viewCount,
  progress,
  mediaType = 'video',
  programmeType,
  specialProgrammeName,
  threeDgDay,
  programmeSession,
  variant = 'grid',
}: SermonCardProps) {
  const durationMin = duration ? Math.round(duration / 60) : null;
  const programmeLabel = getProgrammeLabel(programmeType, specialProgrammeName, threeDgDay, programmeSession);
  const programmeBadge = programmeType ? programmeBadgeStyles[programmeType] || 'bg-surface text-text-secondary' : null;

  if (variant === 'list') {
    return (
      <Link href={`/watch/${id}`} className="block">
        <div className="flex gap-2.5 p-2 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-colors">
          <div className="relative w-[120px] shrink-0 aspect-video bg-hero rounded-lg overflow-hidden">
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
            )}
            <span
              className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                isFree ? 'bg-teal-light text-teal' : 'bg-[#4A1572] text-white'
              }`}
            >
              {isFree ? 'F' : 'P'}
            </span>
            {progress !== undefined && progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20">
                <div className="h-full bg-[#4A1572] rounded-full" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 py-0.5">
            <h3 className="text-[13px] font-medium text-text-primary line-clamp-2">{title}</h3>
            <p className="text-[11px] text-text-tertiary mt-0.5 flex items-center gap-1">
              {mediaType === 'audio' ? <Headphones size={10} className="shrink-0" /> : <Video size={10} className="shrink-0" />}
              {pastor}{durationMin ? ` · ${durationMin} min` : ''}{date ? ` · ${date}` : ''}
            </p>
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {programmeLabel && programmeBadge && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${programmeBadge}`}>
                  {programmeLabel}
                </span>
              )}
              {tags && tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] border border-black/10 bg-surface text-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/watch/${id}`} className="block">
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden hover:border-black/20 transition-colors">
        <div className="relative aspect-video bg-hero">
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-1.5 right-1.5 flex gap-1">
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                isFree ? 'bg-teal-light text-teal' : 'bg-[#4A1572] text-white'
              }`}
            >
              {isFree ? 'Free' : 'Premium'}
            </span>
          </div>
          {programmeLabel && programmeBadge && (
            <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${programmeBadge}`}>
              {programmeLabel}
            </span>
          )}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20">
              <div className="h-full bg-[#4A1572] rounded-full" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="text-[13px] font-medium text-text-primary line-clamp-1">{title}</h3>
          <p className="text-[11px] text-text-tertiary mt-0.5 flex items-center gap-1">
            {mediaType === 'audio' ? <Headphones size={10} className="shrink-0" /> : <Video size={10} className="shrink-0" />}
            {pastor}{durationMin ? ` · ${durationMin} min` : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
