export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-black/[0.06] rounded-lg ${className}`} />;
}

export function SermonCardSkeleton() {
  return (
    <div className="bg-white border border-black/5 rounded-xl overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2.5 w-12" />
        </div>
      </div>
    </div>
  );
}

export function SermonGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SermonCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SermonListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <Skeleton className="w-28 h-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <Skeleton className="w-full aspect-[16/9] lg:aspect-[2/1] rounded-xl" />
  );
}

export function SpeakerCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-2.5 w-16" />
    </div>
  );
}

export function PrayerCardSkeleton() {
  return (
    <div className="bg-white border border-black/5 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
}
