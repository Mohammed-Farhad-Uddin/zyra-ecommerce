import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { normalizeImages, prisma, uniqueSlug, type IncomingImage } from '@aurelia/backend';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q');

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}),
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const {
    title,
    description,
    price,
    comparePrice,
    material,
    sku,
    categoryId,
    stock,
    isPopular,
    isNewArrival,
    isActive,
  } = body;

  const images = (body.images ?? []) as IncomingImage[];

  if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!description?.trim())
    return NextResponse.json({ error: 'Description is required' }, { status: 400 });
  if (!categoryId) return NextResponse.json({ error: 'Select a category' }, { status: 400 });

  const parsedPrice = Number(price);
  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0)
    return NextResponse.json({ error: 'Enter a valid price' }, { status: 400 });

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 400 });

  const taken = (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug);
  const parsedStock = Math.max(0, Math.floor(Number(stock) || 0));

  const product = await prisma.product.create({
    data: {
      title: title.trim(),
      slug: uniqueSlug(title, taken),
      description: description.trim(),
      price: parsedPrice,
      comparePrice: Number(comparePrice) > 0 ? Number(comparePrice) : null,
      material: material?.trim() || null,
      sku: sku?.trim() || null,
      categoryId,
      stock: parsedStock,
      inStock: parsedStock > 0,
      isPopular: Boolean(isPopular),
      isNewArrival: Boolean(isNewArrival),
      isActive: isActive === undefined ? true : Boolean(isActive),
      images: {
        create: normalizeImages(images, title.trim()),
      },
    },
    include: { images: true, category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
