import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { withDb, dbUnavailable, isNotFoundError } from '@/lib/db-guard';

const updateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'CLOSED']),
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

  const result = await withDb(() => prisma.enquiry.update({ where: { id }, data: parsed.data }));
  if (!result.ok) {
    return isNotFoundError(result.error)
      ? NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 })
      : dbUnavailable();
  }
  return NextResponse.json({ enquiry: result.data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const result = await withDb(() => prisma.enquiry.delete({ where: { id } }));
  if (!result.ok) {
    return isNotFoundError(result.error)
      ? NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 })
      : dbUnavailable();
  }
  return NextResponse.json({ success: true });
}
