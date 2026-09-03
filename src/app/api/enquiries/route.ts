import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { withDb, dbUnavailable } from '@/lib/db-guard';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
  message: z.string().max(1000).optional().default(''),
  source: z.string().max(40).optional(),
});

// Simple in-memory rate limiter to deter spam submissions
const submissions = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = submissions.get(key);
  if (!entry || now > entry.resetAt) {
    submissions.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_SUBMISSIONS;
}

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const result = await withDb(() => prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } }));
  if (!result.ok) return dbUnavailable();
  return NextResponse.json({ enquiries: result.data });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many submissions. Please call us directly.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await withDb(() => prisma.enquiry.create({ data: parsed.data }));
  if (!result.ok) return dbUnavailable();
  return NextResponse.json({ enquiry: result.data }, { status: 201 });
}
