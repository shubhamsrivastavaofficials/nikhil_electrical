'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/#products', label: 'Wholesale' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-panel py-2.5 shadow-card' : 'bg-transparent py-4'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt-500/15 text-volt-400 ring-1 ring-volt-500/30">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold leading-tight text-ink-100">
            New Nikhil <span className="text-gradient-volt">Electrical</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-300 transition-colors hover:text-volt-400"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center gap-2 rounded-lg bg-volt-500 px-5 py-2.5 text-sm font-semibold text-white shadow-volt-glow transition-transform hover:scale-[1.03]"
          >
            <Phone className="h-4 w-4" /> Call Now
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-ink-100 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden"
          >
            <div className="glass-panel mx-5 mt-3 flex flex-col gap-1 rounded-xl p-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-volt-400"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={BUSINESS.phoneHref}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-volt-500 px-5 py-3 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" /> Call Now — {BUSINESS.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
