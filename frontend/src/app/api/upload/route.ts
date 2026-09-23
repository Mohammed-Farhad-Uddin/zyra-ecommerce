import { NextResponse } from 'next/server';
import { createUploadSignature } from '@aurelia/backend/cloudinary';
import { requireAdmin } from '@/lib/api-auth';

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    return NextResponse.json(createUploadSignature());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cloudinary is not configured';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
