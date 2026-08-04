import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { imagePathSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';
import { slugify } from '@/lib/utils';

const updateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(600).optional(),
  icon: z.string().min(1).max(60).optional(),
  imageUrl: imagePathSchema.optional().or(z.literal('')),
  isActive: z.boolean().optional(),
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

  const { imageUrl, title, ...rest } = parsed.data;
  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...rest,
        ...(title ? { title, slug: slugify(title) } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
      },
    });
    return NextResponse.json({ service });
  } catch {
    return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
  }
}
