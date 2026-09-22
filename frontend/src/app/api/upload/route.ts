import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const formData = await request.formData();
  const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);

  if (files.length === 0)
    return NextResponse.json({ error: 'No files were uploaded' }, { status: 400 });

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED.includes(file.type))
      return NextResponse.json(
        { error: `${file.name}: only JPG, PNG, WebP, AVIF or GIF images are allowed` },
        { status: 400 },
      );

    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: `${file.name} is larger than 6 MB` }, { status: 400 });

    const extension = path.extname(file.name).toLowerCase() || '.jpg';
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/${filename}`);
  }

  return NextResponse.json({ urls }, { status: 201 });
}
