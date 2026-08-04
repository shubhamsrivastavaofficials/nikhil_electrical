'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Login failed');
        return;
      }
      toast.success('Welcome back!');
      router.push('/admin');
      router.refresh();
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-900 bg-circuit-grid px-5">
      <Toaster position="top-center" />
      <div className="glass-panel w-full max-w-sm rounded-2xl p-8 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt-500/15 text-volt-400 ring-1 ring-volt-500/30">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-display text-base font-semibold text-ink-100">New Nikhil Electrical</p>
            <p className="text-xs text-ink-500">Admin Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@newnikhilelectrical.com"
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-3 text-sm text-ink-100 outline-none placeholder:text-ink-700 focus:border-volt-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-3 text-sm text-ink-100 outline-none placeholder:text-ink-700 focus:border-volt-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-volt-500 py-3.5 text-sm font-semibold text-white shadow-volt-glow disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
