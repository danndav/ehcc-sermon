export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-black/[0.06] rounded-lg ${className}`} />;
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
      <div className="border-b border-black/[0.06] px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`px-4 py-3.5 flex gap-4 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={`h-3.5 flex-1 ${j === 0 ? 'max-w-[200px]' : 'max-w-[120px]'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-${count} gap-3 mb-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-black/10 rounded-xl p-4">
          <Skeleton className="h-2.5 w-20 mb-2" />
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton({ type = 'table' }: { type?: 'table' | 'cards' | 'form' }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-black/10 rounded-xl p-4">
            <Skeleton className="h-2.5 w-20 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      {type === 'table' && <TableSkeleton />}
      {type === 'cards' && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      )}
      {type === 'form' && (
        <div className="bg-white border border-black/10 rounded-xl p-5 max-w-2xl space-y-4">
          <Skeleton className="h-3 w-32 mb-1" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-3 w-24 mb-1" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      )}
    </div>
  );
}
