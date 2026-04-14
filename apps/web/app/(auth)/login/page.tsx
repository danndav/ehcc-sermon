'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { img } from '@/lib/utils';
import { checkIdentifier, login, setPassword } from '@/lib/auth';
import { ArrowLeft, Loader2 } from 'lucide-react';

type Step = 'identifier' | 'password' | 'set-password';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword_] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setError('');
    setLoading(true);

    try {
      const result = await checkIdentifier(identifier.trim());
      if (!result.exists) {
        setError('No account found with that EA number or email. Please check and try again.');
        setLoading(false);
        return;
      }
      setUserName(result.name || '');
      if (result.passwordSet) {
        setStep('password');
      } else {
        setStep('set-password');
      }
    } catch {
      setError('Unable to connect. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setError('');
    setLoading(true);

    try {
      await login(identifier.trim(), password);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid password. Please try again.');
    }
    setLoading(false);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await setPassword(identifier.trim(), password, email || undefined);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to set password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm px-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#4A1572] flex items-center justify-center mx-auto mb-3">
          <img src={img('/images/ehcc-logo.png')} alt="EHCC" className="h-10 w-auto" />
        </div>
        {step === 'identifier' && (
          <p className="text-[13px] text-text-secondary">Sign in with your EA number or email</p>
        )}
        {step === 'password' && (
          <>
            <p className="text-[15px] font-medium text-text-primary">Welcome back, {userName.split(' ')[0]}</p>
            <p className="text-[12px] text-text-tertiary mt-0.5">{identifier}</p>
          </>
        )}
        {step === 'set-password' && (
          <>
            <p className="text-[15px] font-medium text-text-primary">Welcome, {userName.split(' ')[0]}!</p>
            <p className="text-[12px] text-text-tertiary mt-0.5">Set a password for your account</p>
          </>
        )}
      </div>

      {/* Step 1: Enter EA number or email */}
      {step === 'identifier' && (
        <form className="space-y-4" onSubmit={handleCheckIdentifier}>
          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">EA number or email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. EA/0039 or EAX/1805 or you@email.com"
              autoFocus
              className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
            />
          </div>

          {error && <p className="text-[12px] text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading || !identifier.trim()}
            className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Continue
          </button>
        </form>
      )}

      {/* Step 2: Enter password */}
      {step === 'password' && (
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword_(e.target.value)}
              placeholder="Enter your password"
              autoFocus
              className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
            />
          </div>

          {error && <p className="text-[12px] text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Log in
          </button>

          <button
            type="button"
            onClick={() => { setStep('identifier'); setPassword_(''); setError(''); }}
            className="w-full text-[13px] text-text-tertiary hover:text-text-primary flex items-center justify-center gap-1"
          >
            <ArrowLeft size={14} /> Use a different account
          </button>
        </form>
      )}

      {/* Step 3: Set password (first time) */}
      {step === 'set-password' && (
        <form className="space-y-4" onSubmit={handleSetPassword}>
          <div className="bg-[#F3EAF9] rounded-xl p-3 mb-2">
            <p className="text-[12px] text-[#4A1572]">
              This is your first time logging in. Please create a password for your account.
            </p>
          </div>

          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Add your email for recovery"
              className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Create password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword_(e.target.value)}
              placeholder="At least 6 characters"
              autoFocus
              className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter password again"
              className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
            />
          </div>

          {error && <p className="text-[12px] text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Set password & log in
          </button>

          <button
            type="button"
            onClick={() => { setStep('identifier'); setPassword_(''); setConfirmPassword(''); setEmail(''); setError(''); }}
            className="w-full text-[13px] text-text-tertiary hover:text-text-primary flex items-center justify-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </form>
      )}
    </div>
  );
}
