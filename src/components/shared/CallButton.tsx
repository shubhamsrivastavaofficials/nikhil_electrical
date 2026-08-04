import { Phone } from 'lucide-react';
import { BUSINESS, cn } from '@/lib/utils';

export default function CallButton({
  className,
  variant = 'solid',
}: {
  className?: string;
  variant?: 'solid' | 'outline';
}) {
  return (
    <a
      href={BUSINESS.phoneHref}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold tracking-wide transition-all',
        variant === 'solid' &&
          'bg-volt-500 text-white shadow-volt-glow hover:bg-volt-400 active:scale-[0.98]',
        variant === 'outline' &&
          'border border-ink-700 text-ink-100 hover:border-volt-500 hover:text-volt-400',
        className
      )}
    >
      <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" />
      Call Now — {BUSINESS.phoneDisplay}
    </a>
  );
}
