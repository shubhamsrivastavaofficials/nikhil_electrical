'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, IndianRupee, Timer, Users2 } from 'lucide-react';

const POINTS = [
  {
    icon: BadgeCheck,
    title: 'Genuine & ISI-Marked',
    desc: 'Every wire, switch and MCB we sell or use for repair is quality-checked and ISI marked.',
  },
  {
    icon: Timer,
    title: 'Fast Turnaround',
    desc: 'Most fan and motor repairs are completed same-day, so you\'re not left waiting.',
  },
  {
    icon: IndianRupee,
    title: 'Fair, Transparent Pricing',
    desc: 'No hidden charges — wholesale rates on bulk orders, honest quotes on every repair.',
  },
  {
    icon: Users2,
    title: 'Local & Trusted',
    desc: 'A known name in Tikona Park, Lalganj — built on years of word-of-mouth trust.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-base-900 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl bg-gradient-to-b from-base-800 to-base-850 p-6"
            >
              <p.icon className="h-6 w-6 text-volt-400" />
              <h3 className="mt-4 font-display text-base font-semibold text-ink-100">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
