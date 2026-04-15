'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from './constants';
import { useBranch } from './branch-context';

interface ApiSermon {
  id: string;
  title: string;
  pastorId: string | null;
  mediaType: string;
  thumbnailUrl: string | null;
  isFree: boolean;
  viewCount: number;
  duration: number | null;
  status: string;
  programmeType: string;
  specialProgrammeName: string | null;
  threeDgDay: number | null;
  programmeSession: string | null;
  branchId: number | null;
  publishedAt: string | null;
  createdAt: string;
  youtubeUrl: string | null;
}

interface ApiPastor {
  id: string;
  name: string;
}

export interface SermonWithPastor extends Omit<ApiSermon, 'mediaType' | 'programmeType'> {
  pastor: string;
  date: string;
  year: number;
  mediaType: 'video' | 'audio';
  programmeType: string;
  tags?: string[];
}

export function useSermons() {
  const { selectedBranch } = useBranch();
  const [sermons, setSermons] = useState<SermonWithPastor[]>([]);
  const [pastors, setPastors] = useState<ApiPastor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const branchParam = selectedBranch ? `&branchId=${selectedBranch.id}` : '';

    Promise.all([
      fetch(`${API_BASE_URL}/sermons?limit=100${branchParam}`).then(r => r.json()).catch(() => ({ data: [], total: 0 })),
      fetch(`${API_BASE_URL}/sermons/pastors`).then(r => r.json()).catch(() => []),
    ]).then(async ([sermonResult, pastorList]) => {
      const pastorMap = new Map<string, string>();
      (pastorList as ApiPastor[]).forEach(p => pastorMap.set(p.id, p.name));
      setPastors(pastorList);

      // Fetch metadata (tags) for each sermon
      const metadataMap = new Map<string, string[]>();
      try {
        const metadataPromises = (sermonResult.data as ApiSermon[]).map(s =>
          fetch(`${API_BASE_URL}/sermons/${s.id}/metadata`).then(r => r.ok ? r.json() : null).catch(() => null)
        );
        const metadataResults = await Promise.all(metadataPromises);
        metadataResults.forEach((m: any) => {
          if (m?.sermonId && m?.tags) metadataMap.set(m.sermonId, m.tags);
        });
      } catch {}

      const mapped: SermonWithPastor[] = (sermonResult.data as ApiSermon[]).map(s => {
        const date = s.publishedAt || s.createdAt;
        return {
          ...s,
          mediaType: (s.mediaType as 'video' | 'audio') || 'video',
          pastor: s.pastorId ? pastorMap.get(s.pastorId) || 'Unknown' : 'Unknown',
          date,
          year: new Date(date).getFullYear(),
          tags: metadataMap.get(s.id) || undefined,
        };
      });

      setSermons(mapped);
      setTotal(sermonResult.total);
    }).finally(() => setLoading(false));
  }, [selectedBranch]);

  return { sermons, pastors, loading, total };
}
