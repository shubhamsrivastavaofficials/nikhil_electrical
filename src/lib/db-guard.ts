import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export function dbUnavailable() {
  return NextResponse.json(
    { error: 'Database temporarily unavailable. Please try again in a moment.' },
    { status: 503 }
  );
}

export async function withDb<T>(
  fn: () => Promise<T>
): Promise<{ ok: true; data: T } | { ok: false; data: null; error: unknown }> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    return { ok: false, data: null, error };
  }
}

export function isNotFoundError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}
