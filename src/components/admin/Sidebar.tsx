'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Images,
  Wrench,
  PackageSearch,
  MessageSquareQuote,
  Inbox,
  LogOut,
  Zap,
  ExternalLink,
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    window.location.href = '/admin/login';
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/5 bg-base-950 md:flex">
      <div className="flex items-center gap-2.5 border-b border-white/5 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt-500/15 text-volt-400 ring-1 ring-volt-500/30">
          <Zap className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <div>
          <p className="font-display text-sm font-semibold leading-tight text-ink-100">New Nikhil</p>
          <p className="text-[11px] text-ink-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-volt-500/15 text-volt-400 ring-1 ring-volt-500/25'
                  : 'text-ink-500 hover:bg-white/5 hover:text-ink-100'
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/5 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-white/5 hover:text-ink-100"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
