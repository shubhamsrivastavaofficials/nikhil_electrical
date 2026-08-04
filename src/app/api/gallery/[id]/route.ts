import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { imagePathSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';

const updateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  category: z.string().min(1).max(60).optional(),
  imageUrl: imagePathSchema.optional(),
  altText: z.string().min(1).max(160).optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const image = await prisma.galleryImage.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ image });
  } catch {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }
}
