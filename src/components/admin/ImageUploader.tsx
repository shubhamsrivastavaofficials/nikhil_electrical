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
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size must be less than 3MB.');
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Url = reader.result as string;
        onChange(base64Url);
        setUploading(false);
        toast.success('Image loaded successfully');
      };
      reader.onerror = () => {
        setUploading(false);
        toast.error('Failed to read image file.');
      };
    } catch (err) {
      setUploading(false);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
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
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-700">
        <ImageIcon className="h-3 w-3" /> JPG, PNG, WEBP up to 8MB
      </div>
    </div>
  );
}
