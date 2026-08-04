import Link from 'next/link';
import { Zap, MapPin, Phone, Clock } from 'lucide-react';
import { BUSINESS } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-base-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt-500/15 text-volt-400 ring-1 ring-volt-500/30">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold text-ink-100">New Nikhil Electrical</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            Your trusted neighbourhood electrical shop, repair center &amp; wholesale supplier in
            Lalganj, Rae Bareli — serving with honesty since day one.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-300">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
            <li><Link href="/#services" className="hover:text-volt-400">Services</Link></li>
            <li><Link href="/#products" className="hover:text-volt-400">Wholesale Products</Link></li>
            <li><Link href="/#gallery" className="hover:text-volt-400">Gallery</Link></li>
            <li><Link href="/#about" className="hover:text-volt-400">About Us</Link></li>
            <li><Link href="/#contact" className="hover:text-volt-400">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-300">
            Popular Services
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
            <li>Motor Binding &amp; Rewinding</li>
            <li>Fan Binding &amp; Repair</li>
            <li>House Wiring</li>
            <li>Electrical Wire Wholesale</li>
            <li>Scrap Copper Purchase</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-300">
            Get In Touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-ink-500">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" />
              {BUSINESS.fullAddress}
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" />
              <a href={BUSINESS.phoneHref} className="hover:text-volt-400">{BUSINESS.phoneDisplay}</a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" />
              Mon – Sun: 9:00 AM – 8:30 PM
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5">
        <p className="text-center text-xs text-ink-700">
          © {new Date().getFullYear()} New Nikhil Electrical, Tikona Park, Lalganj, Rae Bareli. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
