'use client';

import { useEffect, useState } from 'react';
import { getUser, logout as doLogout, AuthUser } from './auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const displayName = user?.name
    ? user.name.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : '';

  const firstName = user?.name
    ? user.name.split(' ')[0].charAt(0).toUpperCase() + user.name.split(' ')[0].slice(1).toLowerCase()
    : '';

  return {
    user,
    initials,
    displayName,
    firstName,
    eaNumber: user?.eaNumber || null,
    email: user?.email || null,
    role: user?.role || 'member',
    logout: doLogout,
  };
}
