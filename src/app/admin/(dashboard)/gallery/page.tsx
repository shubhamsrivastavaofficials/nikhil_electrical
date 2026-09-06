'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFetchJson } from '@/lib/safe-fetch';

type GalleryImage = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
  isFeatured: boolean;
  sortOrder: number;
};

const CATEGORIES = ['Workshop', 'Motor Binding', 'Wiring', 'Products', 'Store'];
const EMPTY = { title: '', category: 'Workshop', imageUrl: '', altText: '', isFeatured: false, sortOrder: 0 };

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const { ok, data } = await safeFetchJson('/api/gallery');
      if (!ok) throw new Error(data.error || 'Failed to load');
      setImages(data.images || []);
    } catch (err: any) {
      toast.error(err?.message || 'Could not load gallery images.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(img: GalleryImage) {
    setEditing(img);
    setForm({ ...img });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.imageUrl) {
      toast.error('Title and image are required.');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/gallery/${editing.id}` : '/api/gallery';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, altText: form.altText || form.title }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: `Failed to parse server response: ${text.substring(0, 100)}...` };
      }

      if (!res.ok) throw new Error(data.error || 'Failed to save image.');
      toast.success(editing ? 'Image updated' : 'Image added');
      setOpen(false);
      load();
    } catch (err: any) {
      console.error('Gallery save error:', err);
      toast.error(err.message || 'Failed to save image.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
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
          <h1 className="font-display text-2xl font-semibold text-ink-100">Gallery</h1>
          <p className="mt-1 text-sm text-ink-500">Manage photos shown on the website gallery.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-volt-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Loading...</p>
      ) : images.length === 0 ? (
        <p className="mt-8 text-sm text-ink-700">No images yet. Add your first photo.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-xl border border-white/5 bg-base-800">
              <div className="relative aspect-square w-full">
                <Image src={img.imageUrl} alt={img.altText} fill className="object-cover" />
                {img.isFeatured && (
                  <span className="absolute left-2 top-2 rounded-full bg-safety-amber/90 p-1">
                    <Star className="h-3 w-3 text-base-900" fill="currentColor" />
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-ink-100">{img.title}</p>
                <p className="text-xs text-ink-500">{img.category}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => openEdit(img)}
                    className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-volt-400"
                  >
                    <Pencil className="mx-auto h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-red-400"
                  >
                    <Trash2 className="mx-auto h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Image' : 'Add Image'}>
        <div className="space-y-4">
          <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <div className="pt-2 border-t border-white/10" style={{ display: 'block' }}>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Or Paste Direct Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl || ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
            <p className="mt-1 text-[10px] text-ink-600">Use this if image upload fails.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-base-900"
            />
            Featured image
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-volt-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Image'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
