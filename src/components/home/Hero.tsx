'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Star, ArrowRight } from 'lucide-react';
import CallButton from '@/components/shared/CallButton';
import { whatsappLink } from '@/lib/utils';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-base-900 pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="absolute inset-0 bg-circuit-grid" />
      <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-volt-600/20 blur-[100px]" />
      <div className="absolute -right-20 top-40 h-72 h-72 rounded-full bg-copper-600/15 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="terminal-line inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-safety-amber">
            Live in Lalganj, Rae Bareli
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-ink-100 sm:text-5xl lg:text-6xl">
            Power That Never
            <br />
            <span className="text-gradient-volt">Lets You Down</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 md:text-lg">
            <span className="font-semibold text-ink-100">
              New Nikhil Electrical
            </span>{' '}
            — Tikona Park, Lalganj&apos;s trusted name for motor binding, fan
            repair, house wiring and wholesale electrical supply. Honest work,
            fair rates, same-day service.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <CallButton />

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-semibold text-ink-100 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
            >
              WhatsApp Enquiry
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/5 pt-7">
            {[
              { icon: Zap, label: 'Motor Binding Experts' },
              { icon: ShieldCheck, label: 'ISI-Marked Products' },
              { icon: Star, label: 'Trusted Since Years' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm text-ink-500"
              >
                <item.icon className="h-4 w-4 text-copper-500" />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="glass-panel relative h-full w-full overflow-hidden rounded-3xl p-8 shadow-card">
            <VoltMeter />
          </div>

          <div className="animate-floatY absolute -bottom-6 -left-6 rounded-2xl bg-copper-500 px-5 py-3.5 shadow-copper-glow">
            <p className="font-display text-2xl font-bold text-white">100%</p>
            <p className="text-xs font-medium text-white/90">
              Genuine Parts
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


function VoltMeterComponent() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#1A222C"
        strokeWidth="2"
      />

      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#2F80FF"
        strokeWidth="2"
        strokeDasharray="4 6"
        className="animate-[spin_20s_linear_infinite] origin-center"
      />

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = Number(((i / 24) * 2 * Math.PI).toFixed(10));

        const x1 = Number((100 + 74 * Math.cos(angle)).toFixed(10));
        const y1 = Number((100 + 74 * Math.sin(angle)).toFixed(10));

        const length = i % 3 === 0 ? 64 : 70;

        const x2 = Number((100 + length * Math.cos(angle)).toFixed(10));
        const y2 = Number((100 + length * Math.sin(angle)).toFixed(10));

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#4B5768"
            strokeWidth="1.5"
          />
        );
      })}

      <line
        x1="100"
        y1="100"
        x2="100"
        y2="38"
        stroke="#F5B400"
        strokeWidth="3"
        strokeLinecap="round"
        className="origin-center animate-[spin_6s_ease-in-out_infinite]"
      />

      <circle cx="100" cy="100" r="7" fill="#F5B400" />

      <text
        x="100"
        y="140"
        textAnchor="middle"
        className="fill-ink-100 font-mono text-[13px] font-medium"
      >
        230V · 50Hz
      </text>

      <text
        x="100"
        y="158"
        textAnchor="middle"
        className="fill-ink-500 font-mono text-[9px] uppercase tracking-widest"
      >
        Grid Stable
      </text>
    </svg>
  );
}


const VoltMeter = dynamic(() => Promise.resolve(VoltMeterComponent), {
  ssr: false,
});