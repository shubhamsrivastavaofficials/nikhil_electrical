import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { imagePathSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';

const createSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(60).default('Workshop'),
  imageUrl: imagePathSchema,
  altText: z.string().min(1).max(160),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const image = await prisma.galleryImage.create({ data: parsed.data });
  return NextResponse.json({ image }, { status: 201 });
}
