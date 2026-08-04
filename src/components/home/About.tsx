'use client';

import { motion } from 'framer-motion';
import { Award, Users, Wrench, Clock } from 'lucide-react';
import { SectionHeading } from './Services';

const STATS = [
  { icon: Clock, value: '10+', label: 'Years Serving Lalganj' },
  { icon: Users, value: '5000+', label: 'Happy Customers' },
  { icon: Wrench, value: '15000+', label: 'Repairs Completed' },
  { icon: Award, value: '100%', label: 'Genuine Parts' },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-base-900 py-24">
      <div className="absolute inset-0 bg-circuit-grid opacity-60" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            align="left"
            eyebrow="About Us"
            title="Built on Trust, Wired with Experience"
          />
          <p className="mt-5 max-w-xl text-ink-400">
            New Nikhil Electrical has been the go-to electrical shop and repair center for
            families and businesses around Tikona Park, Lalganj. What started as a small motor
            binding workshop has grown into a full-service electrical store — supplying wholesale
            wires, switches, MCBs and LED lighting, while still doing every repair job with the
            same hands-on care.
          </p>
          <p className="mt-4 max-w-xl text-ink-400">
            We also purchase scrap copper and old motor coils at fair rates, and offer complete
            house wiring and electrical solutions for homes and shops across Rae Bareli.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-5">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/5 bg-base-800 p-4">
                <s.icon className="h-5 w-5 text-volt-400" />
                <p className="mt-2 font-display text-2xl font-bold text-ink-100">{s.value}</p>
                <p className="text-xs text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="glass-panel relative aspect-[4/5] w-full overflow-hidden rounded-3xl p-1"
        >
          <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-base-800">
            {/* Replace with a real shop-front photo — see README "Adding Real Images" */}
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-ink-700">
              <Wrench className="h-10 w-10" />
              <p className="text-sm">Shop / workshop photo goes here</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
