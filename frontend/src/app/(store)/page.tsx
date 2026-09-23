import Link from 'next/link';
import { CategoryStrip } from '@/components/store/category-strip';
import { Hero } from '@/components/store/hero';
import { ProductCard } from '@/components/store/product-card';
import { SectionHeading } from '@/components/store/section-heading';
import { getCategories, getNewArrivals, getPopularProducts } from '@aurelia/backend';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, newArrivals, popular] = await Promise.all([
    getCategories(),
    getNewArrivals(8),
    getPopularProducts(8),
  ]);

  return (
    <>
      <Hero />

      <section className="container-luxe py-20 sm:py-24">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your everyday piece"
          description="From a single solitaire to layered chains — each collection is designed to sit together beautifully."
        />
        <CategoryStrip categories={categories} />
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Just landed"
            title="New Arrivals"
            description="The newest additions to the atelier, added this season."
            href="/shop?sort=newest"
            linkLabel="View all new pieces"
          />
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 sm:py-24">
        <SectionHeading
          eyebrow="Loved by our customers"
          title="Popular Right Now"
          description="The pieces that keep selling out — restocked and ready to ship."
          href="/shop?sort=popular"
          linkLabel="Shop bestsellers"
        />
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {popular.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal-900 py-20 text-center sm:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-rose-300/10 blur-3xl" />
        <div className="container-luxe relative">
          <p className="eyebrow">Made to last</p>
          <h2 className="heading-display mx-auto mt-4 max-w-2xl text-balance text-4xl text-cream sm:text-5xl">
            Pay in cash when it arrives at your door
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-cream/60">
            No cards, no online payment. Delivery is ৳60 inside Dhaka and ৳120 outside, and you
            pay the courier on arrival.
          </p>
          <Link href="/shop" className="btn-gold mt-9">
            Start shopping
          </Link>
        </div>
      </section>
    </>
  );
}
