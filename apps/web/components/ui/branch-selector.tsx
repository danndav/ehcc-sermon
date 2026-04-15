'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Check } from 'lucide-react';
import { useBranch } from '@/lib/branch-context';

export function BranchSelector() {
  const { branches, selectedBranch, selectBranch, isLoading } = useBranch();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (isLoading || !selectedBranch) return null;

  // Short display name: "HQ Lagos" / "Lekki" / "UK" etc.
  const displayName = selectedBranch.code === 'HQ'
    ? 'HQ'
    : selectedBranch.city || selectedBranch.country || selectedBranch.code || '';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[12px] font-medium text-[#4A1572] bg-[#F3EAF9] hover:bg-[#EBD8F5] transition-colors"
      >
        <MapPin size={13} />
        <span className="max-w-[80px] truncate">{displayName}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-9 w-64 bg-white border border-black/10 rounded-xl overflow-hidden z-50 shadow-lg">
          <div className="px-3 py-2 border-b border-black/[0.06]">
            <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide">Select branch</p>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {branches.map((branch) => {
              const isSelected = branch.id === selectedBranch.id;
              return (
                <button
                  key={branch.id}
                  onClick={() => {
                    selectBranch(branch);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-[#F3EAF9]' : 'hover:bg-surface'
                  }`}
                >
                  <div>
                    <p className={`text-[13px] ${isSelected ? 'text-[#4A1572] font-medium' : 'text-text-primary'}`}>
                      {branch.name}
                    </p>
                    {branch.location && (
                      <p className="text-[11px] text-text-tertiary">{branch.location}</p>
                    )}
                  </div>
                  {isSelected && <Check size={16} className="text-[#4A1572] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
