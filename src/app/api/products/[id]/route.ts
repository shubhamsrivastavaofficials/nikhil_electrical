import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { imagePathSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';
import { withDb, dbUnavailable, isNotFoundError } from '@/lib/db-guard';

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  category: z.string().min(1).max(60).optional(),
  description: z.string().min(1).max(600).optional(),
  priceNote: z.string().max(120).optional(),
  imageUrl: imagePathSchema.optional().or(z.literal('')),
  inStock: z.boolean().optional(),
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

  const { imageUrl, name, ...rest } = parsed.data;
  const result = await withDb(() =>
    prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(name ? { name, slug: slugify(name) } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
      },
    })
  );
  if (!result.ok) {
    return isNotFoundError(result.error)
      ? NextResponse.json({ error: 'Product not found.' }, { status: 404 })
      : dbUnavailable();
  }
  return NextResponse.json({ product: result.data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const result = await withDb(() => prisma.product.delete({ where: { id } }));
  if (!result.ok) {
    return isNotFoundError(result.error)
      ? NextResponse.json({ error: 'Product not found.' }, { status: 404 })
      : dbUnavailable();
  }
  return NextResponse.json({ success: true });
}
