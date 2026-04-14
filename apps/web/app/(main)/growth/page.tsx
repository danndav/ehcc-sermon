'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, TrendingUp, Award, Calendar } from 'lucide-react';

const WEEKLY_DATA = [
  { day: 'Mon', count: 2 },
  { day: 'Tue', count: 1 },
  { day: 'Wed', count: 3 },
  { day: 'Thu', count: 0 },
  { day: 'Fri', count: 1 },
  { day: 'Sat', count: 2 },
  { day: 'Sun', count: 1 },
];

const TOPICS_EXPLORED = [
  { name: 'Faith', count: 12 },
  { name: 'Prayer', count: 8 },
  { name: 'Peace', count: 6 },
  { name: 'Healing', count: 5 },
  { name: 'Purpose', count: 4 },
  { name: 'Covenant', count: 3 },
];

const COMPLETED_SERIES = [
  { id: '3', title: 'Walking in Purpose', completedDate: '23 Mar 2025' },
];

const MONTHLY_SUMMARY = {
  month: 'April 2025',
  sermonsWatched: 12,
  topicsExplored: 4,
  prayerNights: 18,
  seriesCompleted: 1,
};

export default function GrowthTrackerPage() {
  const [weeklyGoal, setWeeklyGoal] = useState(3);
  const sermonsThisWeek = WEEKLY_DATA.reduce((sum, d) => sum + d.count, 0);
  const goalProgress = Math.min((sermonsThisWeek / weeklyGoal) * 100, 100);
  const maxCount = Math.max(...WEEKLY_DATA.map((d) => d.count), 1);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-5">Spiritual growth</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { value: '48', label: 'Sermons watched', icon: TrendingUp, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
          { value: '3', label: 'Series completed', icon: Award, color: 'text-teal', bg: 'bg-teal-light' },
          { value: '7', label: 'Current streak', icon: Calendar, color: 'text-[#4A1572]', bg: 'bg-[#F3EAF9]' },
          { value: '14', label: 'Best streak', icon: Target, color: 'text-amber', bg: 'bg-amber-light' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-black/10 rounded-xl p-3">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
                <Icon size={16} />
              </div>
              <p className="text-[20px] font-medium text-text-primary">{stat.value}</p>
              <p className="text-[11px] text-text-tertiary">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly goal */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-medium text-text-primary">Weekly goal</h2>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setWeeklyGoal(Math.max(1, weeklyGoal - 1))} className="w-6 h-6 rounded border border-black/10 text-text-tertiary flex items-center justify-center text-[13px] hover:bg-surface">−</button>
              <span className="text-[13px] font-medium text-[#4A1572] w-8 text-center">{weeklyGoal}</span>
              <button onClick={() => setWeeklyGoal(weeklyGoal + 1)} className="w-6 h-6 rounded border border-black/10 text-text-tertiary flex items-center justify-center text-[13px] hover:bg-surface">+</button>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-[#4A1572] rounded-full transition-all" style={{ width: `${goalProgress}%` }} />
            </div>
            <span className="text-[12px] font-medium text-[#4A1572]">{sermonsThisWeek}/{weeklyGoal}</span>
          </div>
          <p className="text-[11px] text-text-tertiary">
            {sermonsThisWeek >= weeklyGoal ? 'Goal reached! Keep going.' : `${weeklyGoal - sermonsThisWeek} more to hit your goal this week.`}
          </p>

          {/* Bar chart */}
          <div className="flex items-end gap-2 mt-4 h-[80px]">
            {WEEKLY_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: '60px' }}>
                  <div
                    className={`w-full rounded-t ${d.count > 0 ? 'bg-[#4A1572]' : 'bg-surface'}`}
                    style={{ height: `${d.count > 0 ? (d.count / maxCount) * 100 : 10}%`, minHeight: '4px' }}
                  />
                </div>
                <span className="text-[10px] text-text-tertiary">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly summary */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-1">{MONTHLY_SUMMARY.month}</h2>
          <p className="text-[11px] text-text-tertiary mb-4">Your monthly summary</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-black/[0.06]">
              <span className="text-[13px] text-text-secondary">Sermons watched</span>
              <span className="text-[14px] font-medium text-[#4A1572]">{MONTHLY_SUMMARY.sermonsWatched}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[0.06]">
              <span className="text-[13px] text-text-secondary">Topics explored</span>
              <span className="text-[14px] font-medium text-[#4A1572]">{MONTHLY_SUMMARY.topicsExplored}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[0.06]">
              <span className="text-[13px] text-text-secondary">Prayer nights attended</span>
              <span className="text-[14px] font-medium text-[#4A1572]">{MONTHLY_SUMMARY.prayerNights}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-text-secondary">Series completed</span>
              <span className="text-[14px] font-medium text-[#4A1572]">{MONTHLY_SUMMARY.seriesCompleted}</span>
            </div>
          </div>
        </div>

        {/* Topics explored */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Topics explored</h2>
          <div className="space-y-2">
            {TOPICS_EXPLORED.map((topic) => (
              <div key={topic.name} className="flex items-center gap-3">
                <span className="text-[12px] text-text-secondary w-16">{topic.name}</span>
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-[#4A1572] rounded-full" style={{ width: `${(topic.count / TOPICS_EXPLORED[0].count) * 100}%` }} />
                </div>
                <span className="text-[11px] text-text-tertiary w-6 text-right">{topic.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completed series + certificates */}
        <div className="bg-white border border-black/10 rounded-xl p-4">
          <h2 className="text-[14px] font-medium text-text-primary mb-3">Certificates</h2>
          {COMPLETED_SERIES.length > 0 ? (
            <div className="space-y-2">
              {COMPLETED_SERIES.map((series) => (
                <div key={series.id} className="flex items-center justify-between py-2 border-b border-black/[0.06] last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{series.title}</p>
                    <p className="text-[10px] text-text-tertiary">Completed {series.completedDate}</p>
                  </div>
                  <button className="bg-[#4A1572] text-white rounded-lg px-3 py-1.5 text-[11px] font-medium hover:opacity-90 transition-all">
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-text-tertiary">Complete a series to earn your first certificate</p>
          )}
        </div>
      </div>
    </div>
  );
}
