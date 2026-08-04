import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { imagePathSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';

const createSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  icon: z.string().min(1).max(60).default('Zap'),
  imageUrl: imagePathSchema.optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ services });
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
  const slug = slugify(rest.title);

  const service = await prisma.service.create({
    data: { ...rest, imageUrl: imageUrl || null, slug },
  });
  return NextResponse.json({ service }, { status: 201 });
}
