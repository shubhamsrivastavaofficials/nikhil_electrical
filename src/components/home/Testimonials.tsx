'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from './Services';

type Testimonial = {
  id: string;
  name: string;
  location: string;
  message: string;
  rating: number;
};

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative bg-base-850 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Customer Voices"
          title="Trusted by Our Local Community"
          subtitle="Real feedback from customers across Lalganj and Rae Bareli."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              className="relative rounded-2xl border border-white/5 bg-base-800 p-6"
            >
              <Quote className="h-6 w-6 text-copper-500/40" />
              <p className="mt-4 text-sm leading-relaxed text-ink-300">&ldquo;{t.message}&rdquo;</p>
              <div className="mt-5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${
                      idx < t.rating ? 'fill-safety-amber text-safety-amber' : 'text-ink-700'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 border-t border-white/5 pt-3">
                <p className="font-display text-sm font-semibold text-ink-100">{t.name}</p>
                <p className="text-xs text-ink-500">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
