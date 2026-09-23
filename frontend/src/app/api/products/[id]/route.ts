import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { normalizeImages, prisma, uniqueSlug, type IncomingImage } from '@aurelia/backend';
import { deleteUnusedCloudinaryImages } from '@aurelia/backend/cloudinary';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] },
    },
  });

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.title?.trim() && body.title.trim() !== current.title) {
    const taken = (await prisma.product.findMany({ where: { NOT: { id } }, select: { slug: true } }))
      .map((p) => p.slug);
    data.title = body.title.trim();
    data.slug = uniqueSlug(body.title, taken);
  }

  if (body.description !== undefined) data.description = String(body.description).trim();
  if (body.material !== undefined) data.material = body.material?.trim() || null;
  if (body.sku !== undefined) data.sku = body.sku?.trim() || null;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;
  if (body.isPopular !== undefined) data.isPopular = Boolean(body.isPopular);
  if (body.isNewArrival !== undefined) data.isNewArrival = Boolean(body.isNewArrival);
  if (body.isFreeDelivery !== undefined) data.isFreeDelivery = Boolean(body.isFreeDelivery);
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0)
      return NextResponse.json({ error: 'Enter a valid price' }, { status: 400 });
    data.price = price;
  }

  if (body.comparePrice !== undefined)
    data.comparePrice = Number(body.comparePrice) > 0 ? Number(body.comparePrice) : null;

  if (body.stock !== undefined) {
    const stock = Math.max(0, Math.floor(Number(body.stock) || 0));
    data.stock = stock;
    data.inStock = body.inStock === undefined ? stock > 0 : Boolean(body.inStock) && stock > 0;
  } else if (body.inStock !== undefined) {
    data.inStock = Boolean(body.inStock);
  }

  const removedImageUrls = Array.isArray(body.removedImageUrls)
    ? (body.removedImageUrls as string[])
    : [];
  let previousUrls: string[] = [];

  // Images are replaced wholesale so ordering and the primary flag stay consistent.
  if (Array.isArray(body.images)) {
    previousUrls = (
      await prisma.productImage.findMany({ where: { productId: id }, select: { url: true } })
    ).map((image) => image.url);
    await prisma.productImage.deleteMany({ where: { productId: id } });
    const title = (data.title as string) ?? current.title;
    data.images = { create: normalizeImages(body.images as IncomingImage[], title) };
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { images: true, category: true },
  });

  if (Array.isArray(body.images)) {
    const kept = new Set((body.images as IncomingImage[]).map((image) => image.url));
    const dropped = [...previousUrls, ...removedImageUrls].filter((url) => !kept.has(url));
    await deleteUnusedCloudinaryImages(dropped);
  }

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: { select: { url: true } } },
  });
  if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  await prisma.product.delete({ where: { id } });
  await deleteUnusedCloudinaryImages(existing.images.map((image) => image.url));
  return NextResponse.json({ ok: true });
}
