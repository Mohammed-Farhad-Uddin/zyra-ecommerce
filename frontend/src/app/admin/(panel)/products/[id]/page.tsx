import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { getCategories, prisma } from '@aurelia/backend';
import type { ProductDTO } from '@aurelia/backend/shared';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] },
      },
    }),
    getCategories(),
  ]);

  if (!product) notFound();

  const dto: ProductDTO = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    isFreeDelivery: Boolean(product.isFreeDelivery),
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      isPrimary: image.isPrimary,
      position: image.position,
    })),
  };

  return <ProductForm categories={categories} product={dto} />;
}
