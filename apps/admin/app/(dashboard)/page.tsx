import { TrendingUp, Users, Video, Heart, DollarSign, Clock, BarChart3, Activity } from 'lucide-react';
import { MOCK_STATS, MOCK_TOP_SERMONS, MOCK_RECENT_ACTIVITY, MOCK_SIGNUPS_30_DAYS } from '@/lib/mock-data';

const statCards = [
  { label: 'Total subscribers', value: MOCK_STATS.totalSubscribers, icon: Users, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
  { label: 'Monthly revenue', value: MOCK_STATS.monthlyRevenue, icon: DollarSign, color: 'text-teal', bg: 'bg-teal-light' },
  { label: 'Total sermons', value: MOCK_STATS.totalSermons, icon: Video, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
  { label: 'Watch time (hrs)', value: MOCK_STATS.watchTimeHours.toLocaleString(), icon: Clock, color: 'text-amber', bg: 'bg-amber-light' },
  { label: 'Prayer requests', value: MOCK_STATS.activePrayerRequests, icon: Heart, color: 'text-coral', bg: 'bg-coral-light' },
  { label: 'Churn rate', value: MOCK_STATS.churnRate, icon: Activity, color: 'text-coral', bg: 'bg-coral-light' },
];

export default function AdminDashboardPage() {
  const maxSignups = Math.max(...MOCK_SIGNUPS_30_DAYS.map((d) => d.count), 1);

  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-black/10 rounded-xl p-4">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
                <Icon size={18} />
              </div>
              <p className="text-[18px] font-medium text-text-primary">{stat.value}</p>
              <p className="text-[10px] text-text-tertiary mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Sign-ups chart */}
      <div className="bg-white border border-black/10 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-medium text-text-primary">New sign-ups (last 30 days)</h2>
          <span className="text-[12px] text-[#4A1572] font-medium">{MOCK_STATS.newSignupsThisMonth} this month</span>
        </div>
        <div className="flex items-end gap-[3px] h-[100px]">
          {MOCK_SIGNUPS_30_DAYS.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div
                className="w-full bg-[#4A1572] rounded-t hover:bg-[#3D1260] transition-colors cursor-pointer min-h-[2px]"
                style={{ height: `${(d.count / maxSignups) * 100}%` }}
              />
              <div className="hidden group-hover:block absolute -top-7 bg-text-primary text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                {d.date}: {d.count}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-text-tertiary">{MOCK_SIGNUPS_30_DAYS[0].date}</span>
          <span className="text-[9px] text-text-tertiary">{MOCK_SIGNUPS_30_DAYS[MOCK_SIGNUPS_30_DAYS.length - 1].date}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Sermons */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Top sermons this week</h2>
          <div className="space-y-2">
            {MOCK_TOP_SERMONS.map((sermon, i) => (
              <div key={sermon.id} className="flex items-center gap-3 py-2 border-b border-black/[0.04] last:border-0">
                <span className="text-[13px] font-medium text-text-tertiary w-5 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary truncate">{sermon.title}</p>
                  <p className="text-[10px] text-text-tertiary">{sermon.pastor}</p>
                </div>
                <span className="text-[12px] font-medium text-[#4A1572]">{sermon.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prayer wall activity */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Prayer wall activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-black/[0.04]">
              <span className="text-[13px] text-text-secondary">Requests this week</span>
              <span className="text-[14px] font-medium text-[#4A1572]">{MOCK_STATS.prayerRequestsThisWeek}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[0.04]">
              <span className="text-[13px] text-text-secondary">Prayers agreed</span>
              <span className="text-[14px] font-medium text-[#4A1572]">{MOCK_STATS.prayerAgreementsThisWeek}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[0.04]">
              <span className="text-[13px] text-text-secondary">Active members</span>
              <span className="text-[14px] font-medium text-[#4A1572]">{MOCK_STATS.activePrayerMembers}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-text-secondary">Private requests (unread)</span>
              <span className="text-[14px] font-medium text-coral">2</span>
            </div>
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
                  <p className="text-[12px] text-text-primary">{activity.message}</p>
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
