'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import { SectionHeading } from './Services';
import { whatsappLink, cn } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  priceNote: string;
  imageUrl: string | null;
};

export default function Products({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="relative bg-base-850 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Wholesale Supply"
          title="Electrical Products in Bulk"
          subtitle="Wires, switches, MCB, LED lights, fans and accessories — stocked and supplied at dealer rates."
        />

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active === c
                  ? 'bg-volt-500 text-white'
                  : 'bg-base-800 text-ink-500 hover:text-ink-100'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
              className="overflow-hidden rounded-2xl border border-white/5 bg-base-800"
            >
              <div className="relative aspect-[4/3] w-full bg-base-700">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-700">
                    <PackageSearch className="h-10 w-10" />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-base-950/80 px-3 py-1 text-[11px] font-medium text-copper-400 backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-ink-100">{p.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-500">{p.priceNote}</span>
                  <a
                    href={whatsappLink(`Hello, I want wholesale pricing for: ${p.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-volt-500/10 px-3 py-1.5 text-xs font-semibold text-volt-400 ring-1 ring-volt-500/20 hover:bg-volt-500 hover:text-white"
                  >
                    Get Price
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
