import { Check, ChevronRight, Gem, RotateCcw, Truck, X } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/store/add-to-cart';
import { ProductCard } from '@/components/store/product-card';
import { ProductGallery } from '@/components/store/product-gallery';
import { SectionHeading } from '@/components/store/section-heading';
import { getProductBySlug, getRelatedProducts } from '@aurelia/backend';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };
  return {
    title: product.title,
    description: product.description.slice(0, 155),
  };
}

const perks = [
  { icon: Truck, label: 'Free delivery', detail: '2–4 business days' },
  { icon: RotateCcw, label: '14-day returns', detail: 'Unworn, in original box' },
  { icon: Gem, label: 'Lifetime care', detail: 'Free cleaning & polishing' },
];

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const available = product.inStock && product.stock > 0;
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  return (
    <>
      <nav className="container-luxe flex items-center gap-1.5 py-6 text-xs text-charcoal-400">
        <Link href="/" className="transition hover:text-charcoal-900">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="transition hover:text-charcoal-900">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="transition hover:text-charcoal-900"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-charcoal-900">{product.title}</span>
      </nav>

      <section className="container-luxe grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} title={product.title} />

        <div className="lg:py-4">
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="eyebrow transition hover:text-gold-600"
          >
            {product.category.name}
          </Link>

          <h1 className="heading-display mt-3 text-4xl sm:text-5xl">{product.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-serif text-3xl text-charcoal-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price ? (
              <>
                <span className="text-base text-charcoal-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-medium text-rose-600">
                  Save {discount}%
                </span>
              </>
            ) : null}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            {available ? (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-700" strokeWidth={3} />
                </span>
                <span className="text-charcoal-600">In stock · ready to ship</span>
              </>
            ) : (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100">
                  <X className="h-3 w-3 text-rose-600" strokeWidth={3} />
                </span>
                <span className="text-charcoal-600">Currently sold out</span>
              </>
            )}
          </div>

          <div className="my-7 hairline" />

          <p className="whitespace-pre-line text-[15px] leading-relaxed text-charcoal-400">
            {product.description}
          </p>

          {product.material ? (
            <dl className="mt-6 grid gap-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-charcoal-400">Material</dt>
                <dd className="text-charcoal-800">{product.material}</dd>
              </div>
              {product.sku ? (
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-charcoal-400">SKU</dt>
                  <dd className="text-charcoal-800">{product.sku}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="my-7 hairline" />

          <AddToCart product={product} />

          <div className="mt-8 grid gap-4 rounded-2xl border border-sand bg-ivory/60 p-5 sm:grid-cols-3">
            {perks.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <div>
                  <p className="text-xs font-medium text-charcoal-900">{label}</p>
                  <p className="text-[11px] leading-tight text-charcoal-400">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-sand bg-ivory py-20">
          <div className="container-luxe">
            <SectionHeading
              eyebrow="You may also like"
              title="Complete the look"
              href={`/shop?category=${product.category.slug}`}
              linkLabel={`Shop all ${product.category.name.toLowerCase()}`}
            />
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
