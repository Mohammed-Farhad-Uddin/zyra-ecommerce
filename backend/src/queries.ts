import { prisma } from './prisma';
import type { CategoryDTO, ProductDTO } from './shared';
import type { Prisma } from '@prisma/client';

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] },
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toProductDTO(product: ProductRow): ProductDTO {
  return {
    ...product,
    createdAt: product.createdAt.toISOString(),
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      isPrimary: image.isPrimary,
      position: image.position,
    })),
  };
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { products: true } } },
  });

  return categories.map(({ _count, createdAt, updatedAt, ...rest }) => ({
    ...rest,
    productCount: _count.products,
  }));
}

export async function getNewArrivals(limit = 8): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNewArrival: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // Fall back to the most recent products so the section is never empty.
  if (products.length >= 4) return products.map(toProductDTO);

  const latest = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return latest.map(toProductDTO);
}

export async function getPopularProducts(limit = 8): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isPopular: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return products.map(toProductDTO);
}

export type ProductFilters = {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
};

export async function getProducts(filters: ProductFilters = {}): Promise<ProductDTO[]> {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.category) where.category = { slug: filters.category };
  if (filters.q) where.title = { contains: filters.q, mode: 'insensitive' };
  if (filters.min !== undefined || filters.max !== undefined) {
    where.price = {
      ...(filters.min !== undefined ? { gte: filters.min } : {}),
      ...(filters.max !== undefined ? { lte: filters.max } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === 'price-asc'
      ? { price: 'asc' }
      : filters.sort === 'price-desc'
        ? { price: 'desc' }
        : filters.sort === 'popular'
          ? { isPopular: 'desc' }
          : { createdAt: 'desc' };

  const products = await prisma.product.findMany({ where, include: productInclude, orderBy });
  return products.map(toProductDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const product = await prisma.product.findUnique({ where: { slug }, include: productInclude });
  return product ? toProductDTO(product) : null;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, isActive: true, NOT: { id: excludeId } },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return products.map(toProductDTO);
}

export async function getPriceBounds() {
  const [min, max] = await Promise.all([
    prisma.product.aggregate({ _min: { price: true }, where: { isActive: true } }),
    prisma.product.aggregate({ _max: { price: true }, where: { isActive: true } }),
  ]);
  return {
    min: Math.floor(min._min.price ?? 0),
    max: Math.ceil(max._max.price ?? 1000),
  };
}
