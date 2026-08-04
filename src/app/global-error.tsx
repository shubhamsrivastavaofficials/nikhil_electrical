'use client';

import { AlertTriangle } from 'lucide-react';
import { BUSINESS } from '@/lib/utils';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-base-900 px-5 text-center">
        <div>
          <AlertTriangle className="mx-auto h-10 w-10 text-safety-amber" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink-100">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink-500">
            Please try again, or call us directly at{' '}
            <a href={BUSINESS.phoneHref} className="text-volt-400">{BUSINESS.phoneDisplay}</a>.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-volt-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
