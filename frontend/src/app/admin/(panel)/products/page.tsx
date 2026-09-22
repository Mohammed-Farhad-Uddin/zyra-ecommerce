import { Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/smart-image';
import { prisma } from '@aurelia/backend';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { take: 1, orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl sm:text-4xl">Products</h1>
          <p className="mt-1.5 text-sm text-charcoal-400">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'} in the catalogue
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary px-6 py-2.5">
          <Plus className="h-4 w-4" />
          New product
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory">
            <Package className="h-6 w-6 text-gold-400" />
          </span>
          <h2 className="mt-5 font-serif text-2xl text-charcoal-900">No products yet</h2>
          <p className="mt-2 max-w-sm text-sm text-charcoal-400">
            Add your first piece and it will appear on the storefront straight away.
          </p>
          <Link href="/admin/products/new" className="btn-primary mt-6">
            Add a product
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,2.4fr)_1fr_1fr_1fr_auto] gap-4 border-b border-sand bg-ivory/70 px-5 py-3 text-[11px] uppercase tracking-wider text-charcoal-400 lg:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Flags</span>
          </div>

          <div className="divide-y divide-sand">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="grid grid-cols-1 gap-3 px-5 py-4 transition hover:bg-ivory/60 lg:grid-cols-[minmax(0,2.4fr)_1fr_1fr_1fr_auto] lg:items-center lg:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-ivory">
                    <SmartImage
                      src={product.images[0]?.url}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-charcoal-900">
                      {product.title}
                    </p>
                    <p className="truncate text-xs text-charcoal-400">/{product.slug}</p>
                  </div>
                </div>

                <span className="text-sm text-charcoal-600">{product.category.name}</span>

                <span className="text-sm text-charcoal-800">{formatPrice(product.price)}</span>

                <span
                  className={
                    product.stock === 0
                      ? 'text-sm text-rose-500'
                      : product.stock <= 5
                        ? 'text-sm text-gold-600'
                        : 'text-sm text-charcoal-600'
                  }
                >
                  {product.stock === 0 ? 'Sold out' : `${product.stock} in stock`}
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {product.isPopular ? <Flag>Popular</Flag> : null}
                  {product.isNewArrival ? <Flag>New</Flag> : null}
                  {!product.isActive ? <Flag muted>Hidden</Flag> : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Flag({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={
        muted
          ? 'rounded-full bg-charcoal-900/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-charcoal-400'
          : 'rounded-full bg-gold-100 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gold-600'
      }
    >
      {children}
    </span>
  );
}
