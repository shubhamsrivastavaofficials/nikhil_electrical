'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageOff } from 'lucide-react';
import { SectionHeading } from './Services';
import { cn } from '@/lib/utils';

type GalleryImage = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
};

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(images.map((i) => i.category)))],
    [images]
  );
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered = active === 'All' ? images : images.filter((i) => i.category === active);

  return (
    <section id="gallery" className="relative bg-base-900 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Our Work"
          title="Gallery — Workshop & Products"
          subtitle="A look inside our shop, motor binding workstation, and completed wiring projects."
        />

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active === c
                  ? 'bg-copper-500 text-white'
                  : 'bg-base-800 text-ink-500 hover:text-ink-100'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-14 flex flex-col items-center gap-3 text-ink-700">
            <ImageOff className="h-8 w-8" />
            <p className="text-sm">Gallery photos coming soon.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((img, i) => (
              <motion.button
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
                onClick={() => setLightbox(img)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-base-800"
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-medium text-white">{img.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              aria-label="Close"
              className="absolute right-6 top-6 text-white/70 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="h-7 w-7" />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="relative aspect-[4/3] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightbox.imageUrl} alt={lightbox.altText} fill className="rounded-xl object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
