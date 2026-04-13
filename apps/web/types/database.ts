export type ProgrammeType = 'sunday_service' | 'midweek_service' | '3dg' | 'morning_by_morning' | 'tod' | 'special';
export type ProgrammeSession = 'morning' | 'evening';
export type MediaType = 'video' | 'audio';

export interface Sermon {
  id: string;
  title: string;
  pastorId: string | null;
  seriesId: string | null;
  mediaType: MediaType;
  videoUrl: string | null;
  audioUrl: string | null;
  youtubeUrl: string | null;
  thumbnailUrl: string | null;
  isFree: boolean;
  viewCount: number;
  duration: number | null;
  status: 'draft' | 'transcribed' | 'published' | 'scheduled' | 'archived';
  programmeType: ProgrammeType;
  specialProgrammeName: string | null;
  threeDgDay: 1 | 2 | 3 | null;
  programmeSession: ProgrammeSession | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface SermonMetadata {
  sermonId: string;
  summary: string | null;
  tags: string[] | null;
  transcriptText: string | null;
  transcriptTimestamps: { start: number; end: number; text: string }[] | null;
}

export interface Series {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Pastor {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  churchRole: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'guest' | 'member' | 'subscriber' | 'prayer_team' | 'admin';
  createdAt: string;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  content: string;
  category: string;
  isPublic: boolean;
  prayerCount: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planTier: 'free' | 'monthly' | 'annual' | 'family';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startsAt: string;
  endsAt: string;
}
