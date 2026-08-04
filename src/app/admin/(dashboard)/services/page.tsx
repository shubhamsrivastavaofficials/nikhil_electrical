'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/admin/Modal';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
};

const ICONS = ['Zap', 'CircuitBoard', 'Fan', 'Cable', 'Recycle', 'Home', 'Wrench', 'Lightbulb', 'ShieldCheck'];
const EMPTY = { title: '', description: '', icon: 'Zap', isActive: true, sortOrder: 0 };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data.services || []);
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

  function openEdit(s: Service) {
    setEditing(s);
    setForm({ ...s });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.description) {
      toast.error('Title and description are required.');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/services/${editing.id}` : '/api/services';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? 'Service updated' : 'Service added');
      setOpen(false);
      load();
    } catch {
      toast.error('Failed to save service.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(s: Service) {
    await fetch(`/api/services/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return;
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
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
          <h1 className="font-display text-2xl font-semibold text-ink-100">Services</h1>
          <p className="mt-1 text-sm text-ink-500">Manage services shown on the homepage.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-volt-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Loading...</p>
      ) : (
        <div className="mt-8 space-y-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-base-800 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink-100">{s.title}</p>
                  {!s.isActive && (
                    <span className="rounded-full bg-ink-700/30 px-2 py-0.5 text-[10px] text-ink-500">Hidden</span>
                  )}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-ink-500">{s.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => toggleActive(s)}
                  title="Toggle visible"
                  className="rounded-lg bg-white/5 p-2 text-ink-300 hover:text-volt-400"
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEdit(s)}
                  className="rounded-lg bg-white/5 p-2 text-ink-300 hover:text-volt-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="rounded-lg bg-white/5 p-2 text-ink-300 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full resize-none rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            >
              {ICONS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-volt-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
