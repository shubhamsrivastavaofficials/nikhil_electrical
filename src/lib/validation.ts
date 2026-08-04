import { z } from 'zod';

// Accepts either an absolute URL (production: Vercel Blob / Supabase) or a
// relative path like "/uploads/xyz.jpg" (local dev fallback storage).
export const imagePathSchema = z
  .string()
  .min(1)
  .refine((val) => /^https?:\/\//.test(val) || val.startsWith('/'), {
    message: 'Must be a valid URL or a path starting with /',
  });
