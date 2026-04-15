'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from './constants';
import { getUser } from './auth';
import type { Branch } from '@/types/database';

const BRANCH_KEY = 'ehcc_selected_branch';
const HQ_BRANCH_ID = 1;

const FALLBACK_BRANCHES: Branch[] = [
  { id: 1, code: 'HQ', name: 'Enthronement Assembly Headquarters', location: 'Lagos Mainland, Nigeria', country: 'Nigeria', state: 'Lagos', city: 'Lagos Mainland', isActive: true },
  { id: 2, code: 'LK', name: 'Enthronement Assembly Lekki', location: 'Lagos Island, Nigeria', country: 'Nigeria', state: 'Lagos', city: 'Lekki', isActive: true },
  { id: 3, code: 'OS', name: 'Enthronement Assembly Oshogbo', location: 'Osun State, Nigeria', country: 'Nigeria', state: 'Osun', city: 'Oshogbo', isActive: true },
  { id: 4, code: 'OG', name: 'Enthronement Assembly Ogbomosho', location: 'Oyo State, Nigeria', country: 'Nigeria', state: 'Oyo', city: 'Ogbomosho', isActive: true },
  { id: 5, code: 'AB', name: 'Enthronement Assembly Abeokuta', location: 'Ogun State, Nigeria', country: 'Nigeria', state: 'Ogun', city: 'Abeokuta', isActive: true },
  { id: 6, code: 'UK', name: 'Enthronement Assembly UK', location: 'Manchester, United Kingdom', country: 'United Kingdom', state: 'England', city: 'Manchester', isActive: true },
  { id: 7, code: 'CA', name: 'Enthronement Assembly Canada', location: 'Canada', country: 'Canada', state: null, city: null, isActive: true },
  { id: 8, code: 'US', name: 'Enthronement Assembly USA', location: 'United States', country: 'United States', state: null, city: null, isActive: true },
];

interface BranchContextValue {
  branches: Branch[];
  selectedBranch: Branch | null;
  selectBranch: (branch: Branch) => void;
  isLoading: boolean;
}

const BranchContext = createContext<BranchContextValue>({
  branches: [],
  selectedBranch: null,
  selectBranch: () => {},
  isLoading: true,
});

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initBranches = useCallback((data: Branch[]) => {
    setBranches(data);
    const savedId = localStorage.getItem(BRANCH_KEY);
    const user = getUser();
    const defaultId = savedId ? Number(savedId) : user?.branchId || HQ_BRANCH_ID;
    const match = data.find((b) => b.id === defaultId) || data.find((b) => b.id === HQ_BRANCH_ID) || data[0];
    if (match) setSelectedBranch(match);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/branches`)
      .then((res) => res.json())
      .then((data: Branch[]) => {
        initBranches(data);
      })
      .catch(() => {
        // If API fails, use fallback branches
        initBranches(FALLBACK_BRANCHES);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const selectBranch = useCallback((branch: Branch) => {
    setSelectedBranch(branch);
    localStorage.setItem(BRANCH_KEY, String(branch.id));
  }, []);

  return (
    <BranchContext.Provider value={{ branches, selectedBranch, selectBranch, isLoading }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  return useContext(BranchContext);
}
