'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';
import { saveAdminAuth } from '@/lib/api';

export default function AdminLoginPage() {
  const [step, setStep] = useState<'identifier' | 'password' | 'set-password'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();

      if (!res.ok || !data.exists) {
        throw new Error('User not found');
      }

      setUserName(data.name || '');
      setStep(data.passwordSet ? 'password' : 'set-password');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (!['super_admin', 'admin', 'moderator', 'data_officer'].includes(data.user.role)) throw new Error('You do not have admin access');

      saveAdminAuth(data);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to set password');
      if (!['super_admin', 'admin', 'moderator', 'data_officer'].includes(data.user.role)) throw new Error('You do not have admin access');

      saveAdminAuth(data);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3D1260] flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-semibold text-white mb-1">EHCC Admin</h1>
          <p className="text-[13px] text-white/60">Sign in to manage your church platform</p>
        </div>
        <div className="bg-white rounded-xl p-6">
          {step === 'identifier' && (
            <form className="space-y-4" onSubmit={handleCheck}>
              <div>
                <label className="block text-[13px] text-text-secondary mb-1.5">EA Number or Email</label>
                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="EA/0019" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors" />
              </div>
              {error && <p className="text-[12px] text-coral">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 'password' && (
            <form className="space-y-4" onSubmit={handleLogin}>
              {userName && <p className="text-[14px] font-medium text-text-primary">Welcome, {userName.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}</p>}
              <p className="text-[12px] text-text-tertiary">{identifier}</p>
              <div>
                <label className="block text-[13px] text-text-secondary mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoFocus className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors" />
              </div>
              {error && <p className="text-[12px] text-coral">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <button type="button" onClick={() => { setStep('identifier'); setError(''); }} className="w-full text-[12px] text-text-tertiary hover:text-text-primary">
                Use different account
              </button>
            </form>
          )}

          {step === 'set-password' && (
            <form className="space-y-4" onSubmit={handleSetPassword}>
              {userName && <p className="text-[14px] font-medium text-text-primary">Welcome, {userName.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}</p>}
              <p className="text-[12px] text-text-tertiary">First time? Set your password to continue.</p>
              <div>
                <label className="block text-[13px] text-text-secondary mb-1.5">New password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" autoFocus className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] text-text-secondary mb-1.5">Confirm password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] transition-colors" />
              </div>
              {error && <p className="text-[12px] text-coral">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? 'Setting up...' : 'Set password & sign in'}
              </button>
              <button type="button" onClick={() => { setStep('identifier'); setError(''); }} className="w-full text-[12px] text-text-tertiary hover:text-text-primary">
                Use different account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
