import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { withDb, dbUnavailable } from '@/lib/db-guard';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  location: z.string().max(120).optional(),
  message: z.string().min(1).max(600),
  rating: z.number().int().min(1).max(5).optional(),
  isApproved: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const result = await withDb(() => prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }));
  if (!result.ok) return dbUnavailable();
  return NextResponse.json({ testimonials: result.data });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await withDb(() => prisma.testimonial.create({ data: parsed.data }));
  if (!result.ok) return dbUnavailable();
  return NextResponse.json({ testimonial: result.data }, { status: 201 });
}
