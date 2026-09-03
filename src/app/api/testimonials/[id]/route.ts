import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { withDb, dbUnavailable, isNotFoundError } from '@/lib/db-guard';

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  location: z.string().max(120).optional(),
  message: z.string().min(1).max(600).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isApproved: z.boolean().optional(),
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

  const result = await withDb(() => prisma.testimonial.update({ where: { id }, data: parsed.data }));
  if (!result.ok) {
    return isNotFoundError(result.error)
      ? NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 })
      : dbUnavailable();
  }
  return NextResponse.json({ testimonial: result.data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const result = await withDb(() => prisma.testimonial.delete({ where: { id } }));
  if (!result.ok) {
    return isNotFoundError(result.error)
      ? NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 })
      : dbUnavailable();
  }
  return NextResponse.json({ success: true });
}
