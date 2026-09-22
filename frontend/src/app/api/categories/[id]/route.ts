import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { prisma, uniqueSlug } from '@aurelia/backend';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const { name, description, imageUrl, position } = await request.json();

  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

  const data: Record<string, unknown> = {
    description: description?.trim() || null,
    imageUrl: imageUrl?.trim() || null,
  };

  if (position !== undefined) data.position = Number(position) || 0;

  if (name?.trim() && name.trim() !== current.name) {
    const clash = await prisma.category.findFirst({
      where: { name: name.trim(), NOT: { id } },
    });
    if (clash)
      return NextResponse.json({ error: 'Another category already uses that name' }, { status: 409 });

    const taken = (await prisma.category.findMany({ where: { NOT: { id } }, select: { slug: true } }))
      .map((c) => c.slug);
    data.name = name.trim();
    data.slug = uniqueSlug(name, taken);
  }

  const category = await prisma.category.update({ where: { id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const count = await prisma.product.count({ where: { categoryId: id } });

  if (count > 0)
    return NextResponse.json(
      { error: `Move or delete the ${count} product(s) in this category first` },
      { status: 409 },
    );

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
}
