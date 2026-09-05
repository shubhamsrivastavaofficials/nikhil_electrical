'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Images,
  Wrench,
  PackageSearch,
  MessageSquareQuote,
  Inbox,
  LogOut,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/products', label: 'Products', icon: PackageSearch },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
];

export default function MobileTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    window.location.href = '/admin/login';
  }

  return (
    <div className="sticky top-0 z-30 border-b border-white/5 bg-base-950 md:hidden">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt-500/15 text-volt-400 ring-1 ring-volt-500/30">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <p className="font-display text-sm font-semibold text-ink-100">Admin Panel</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="p-1.5 text-ink-100">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-white/5 px-3 py-3">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  active ? 'bg-volt-500/15 text-volt-400' : 'text-ink-500'
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400/80"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
