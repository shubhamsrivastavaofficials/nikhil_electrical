'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return;
    }
    setUploading(true);
    try {
      // 1. Try uploading to /api/upload (Vercel Blob / Local storage)
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (res.ok && data.url) {
        onChange(data.url);
        setUploading(false);
        toast.success('Image uploaded successfully');
        return;
      }

      // 2. Fallback: Client-side compression & Base64 Data URL if upload endpoint fails (e.g. Blob token missing)
      console.warn('API upload failed, falling back to client-side compression:', data.error || text);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          onChange(dataUrl);
          setUploading(false);
          toast.success('Image processed successfully');
        };
        img.onerror = () => {
          setUploading(false);
          toast.error('Failed to process image.');
        };
      };
      reader.onerror = () => {
        setUploading(false);
        toast.error('Failed to read file.');
      };
    } catch (err: any) {
      console.error('Image handling error:', err);
      setUploading(false);
      toast.error('Image upload failed. Try pasting an image URL.');
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-500">Image</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/15 bg-base-900 hover:border-volt-500"
      >
        {value ? (
          <Image src={value} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-ink-700">
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
            <span className="text-xs">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="mt-2 flex items-center justify-between text-[11px] text-ink-700">
        <span className="flex items-center gap-1.5"><ImageIcon className="h-3 w-3" /> JPG, PNG, WEBP</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-red-400 hover:underline"
          >
            Remove image
          </button>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <label className="mb-1.5 block text-xs font-medium text-ink-500">Or Paste Direct Image URL</label>
        <input
          type="text"
          placeholder="https://images.unsplash.com/..."
          value={value.startsWith('data:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-base-900 px-3 py-2 text-xs text-ink-100 outline-none focus:border-volt-500"
        />
        <p className="mt-1 text-[10px] text-ink-600">Use this if image upload fails.</p>
      </div>
    </div>
  );
}
