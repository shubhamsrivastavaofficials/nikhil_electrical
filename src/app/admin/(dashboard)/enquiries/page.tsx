'use client';

import { useEffect, useState } from 'react';
import { Phone, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
};

const STATUS_STYLES: Record<Enquiry['status'], string> = {
  NEW: 'bg-safety-amber/10 text-safety-amber',
  CONTACTED: 'bg-volt-500/10 text-volt-400',
  CLOSED: 'bg-ink-700/20 text-ink-500',
};

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | Enquiry['status']>('ALL');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/enquiries');
    const data = await res.json();
    setItems(data.enquiries || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Enquiry['status']) {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error('Failed to update status.');
      load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this enquiry?')) return;
    const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      load();
    } else {
      toast.error('Failed to delete.');
    }
  }

  const filtered = filter === 'ALL' ? items : items.filter((e) => e.status === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-100">Customer Enquiries</h1>
      <p className="mt-1 text-sm text-ink-500">Messages submitted through the website contact form.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['ALL', 'NEW', 'CONTACTED', 'CLOSED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-medium',
              filter === s ? 'bg-volt-500 text-white' : 'bg-base-800 text-ink-500'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-sm text-ink-700">No enquiries in this view.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((e) => (
            <div key={e.id} className="rounded-xl border border-white/5 bg-base-800 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink-100">{e.name}</p>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-medium', STATUS_STYLES[e.status])}>
                      {e.status}
                    </span>
                  </div>
                  <a href={`tel:${e.phone}`} className="mt-1 flex items-center gap-1.5 text-sm text-volt-400">
                    <Phone className="h-3.5 w-3.5" /> {e.phone}
                  </a>
                  {e.message && <p className="mt-2 text-sm text-ink-500">{e.message}</p>}
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-700">
                    <Clock className="h-3 w-3" /> {new Date(e.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e.id, ev.target.value as Enquiry['status'])}
                    className="rounded-lg border border-white/10 bg-base-900 px-2.5 py-1.5 text-xs text-ink-100"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="rounded-lg bg-white/5 p-2 text-ink-300 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
