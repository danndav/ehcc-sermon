import { TrendingUp, Users, Video, Heart, DollarSign } from 'lucide-react';
import { MOCK_STATS, MOCK_TOP_SERMONS, MOCK_RECENT_ACTIVITY } from '@/lib/mock-data';

const statCards = [
  { label: 'Total subscribers', value: MOCK_STATS.totalSubscribers, icon: Users, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
  { label: 'Monthly revenue', value: MOCK_STATS.monthlyRevenue, icon: DollarSign, color: 'text-teal', bg: 'bg-teal-light' },
  { label: 'Total sermons', value: MOCK_STATS.totalSermons, icon: Video, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
  { label: 'Prayer requests', value: MOCK_STATS.activePrayerRequests, icon: Heart, color: 'text-coral', bg: 'bg-coral-light' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-black/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-[20px] font-medium text-text-primary">{stat.value}</p>
              <p className="text-[11px] text-text-tertiary mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sermons */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Top sermons this week</h2>
          <div className="space-y-2">
            {MOCK_TOP_SERMONS.map((sermon, i) => (
              <div key={sermon.id} className="flex items-center gap-3 py-2 border-b border-black/[0.04] last:border-0">
                <span className="text-[13px] font-medium text-text-tertiary w-5 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary truncate">{sermon.title}</p>
                  <p className="text-[11px] text-text-tertiary">{sermon.pastor}</p>
                </div>
                <span className="text-[13px] font-medium text-[#4A1572]">{sermon.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Recent activity</h2>
          <div className="space-y-3">
            {MOCK_RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  activity.type === 'sermon' ? 'bg-[#4A1572]' : activity.type === 'subscriber' ? 'bg-teal' : 'bg-coral'
                }`} />
                <div>
                  <p className="text-[13px] text-text-primary">{activity.message}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
