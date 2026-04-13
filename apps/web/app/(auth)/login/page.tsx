'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getImagePath } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-sm px-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#4A1572] flex items-center justify-center mx-auto mb-3">
          <img src={getImagePath('/images/ehcc-logo.png')} alt="EHCC" className="h-10 w-auto" />
        </div>
        <p className="text-[13px] text-text-secondary">Welcome back</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
            placeholder="Enter your password"
            className="w-full bg-surface border border-black/[0.15] rounded-lg px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] focus:ring-[3px] focus:ring-[#4A1572]/15 transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Log in
        </button>
      </form>

      <div className="mt-4 text-center space-y-2">
        <Link href="/forgot-password" className="block text-[13px] text-[#4A1572]">
          Forgot password?
        </Link>
        <p className="text-[13px] text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#4A1572] font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
