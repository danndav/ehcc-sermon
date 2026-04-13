'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getImagePath } from '@/lib/utils';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="w-full max-w-sm px-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#4A1572] flex items-center justify-center mx-auto mb-3">
          <img src={getImagePath('/images/ehcc-logo.png')} alt="EHCC" className="h-10 w-auto" />
        </div>
        <p className="text-[13px] text-text-secondary">Create your account</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-[13px] text-text-secondary mb-1.5">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-[13px] text-text-secondary mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-[13px] text-text-secondary mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-[13px] text-text-secondary mb-1.5">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
          />
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-[#4A1572]"
          />
          <span className="text-[12px] text-text-secondary leading-relaxed">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreed}
          className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-center text-[13px] text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="text-[#4A1572] font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
