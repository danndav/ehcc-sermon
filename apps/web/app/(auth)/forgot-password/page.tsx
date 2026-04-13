'use client';

import { useState } from 'react';
import Link from 'next/link';
import { img } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="w-full max-w-sm px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center mx-auto mb-4 text-[20px]">
          ✓
        </div>
        <h2 className="text-[18px] font-medium text-text-primary mb-2">Check your email</h2>
        <p className="text-[13px] text-text-secondary mb-6">
          We sent a password reset link to {email}
        </p>
        <Link
          href="/login"
          className="inline-block bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm px-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#4A1572] flex items-center justify-center mx-auto mb-3">
          <img src={img("/images/ehcc-logo.png")} alt="EHCC" className="h-10 w-auto" />
        </div>
        <p className="text-[13px] text-text-secondary">Reset your password</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
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

        <button
          type="submit"
          className="w-full bg-[#4A1572] text-white rounded-lg px-5 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Send reset link
        </button>
      </form>

      <p className="mt-4 text-center text-[13px] text-text-secondary">
        <Link href="/login" className="text-[#4A1572] font-medium">
          Back to login
        </Link>
      </p>
    </div>
  );
}
