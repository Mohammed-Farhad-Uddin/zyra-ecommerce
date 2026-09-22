import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { prisma, uniqueSlug } from '@aurelia/backend';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { name, description, imageUrl, position } = await request.json();

  if (!name?.trim())
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });

  const existing = await prisma.category.findFirst({ where: { name: name.trim() } });
  if (existing)
    return NextResponse.json({ error: 'A category with that name already exists' }, { status: 409 });

  const taken = (await prisma.category.findMany({ select: { slug: true } })).map((c) => c.slug);

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug: uniqueSlug(name, taken),
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      position: Number(position) || 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
