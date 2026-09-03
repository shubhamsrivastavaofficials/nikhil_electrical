import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { imagePathSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';
import { withDb, dbUnavailable } from '@/lib/db-guard';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(60),
  description: z.string().min(1).max(600),
  priceNote: z.string().max(120).optional(),
  imageUrl: imagePathSchema.optional().or(z.literal('')),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const result = await withDb(() => prisma.product.findMany({ orderBy: { sortOrder: 'asc' } }));
  if (!result.ok) return dbUnavailable();
  return NextResponse.json({ products: result.data });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { imageUrl, ...rest } = parsed.data;
  const slug = slugify(rest.name);

  const result = await withDb(() =>
    prisma.product.create({ data: { ...rest, imageUrl: imageUrl || null, slug } })
  );
  if (!result.ok) return dbUnavailable();
  return NextResponse.json({ product: result.data }, { status: 201 });
}
