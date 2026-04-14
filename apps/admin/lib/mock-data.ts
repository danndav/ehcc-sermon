export const MOCK_STATS = {
  totalSubscribers: 342,
  monthlyRevenue: '₦1,026,000',
  totalSermons: 48,
  activePrayerRequests: 23,
  newSignupsThisMonth: 67,
  churnRate: '4.2%',
};

export const MOCK_RECENT_ACTIVITY = [
  { id: '1', type: 'sermon', message: 'New sermon uploaded: "Open Heavens — Day 3 Evening"', time: '2 hours ago' },
  { id: '2', type: 'subscriber', message: 'New subscriber: Adaeze Okonkwo (Monthly plan)', time: '3 hours ago' },
  { id: '3', type: 'prayer', message: 'New private prayer request from Emmanuel M.', time: '5 hours ago' },
  { id: '4', type: 'sermon', message: 'Sermon published: "The Heart of Worship"', time: '1 day ago' },
  { id: '5', type: 'subscriber', message: 'Subscription cancelled: David K.', time: '1 day ago' },
];

export const MOCK_TOP_SERMONS = [
  { id: '13', title: 'New Year Crossover Night', pastor: 'Rev Deji Olabode', views: 4100 },
  { id: '15', title: 'Foundations of Faith', pastor: 'Rev Deji Olabode', views: 3400 },
  { id: '12', title: 'Christmas Special — The Gift of Emmanuel', pastor: 'Rev Deji Olabode', views: 3200 },
  { id: '25', title: 'Open Heavens — Day 3 Evening', pastor: 'Rev Deji Olabode', views: 3100 },
  { id: '16', title: 'The Power of the Tongue', pastor: 'Dr Seun Olabode', views: 2800 },
];

export const MOCK_ADMIN_SERMONS = [
  { id: '1', title: 'Finding Peace in the Storm', pastor: 'Rev Deji Olabode', date: '6 Apr 2025', status: 'published', access: 'paid', views: 1240, programme: 'Sunday Service' },
  { id: '20', title: 'Open Heavens — Day 1 Morning', pastor: 'Rev Deji Olabode', date: '1 Apr 2025', status: 'published', access: 'free', views: 2800, programme: '3DG' },
  { id: '2', title: 'Power of Prayer', pastor: 'Dr Seun Olabode', date: '2 Apr 2025', status: 'published', access: 'free', views: 890, programme: 'Midweek' },
  { id: '26', title: 'Start Your Day With God — Monday', pastor: 'Rev Deji Olabode', date: '7 Apr 2025', status: 'published', access: 'free', views: 450, programme: 'MbM' },
  { id: '29', title: 'Throne of David — Warfare Prayers', pastor: 'Rev Deji Olabode', date: '5 Apr 2025', status: 'published', access: 'free', views: 680, programme: 'TOD' },
  { id: '3', title: 'Walking in Purpose', pastor: 'Min Joseph Sanni', date: '30 Mar 2025', status: 'published', access: 'free', views: 1560, programme: 'Sunday Service' },
  { id: '99', title: 'The Anchor of Hope', pastor: 'Rev Deji Olabode', date: '13 Apr 2025', status: 'draft', access: 'free', views: 0, programme: 'Sunday Service' },
  { id: '100', title: '3DG May 2025 — Day 1 Morning', pastor: 'Rev Deji Olabode', date: '1 May 2025', status: 'scheduled', access: 'free', views: 0, programme: '3DG' },
];

export const MOCK_USERS = [
  { id: '1', name: 'Adaeze Okonkwo', email: 'adaeze@email.com', role: 'subscriber', subscriptionStatus: 'active', joinDate: '12 Jan 2025', lastActive: '2 hours ago' },
  { id: '2', name: 'Emmanuel Musa', email: 'emmanuel@email.com', role: 'member', subscriptionStatus: 'free', joinDate: '5 Mar 2025', lastActive: '1 day ago' },
  { id: '3', name: 'Grace Nwosu', email: 'grace@email.com', role: 'subscriber', subscriptionStatus: 'active', joinDate: '20 Nov 2024', lastActive: '3 hours ago' },
  { id: '4', name: 'David Kalu', email: 'david@email.com', role: 'member', subscriptionStatus: 'cancelled', joinDate: '8 Sep 2024', lastActive: '5 days ago' },
  { id: '5', name: 'Blessing Adekunle', email: 'blessing@email.com', role: 'prayer_team', subscriptionStatus: 'active', joinDate: '1 Feb 2025', lastActive: '6 hours ago' },
  { id: '6', name: 'Samuel Obi', email: 'samuel@email.com', role: 'subscriber', subscriptionStatus: 'active', joinDate: '15 Dec 2024', lastActive: '1 hour ago' },
  { id: '7', name: 'Funmi Adeyemi', email: 'funmi@email.com', role: 'member', subscriptionStatus: 'free', joinDate: '28 Mar 2025', lastActive: '12 hours ago' },
  { id: '8', name: 'Tunde Balogun', email: 'tunde@email.com', role: 'admin', subscriptionStatus: 'active', joinDate: '1 Jan 2024', lastActive: '30 min ago' },
];

export const MOCK_PRAYER_REQUESTS = [
  { id: '1', name: 'Adaeze O.', content: 'Please pray for my mother\'s surgery next week. She needs God\'s hand upon the doctors.', category: 'Healing', date: '13 Apr 2025', isPrivate: true, status: 'unread' },
  { id: '2', name: 'Emmanuel M.', content: 'Believing God for a breakthrough in my business this quarter.', category: 'Breakthrough', date: '13 Apr 2025', isPrivate: true, status: 'unread' },
  { id: '3', name: 'Grace N.', content: 'Pray for direction in my career. I feel stuck and need clarity.', category: 'Breakthrough', date: '12 Apr 2025', isPrivate: true, status: 'prayed' },
  { id: '4', name: 'Blessing A.', content: 'My marriage is going through a very difficult season. We need God\'s intervention.', category: 'Family', date: '11 Apr 2025', isPrivate: true, status: 'prayed' },
  { id: '5', name: 'Samuel O.', content: 'Thank God for healing my son. He is completely recovered.', category: 'Thanksgiving', date: '10 Apr 2025', isPrivate: false, status: 'archived' },
];

export const MOCK_PAYMENTS = [
  { id: '1', name: 'Adaeze Okonkwo', plan: 'Monthly', amount: '₦3,000', date: '13 Apr 2025', ref: 'PAY_abc123', status: 'success' },
  { id: '2', name: 'Grace Nwosu', plan: 'Annual', amount: '₦30,000', date: '12 Apr 2025', ref: 'PAY_def456', status: 'success' },
  { id: '3', name: 'Samuel Obi', plan: 'Monthly', amount: '₦3,000', date: '11 Apr 2025', ref: 'PAY_ghi789', status: 'success' },
  { id: '4', name: 'David Kalu', plan: 'Monthly', amount: '₦3,000', date: '10 Apr 2025', ref: 'PAY_jkl012', status: 'failed' },
  { id: '5', name: 'Funmi Adeyemi', plan: 'Monthly', amount: '₦3,000', date: '9 Apr 2025', ref: 'PAY_mno345', status: 'success' },
];
