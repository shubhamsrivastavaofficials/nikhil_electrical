import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  location: z.string().max(120).optional(),
  message: z.string().min(1).max(600),
  rating: z.number().int().min(1).max(5).optional(),
  isApproved: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json({ testimonial }, { status: 201 });
}
