import Link from 'next/link';

export function NightlyPrayerWidget() {
  return (
    <div className="bg-[#3D1260] rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[14px] font-medium">Nightly prayer</p>
        <span className="flex items-center gap-1 text-[10px] text-white/70">
          <span className="w-2 h-2 rounded-full bg-[#E24B4A] animate-pulse" />
          Live
        </span>
      </div>
      <p className="text-[11px] text-white/60 mb-3">Every night · 12:00 AM</p>
      <button className="w-full bg-[#4A4BAD] text-white rounded-lg py-2 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
        Join on Microsoft Teams
      </button>
    </div>
  );
}
