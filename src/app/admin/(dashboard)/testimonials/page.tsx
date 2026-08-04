'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/admin/Modal';

type Testimonial = {
  id: string;
  name: string;
  location: string;
  message: string;
  rating: number;
  isApproved: boolean;
};

const EMPTY = { name: '', location: 'Rae Bareli', message: '', rating: 5, isApproved: true };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/testimonials');
    const data = await res.json();
    setItems(data.testimonials || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({ ...t });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.message) {
      toast.error('Name and message are required.');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/testimonials/${editing.id}` : '/api/testimonials';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? 'Testimonial updated' : 'Testimonial added');
      setOpen(false);
      load();
    } catch {
      toast.error('Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      load();
    } else {
      toast.error('Failed to delete.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-100">Testimonials</h1>
          <p className="mt-1 text-sm text-ink-500">Manage customer reviews shown on the homepage.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-volt-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/5 bg-base-800 p-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-safety-amber text-safety-amber' : 'text-ink-700'}`}
                  />
                ))}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-ink-300">&ldquo;{t.message}&rdquo;</p>
              <p className="mt-2 text-xs font-medium text-ink-100">{t.name} · <span className="text-ink-500">{t.location}</span></p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-volt-400"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Customer Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Message</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Rating</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-volt-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Testimonial'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
