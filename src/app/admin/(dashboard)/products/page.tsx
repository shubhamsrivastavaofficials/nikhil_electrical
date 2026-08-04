'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, PackageX } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/admin/Modal';
import ImageUploader from '@/components/admin/ImageUploader';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  priceNote: string;
  imageUrl: string | null;
  inStock: boolean;
};

const CATEGORIES = ['Wires', 'Switches', 'MCB', 'LED Lights', 'Fans', 'Accessories'];
const EMPTY = {
  name: '',
  category: 'Wires',
  description: '',
  priceNote: 'Call for wholesale price',
  imageUrl: '',
  inStock: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products || []);
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

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ ...p, imageUrl: p.imageUrl || '' });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.description) {
      toast.error('Name and description are required.');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/products/${editing.id}` : '/api/products';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? 'Product updated' : 'Product added');
      setOpen(false);
      load();
    } catch {
      toast.error('Failed to save product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
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
          <h1 className="font-display text-2xl font-semibold text-ink-100">Products</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the wholesale product catalogue.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-volt-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-white/5 bg-base-800">
              <div className="relative aspect-video w-full bg-base-700">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-700">
                    <PackageX className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-copper-500">{p.category}</p>
                <p className="mt-1 font-medium text-ink-100">{p.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-500">{p.description}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-volt-400"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-ink-300 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        <div className="space-y-4">
          <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Price Note</label>
            <input
              value={form.priceNote}
              onChange={(e) => setForm({ ...form, priceNote: e.target.value })}
              placeholder="Call for wholesale price"
              className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-base-900"
            />
            In stock
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-volt-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
