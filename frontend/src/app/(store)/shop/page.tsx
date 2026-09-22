import { Search } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ProductCard } from '@/components/store/product-card';
import { ShopFilters } from '@/components/store/shop-filters';
import { getCategories, getPriceBounds, getProducts, type ProductFilters } from '@aurelia/backend';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop all jewellery',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const category = first(params.category);
  const q = first(params.q);
  const max = Number(first(params.max));
  const sort = first(params.sort) as ProductFilters['sort'];

  const [categories, bounds] = await Promise.all([getCategories(), getPriceBounds()]);
  const products = await getProducts({
    category,
    q,
    max: Number.isFinite(max) && max > 0 ? max : undefined,
    sort: sort ?? 'newest',
  });

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <>
      <section className="border-b border-sand bg-ivory py-14">
        <div className="container-luxe text-center">
          <p className="eyebrow">{activeCategory ? 'Collection' : 'The full collection'}</p>
          <h1 className="heading-display mt-3 text-4xl sm:text-5xl">
            {activeCategory ? activeCategory.name : 'All Jewellery'}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-charcoal-400">
            {activeCategory?.description ??
              'Every piece is hand-finished in small batches using recycled gold and responsibly sourced stones.'}
          </p>
        </div>
      </section>

      <div className="container-luxe flex gap-12 py-12">
        <Suspense fallback={<div className="hidden w-64 shrink-0 lg:block" />}>
          <ShopFilters categories={categories} bounds={bounds} resultCount={products.length} />
        </Suspense>

        <div className="min-w-0 flex-1">
          <div className="mb-8 hidden items-center justify-between lg:flex">
            <p className="text-sm text-charcoal-400">
              Showing <span className="text-charcoal-900">{products.length}</span>{' '}
              {products.length === 1 ? 'piece' : 'pieces'}
              {q ? ` for “${q}”` : ''}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sand bg-white/60 py-24 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory">
                <Search className="h-6 w-6 text-gold-400" />
              </span>
              <h2 className="mt-5 font-serif text-2xl text-charcoal-900">Nothing matches yet</h2>
              <p className="mt-2 max-w-sm text-sm text-charcoal-400">
                Try a different search term, widen the price range, or browse the full collection.
              </p>
              <Link href="/shop" className="btn-primary mt-6">
                View all jewellery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
