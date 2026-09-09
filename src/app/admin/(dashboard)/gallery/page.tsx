'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Star, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/admin/Modal';
import ImageUploader from '@/components/admin/ImageUploader';

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
      const res = await fetch('/api/gallery');
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { images: [] };
      }
      if (!res.ok) throw new Error(data.error || 'Failed to load');
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
      toast.error('Title and image URL are required.');
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
        data = { error: `Server error: ${text.substring(0, 100)}` };
      }

      if (!res.ok) throw new Error(data.error || 'Failed to save image.');
      toast.success(editing ? 'Image updated successfully!' : 'Image added successfully!');
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
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Image deleted');
        load();
      } else {
        toast.error('Failed to delete image.');
      }
    } catch {
      toast.error('Failed to delete image.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-100">Gallery Management</h1>
          <p className="mt-1 text-sm text-ink-500">Manage photos shown on the website gallery (Direct URL & Upload supported).</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-volt-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-volt-600 transition"
        >
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Loading gallery...</p>
      ) : images.length === 0 ? (
        <p className="mt-8 text-sm text-ink-700">No images yet. Click "Add Image" to get started.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-xl border border-white/5 bg-base-800 shadow-md">
              <div className="relative aspect-square w-full bg-base-900">
                <Image src={img.imageUrl} alt={img.altText || img.title} fill className="object-cover" />
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
                    className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-volt-400 transition"
                  >
                    <Pencil className="mx-auto h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-red-400 transition"
                  >
                    <Trash2 className="mx-auto h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Gallery Image' : 'Add Gallery Image'}>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          {/* Direct URL input prominently placed at the top */}
          <div className="rounded-xl border-2 border-volt-500/40 bg-volt-500/10 p-4">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-volt-400 mb-1.5">
              <LinkIcon className="h-4 w-4" /> Direct Image URL (Recommended & Reliable)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/... or any image link"
              value={form.imageUrl || ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-base-900 px-4 py-3 text-sm text-white outline-none focus:border-volt-500 focus:ring-1 focus:ring-volt-500"
            />
            <p className="mt-1.5 text-[11px] text-ink-400">
              Paste any direct image link here (Unsplash, Imgur, etc.). Bypasses Vercel Blob storage requirements completely.
            </p>
          </div>

          {/* Optional File Uploader */}
          <div className="border-t border-white/10 pt-4">
            <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          </div>

          <div className="border-t border-white/10 pt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-300">Image Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Workshop Motor Rewinding"
                className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-300">Category</label>
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
            <label className="flex items-center gap-2 text-sm text-ink-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-base-900 text-volt-500 focus:ring-volt-500"
              />
              Display as Featured Image on homepage/gallery
            </label>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-lg bg-volt-500 py-3 text-sm font-semibold text-white shadow-lg hover:bg-volt-600 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Gallery Image'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
