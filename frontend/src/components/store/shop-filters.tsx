'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import type { CategoryDTO } from '@aurelia/backend/shared';
import { cn, formatPrice } from '@/lib/utils';

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function ShopFilters({
  categories,
  bounds,
  resultCount,
}: {
  categories: CategoryDTO[];
  bounds: { min: number; max: number };
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCategory = searchParams.get('category') ?? '';
  const activeSort = searchParams.get('sort') ?? 'newest';
  const queryParam = searchParams.get('q') ?? '';
  const maxParam = Number(searchParams.get('max') ?? bounds.max);

  const [term, setTerm] = useState(queryParam);
  const [maxPrice, setMaxPrice] = useState(Number.isFinite(maxParam) ? maxParam : bounds.max);

  useEffect(() => setTerm(queryParam), [queryParam]);
  useEffect(() => setMaxPrice(Number.isFinite(maxParam) ? maxParam : bounds.max), [maxParam, bounds.max]);

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [pathname, router, searchParams],
  );

  // Live title search: debounce so each keystroke does not hit the database.
  useEffect(() => {
    if (term === queryParam) return;
    const timer = setTimeout(() => {
      pushParams((params) => {
        if (term.trim()) params.set('q', term.trim());
        else params.delete('q');
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [term, queryParam, pushParams]);

  const hasFilters = Boolean(
    activeCategory || queryParam || searchParams.get('max') || searchParams.get('sort'),
  );

  const panel = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Search</p>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by title…"
            className="input pl-10"
          />
          {term ? (
            <button
              type="button"
              onClick={() => setTerm('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-900"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="space-y-1">
          <FilterButton
            active={!activeCategory}
            onClick={() => pushParams((p) => p.delete('category'))}
          >
            All jewellery
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category.id}
              active={activeCategory === category.slug}
              onClick={() =>
                pushParams((p) => {
                  if (activeCategory === category.slug) p.delete('category');
                  else p.set('category', category.slug);
                })
              }
            >
              <span>{category.name}</span>
              <span className="text-xs text-charcoal-400">{category.productCount}</span>
            </FilterButton>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Max price</p>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          onMouseUp={() => pushParams((p) => p.set('max', String(maxPrice)))}
          onTouchEnd={() => pushParams((p) => p.set('max', String(maxPrice)))}
          onKeyUp={() => pushParams((p) => p.set('max', String(maxPrice)))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-sand accent-gold-400"
        />
        <div className="mt-2 flex justify-between text-xs text-charcoal-400">
          <span>{formatPrice(bounds.min)}</span>
          <span className="font-medium text-charcoal-900">up to {formatPrice(maxPrice)}</span>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Sort by</p>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <FilterButton
              key={option.value}
              active={activeSort === option.value}
              onClick={() => pushParams((p) => p.set('sort', option.value))}
            >
              {option.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
          className="btn-outline w-full py-2.5"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <p className="text-sm text-charcoal-400">
          {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
        </p>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn-outline px-5 py-2.5 text-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter &amp; sort
        </button>
      </div>

      <aside
        className={cn(
          'hidden w-64 shrink-0 lg:block',
          isPending && 'pointer-events-none opacity-60 transition-opacity',
        )}
      >
        <div className="sticky top-28">{panel}</div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[80] bg-charcoal-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[90] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-2xl">Filter &amp; sort</h2>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {panel}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="btn-primary mt-6 w-full"
              >
                Show {resultCount} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
        active
          ? 'bg-charcoal-900 text-cream'
          : 'text-charcoal-600 hover:bg-ivory hover:text-charcoal-900',
      )}
    >
      {children}
    </button>
  );
}
