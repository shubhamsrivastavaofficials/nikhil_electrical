'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Zap } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="relative bg-base-900 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Complete Electrical Services"
          subtitle="From motor rewinding to full house wiring — every job is handled by experienced hands, using genuine parts."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] || Zap;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-base-800 p-6 transition-colors hover:border-volt-500/40"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-volt-500/0 blur-2xl transition-colors group-hover:bg-volt-500/20" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-volt-500/10 text-volt-400 ring-1 ring-volt-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-100">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{s.description}</p>
                <a
                  href={whatsappLink(`Hello, I need help with: ${s.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-copper-500 hover:text-copper-400"
                >
                  Enquire Now →
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-copper-500">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink-100 sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-ink-500">{subtitle}</p>}
    </div>
  );
}
