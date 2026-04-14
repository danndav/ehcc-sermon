'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { img } from '@/lib/utils';
import { checkIdentifier, login, setPassword } from '@/lib/auth';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';

type Step = 'identifier' | 'password' | 'set-password';
type LoginMethod = 'ea' | 'email';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identifier');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('ea');
  const [eaPrefix, setEaPrefix] = useState('EA');
  const [eaNumber, setEaNumber] = useState('0000');

  const handleEaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      // Shift digits right (remove last digit, add 0 at front)
      const current = eaNumber;
      const shifted = '0' + current.slice(0, 3);
      setEaNumber(shifted);
      setTimeout(() => input.setSelectionRange(4, 4), 0);
      return;
    }

    if (/^\d$/.test(key)) {
      e.preventDefault();
      // Shift digits left and add new digit at end
      const shifted = eaNumber.slice(1) + key;
      setEaNumber(shifted);
      setTimeout(() => input.setSelectionRange(4, 4), 0);
      return;
    }

    // Allow Tab, Enter, Arrow keys
    if (!['Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
    }
  };
  const [emailInput, setEmailInput] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword_] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getFullIdentifier = () => {
    if (loginMethod === 'ea') {
      return `${eaPrefix}/${eaNumber.trim()}`;
    }
    return emailInput.trim();
  };

  const handleCheckIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullId = getFullIdentifier();
    if (loginMethod === 'ea' && !eaNumber.trim()) return;
    if (loginMethod === 'email' && !emailInput.trim()) return;
    setError('');
    setLoading(true);

    try {
      const result = await checkIdentifier(fullId);
      if (!result.exists) {
        setError(loginMethod === 'ea'
          ? 'No account found with that EA number. Please check and try again.'
          : 'No account found with that email. Please check and try again.');
        setLoading(false);
        return;
      }
      setIdentifier(fullId);
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
      await login(identifier, password);
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
      await setPassword(identifier, password, email || undefined);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to set password. Please try again.');
    }
    setLoading(false);
  };

  const isIdentifierValid = loginMethod === 'ea' ? eaNumber.trim().length > 0 : emailInput.trim().length > 0;

  return (
    <div className="w-full max-w-sm px-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#4A1572] flex items-center justify-center mx-auto mb-3">
          <img src={img('/images/ehcc-logo.png')} alt="EHCC" className="h-10 w-auto" />
        </div>
        {step === 'identifier' && (
          <p className="text-[13px] text-text-secondary">Sign in to your account</p>
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
          {/* Login method toggle */}
          <div className="flex bg-surface rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => { setLoginMethod('ea'); setError(''); }}
              className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-colors ${
                loginMethod === 'ea'
                  ? 'bg-white text-[#4A1572] shadow-sm'
                  : 'text-text-tertiary'
              }`}
            >
              EA number
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('email'); setError(''); }}
              className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-colors ${
                loginMethod === 'email'
                  ? 'bg-white text-[#4A1572] shadow-sm'
                  : 'text-text-tertiary'
              }`}
            >
              Email
            </button>
          </div>

          {/* EA number input */}
          {loginMethod === 'ea' && (
            <div>
              <label className="block text-[13px] text-text-secondary mb-1.5">EA number</label>
              <div className="flex gap-2">
                <select
                  value={eaPrefix}
                  onChange={(e) => setEaPrefix(e.target.value)}
                  className="bg-surface border border-black/[0.15] rounded-lg px-3 py-2.5 text-[13px] text-text-primary font-medium focus:outline-none focus:border-[#4A1572] transition-all"
                >
                  <option value="EA">EA/</option>
                  <option value="EAX">EAX/</option>
                </select>
                <input
                  type="text"
                  inputMode="numeric"
                  value={eaNumber}
                  onChange={() => {}}
                  onKeyDown={handleEaKeyDown}
                  autoFocus
                  className="flex-1 bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
                />
              </div>
              <p className="text-[11px] text-text-tertiary mt-1.5">Your church membership number</p>
            </div>
          )}

          {/* Email input */}
          {loginMethod === 'email' && (
            <div>
              <label className="block text-[13px] text-text-secondary mb-1.5">Email address</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@email.com"
                autoFocus
                className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
              />
            </div>
          )}

          {error && <p className="text-[12px] text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isIdentifierValid}
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword_(e.target.value)}
                placeholder="Enter your password"
                autoFocus
                className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 pr-10 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
            onClick={() => { setStep('identifier'); setPassword_(''); setError(''); setShowPassword(false); }}
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword_(e.target.value)}
                placeholder="At least 6 characters"
                autoFocus
                className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 pr-10 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter password again"
                className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 pr-10 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
            onClick={() => { setStep('identifier'); setPassword_(''); setConfirmPassword(''); setEmail(''); setError(''); setShowPassword(false); setShowConfirmPassword(false); }}
            className="w-full text-[13px] text-text-tertiary hover:text-text-primary flex items-center justify-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </form>
      )}
    </div>
  );
}
