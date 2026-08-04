import Link from 'next/link';
import { Zap } from 'lucide-react';
import CallButton from '@/components/shared/CallButton';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-900 bg-circuit-grid px-5 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-volt-500/15 text-volt-400 ring-1 ring-volt-500/30">
        <Zap className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold text-ink-100">404</h1>
      <p className="mt-2 text-ink-500">This page short-circuited. Let&apos;s get you back on track.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg border border-ink-700 px-6 py-3 text-sm font-semibold text-ink-100 hover:border-volt-500">
          Back to Home
        </Link>
        <CallButton />
      </div>
    </div>
  );
}
