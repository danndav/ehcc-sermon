'use client';

interface PrayerCardProps {
  id: string;
  firstName: string;
  timeAgo: string;
  category: string;
  content: string;
  prayerCount: number;
  isPraying?: boolean;
  onPray?: (id: string) => void;
}

export function PrayerCard({
  id,
  firstName,
  timeAgo,
  category,
  content,
  prayerCount,
  isPraying = false,
  onPray,
}: PrayerCardProps) {
  const initials = firstName.slice(0, 2).toUpperCase();

  return (
    <div className="border border-black/[0.12] rounded-card p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center text-[11px] font-medium shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{firstName}</span>
            <span className="text-xs text-text-tertiary">{timeAgo}</span>
            <span className="px-2 py-0.5 rounded-pill text-[11px] border border-black/[0.12] bg-surface text-text-secondary">
              {category}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{content}</p>
          <button
            onClick={() => onPray?.(id)}
            className={`mt-2 px-3 py-1.5 rounded-component text-xs font-medium transition-all ${
              isPraying
                ? 'bg-success-green-light text-success-green'
                : 'border border-black/25 text-text-secondary hover:bg-black/[0.04]'
            }`}
          >
            {isPraying ? `Praying for this (${prayerCount})` : `Pray for this (${prayerCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
