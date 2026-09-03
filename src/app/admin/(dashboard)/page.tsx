import Link from 'next/link';
import { Inbox, Images, Wrench, PackageSearch, MessageSquareQuote, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { withDb } from '@/lib/db-guard';
import StatCard from '@/components/admin/StatCard';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const stats = await withDb(() =>
    Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.galleryImage.count(),
      prisma.service.count(),
      prisma.product.count(),
      prisma.testimonial.count(),
      prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ])
  );

  if (!stats.ok) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-100">Overview</h1>
        <p className="mt-1 text-sm text-ink-500">Welcome back — here&apos;s what&apos;s happening.</p>
        <div className="mt-7 rounded-2xl border border-safety-amber/25 bg-safety-amber/10 p-6">
          <p className="font-medium text-safety-amber">Database temporarily unavailable.</p>
          <p className="mt-1 text-sm text-ink-500">
            Couldn&apos;t load your dashboard stats. Refresh in a moment and it should recover.
          </p>
        </div>
      </div>
    );
  }

  const [enquiryCount, newEnquiryCount, galleryCount, serviceCount, productCount, testimonialCount, recentEnquiries] =
    stats.data;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-100">Overview</h1>
      <p className="mt-1 text-sm text-ink-500">Welcome back — here&apos;s what&apos;s happening.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Inbox} label="New Enquiries" value={newEnquiryCount} accent="amber" />
        <StatCard icon={Inbox} label="Total Enquiries" value={enquiryCount} />
        <StatCard icon={Images} label="Gallery Images" value={galleryCount} accent="copper" />
        <StatCard icon={Wrench} label="Services" value={serviceCount} />
        <StatCard icon={PackageSearch} label="Products" value={productCount} accent="copper" />
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-base-800">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="font-display text-base font-semibold text-ink-100">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-xs font-medium text-volt-400">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentEnquiries.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink-700">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentEnquiries.map((e) => (
              <li key={e.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-ink-100">{e.name}</p>
                  <p className="text-xs text-ink-500">{e.phone}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                    e.status === 'NEW'
                      ? 'bg-safety-amber/10 text-safety-amber'
                      : e.status === 'CONTACTED'
                      ? 'bg-volt-500/10 text-volt-400'
                      : 'bg-ink-700/20 text-ink-500'
                  }`}
                >
                  {e.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-base-800 p-6">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-copper-500" />
          <p className="text-sm text-ink-500">{testimonialCount} testimonials currently on site.</p>
        </div>
      </div>
    </div>
  );
}
