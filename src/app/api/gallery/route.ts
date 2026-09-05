import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { imagePathSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';
import { withDb, dbUnavailable } from '@/lib/db-guard';

const createSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(60).default('Workshop'),
  imageUrl: imagePathSchema,
  altText: z.string().min(1).max(160),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const result = await withDb(() => prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } }));
  if (!result.ok) return dbUnavailable();
  return NextResponse.json({ images: result.data });
}

export async function POST(req: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await withDb(() => prisma.galleryImage.create({ data: parsed.data }));
    if (!result.ok) return dbUnavailable();
    return NextResponse.json({ image: result.data }, { status: 201 });
  } catch (err: any) {
    console.error('Gallery API POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
