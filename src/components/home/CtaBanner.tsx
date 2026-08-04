import { Phone } from 'lucide-react';
import { BUSINESS, whatsappLink } from '@/lib/utils';

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-volt-700 via-volt-600 to-copper-600 py-14">
      <div className="absolute inset-0 bg-circuit-grid opacity-20" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Need an Electrician Today?
          </h3>
          <p className="mt-2 text-sm text-white/85">
            Call now or message us on WhatsApp — we&apos;re ready to help.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-volt-700 shadow-lg transition-transform hover:scale-105"
          >
            <Phone className="h-4 w-4" /> {BUSINESS.phoneDisplay}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
