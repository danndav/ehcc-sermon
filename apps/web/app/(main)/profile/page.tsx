import Link from 'next/link';
import { Settings, ChevronRight, TrendingUp } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { MOCK_SERMONS, MOCK_CONTINUE_WATCHING } from '@/lib/mock-data';

export default function ProfilePage() {
  const bookmarked = MOCK_SERMONS.slice(2, 5);

  return (
    <div className="px-4 py-4 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">My Profile</h1>
        <Link href="/profile/settings" className="text-text-tertiary"><Settings size={20} /></Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-[44px] h-[44px] rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[14px] font-medium">
          AO
        </div>
        <div>
          <h2 className="text-[15px] font-medium text-text-primary">David Daniel</h2>
          <p className="text-[11px] text-text-tertiary">david@email.com</p>
          <span className="inline-block mt-0.5 bg-[#F3EAF9] text-[#4A1572] text-[10px] font-medium rounded-full px-2 py-0.5">
            EHCC Plus Subscriber
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 divide-x divide-black/[0.08]">
        {[
          { value: '48', label: 'Sermons' },
          { value: '6', label: 'Series' },
          { value: '7', label: 'Streak' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-[20px] font-medium text-[#4A1572]">{stat.value}</p>
            <p className="text-[11px] text-text-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Growth link */}
      <Link href="/growth" className="flex items-center justify-between bg-white border border-black/10 rounded-xl p-3 hover:border-black/20 transition-colors">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[#4A1572]" />
          <span className="text-[13px] font-medium text-text-primary">View spiritual growth</span>
        </div>
        <ChevronRight size={16} className="text-text-tertiary" />
      </Link>

      {/* Continue Watching */}
      {MOCK_CONTINUE_WATCHING.length > 0 && (
        <section>
          <h3 className="text-[13px] font-medium text-text-primary mb-2">Continue watching</h3>
          <div className="space-y-2">
            {MOCK_CONTINUE_WATCHING.map((sermon) => (
              <div key={sermon.id} className="flex gap-2 p-2 bg-white border border-black/10 rounded-xl">
                <div className="relative w-[100px] shrink-0 aspect-video bg-hero rounded-lg overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20">
                    <div className="h-full bg-[#4A1572] rounded-full" style={{ width: `${sermon.progress}%` }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[12px] font-medium text-text-primary line-clamp-1">{sermon.title}</h4>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{Math.round((sermon.duration || 0) / 60)} min remaining</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bookmarks */}
      <section>
        <h3 className="text-[13px] font-medium text-text-primary mb-2">My bookmarks</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {bookmarked.map((sermon) => (
            <div key={sermon.id} className="w-[120px] shrink-0">
              <div className="aspect-video bg-hero rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Subscription */}
      <section>
        <div className="bg-white border border-black/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[13px] font-medium text-text-primary">EHCC Plus · Monthly</p>
              <p className="text-[11px] text-text-tertiary">Renews 13 May 2025</p>
            </div>
            <span className="bg-teal-light text-teal text-[10px] font-medium rounded-lg px-2 py-0.5">
              Active
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <Link
              href="/profile/subscription"
              className="flex-1 text-center border border-black/15 rounded-lg py-1.5 text-[11px] text-text-secondary hover:bg-surface transition-colors"
            >
              Manage plan
            </Link>
            <button className="flex-1 text-center border border-black/15 rounded-lg py-1.5 text-[11px] text-text-secondary hover:bg-surface transition-colors">
              Gift subscription
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
