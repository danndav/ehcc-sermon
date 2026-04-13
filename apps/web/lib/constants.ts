export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

export const MOODS = ['Anxious', 'Grateful', 'Lost', 'Joyful', 'Grieving', 'Seeking'] as const;

export const PRAYER_CATEGORIES = ['All', 'Healing', 'Finances', 'Family', 'Breakthrough', 'Thanksgiving', 'Salvation'] as const;

export const TOPIC_TAGS = ['All', 'Faith', 'Prayer', 'Marriage', 'Finances', 'Healing', 'Salvation', 'Youth', 'Peace', 'Purpose'] as const;

export const PROGRAMME_TYPES = [
  { value: 'all', label: 'All programmes' },
  { value: 'sunday_service', label: 'Sunday Service' },
  { value: 'midweek_service', label: 'Midweek Service' },
  { value: '3dg', label: '3 Days of Glory' },
  { value: 'morning_by_morning', label: 'Morning by Morning' },
  { value: 'tod', label: 'TOD' },
  { value: 'special', label: 'Special' },
] as const;

export const PROGRAMME_LABELS: Record<string, string> = {
  sunday_service: 'Sunday Service',
  midweek_service: 'Midweek Service',
  '3dg': '3 Days of Glory',
  morning_by_morning: 'Morning by Morning',
  tod: 'Throne of David',
  special: 'Special',
};

export const PROGRAMME_SHORT_LABELS: Record<string, string> = {
  sunday_service: 'Sunday',
  midweek_service: 'Midweek',
  '3dg': '3DG',
  morning_by_morning: 'MbM',
  tod: 'TOD',
  special: 'Special',
};
