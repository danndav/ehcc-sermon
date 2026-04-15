'use client';

import { useState, useEffect } from 'react';
import { Users, Video, Heart, Eye, Clock, Activity } from 'lucide-react';
import { adminGet } from '@/lib/api';

interface Analytics {
  totalViews: number;
  uniqueViewers: number;
  totalSermons: number;
  publishedSermons: number;
  topSermons: { id: string; title: string; viewCount: number; pastorName: string; programmeType: string }[];
}

interface RecentActivity {
  eaNumber: string;
  userName: string;
  sermonTitle: string;
  sermonId: string;
  progressSeconds: number;
  completed: boolean;
  watchedAt: string;
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminGet<Analytics>('/admin/sermons/analytics/overview').catch(() => null),
      adminGet<RecentActivity[]>('/admin/sermons/analytics/recent-activity').catch(() => []),
    ]).then(([analyticsData, activityData]) => {
      setAnalytics(analyticsData);
      setRecentActivity(activityData || []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total views', value: analytics?.totalViews ?? 0, icon: Eye, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
    { label: 'Unique viewers', value: analytics?.uniqueViewers ?? 0, icon: Users, color: 'text-teal', bg: 'bg-teal-light' },
    { label: 'Total sermons', value: analytics?.totalSermons ?? 0, icon: Video, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
    { label: 'Published', value: analytics?.publishedSermons ?? 0, icon: Activity, color: 'text-amber', bg: 'bg-amber-light' },
  ];

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-black/10 rounded-xl p-4">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
                <Icon size={18} />
              </div>
              <p className="text-[18px] font-medium text-text-primary">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
              <p className="text-[10px] text-text-tertiary mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Sermons */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Top sermons by views</h2>
          {(analytics?.topSermons || []).length > 0 ? (
            <div className="space-y-2">
              {(analytics?.topSermons || []).map((sermon, i) => (
                <div key={sermon.id} className="flex items-center gap-3 py-2 border-b border-black/[0.04] last:border-0">
                  <span className="text-[13px] font-medium text-text-tertiary w-5 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-primary truncate">{sermon.title}</p>
                    <p className="text-[10px] text-text-tertiary">{sermon.pastorName || 'Unknown'}</p>
                  </div>
                  <span className="text-[12px] font-medium text-[#4A1572]">{sermon.viewCount.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-text-tertiary text-center py-6">No sermon data yet</p>
          )}
        </div>

        {/* Recent Watch Activity */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Recent watch activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activity.completed ? 'bg-teal' : 'bg-[#4A1572]'}`} />
                  <div>
                    <p className="text-[12px] text-text-primary">
                      <span className="font-medium">{activity.eaNumber || 'Member'}</span>
                      {' '}{activity.completed ? 'finished' : 'watched'}{' '}
                      <span className="font-medium">{activity.sermonTitle}</span>
                    </p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">
                      {activity.userName} · {timeAgo(activity.watchedAt)}
                      {!activity.completed && activity.progressSeconds > 0 && ` · ${Math.round(activity.progressSeconds / 60)} min watched`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-text-tertiary text-center py-6">No activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
