'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CategoryDTO } from '@aurelia/backend/shared';
import { cn } from '@/lib/utils';
import { selectCount, useCart } from '@/store/cart';

export function Header({ categories }: { categories: CategoryDTO[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');

  const openCart = useCart((s) => s.openCart);
  const count = useCart(selectCount);
  const hydrated = useCart((s) => s.hydrated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = term.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
    setSearchOpen(false);
  }

  return (
    <>
      <div className="bg-charcoal-900 py-2 text-center text-[11px] uppercase tracking-luxe text-cream/80">
        Complimentary shipping &amp; cash on delivery nationwide
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-sand bg-cream/90 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-cream',
        )}
      >
        <div className="container-luxe flex h-[72px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="-ml-2 p-2 text-charcoal-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="group flex shrink-0 flex-col items-center lg:items-start">
            <span className="font-serif text-2xl font-light tracking-[0.3em] text-charcoal-900">
              Zyra
            </span>
            <span className="hidden text-[9px] uppercase tracking-[0.42em] text-gold-500 lg:block">
              Fine Jewellery
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <NavLink href="/shop" active={pathname === '/shop'}>
              All Jewellery
            </NavLink>
            {categories.slice(0, 5).map((category) => (
              <NavLink
                key={category.id}
                href={`/shop?category=${category.slug}`}
                active={pathname === `/category/${category.slug}`}
              >
                {category.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search products"
              className="rounded-full p-2.5 text-charcoal-800 transition hover:bg-ivory"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="relative rounded-full p-2.5 text-charcoal-800 transition hover:bg-ivory"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {hydrated && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden border-t border-sand bg-white"
            >
              <form onSubmit={submitSearch} className="container-luxe flex items-center gap-3 py-4">
                <Search className="h-4 w-4 shrink-0 text-charcoal-400" />
                <input
                  autoFocus
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search rings, necklaces, pearls…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-charcoal-400/60"
                />
                <button type="submit" className="btn-primary px-5 py-2 text-xs">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-charcoal-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[82%] max-w-xs flex-col bg-cream lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-sand px-6 py-5">
                <span className="font-serif text-xl tracking-[0.3em]">Zyra</span>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5 text-charcoal-800" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <p className="eyebrow mb-4">Shop</p>
                <Link href="/shop" className="block py-3 font-serif text-2xl text-charcoal-900">
                  All Jewellery
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className="flex items-center justify-between py-3 font-serif text-2xl text-charcoal-900"
                  >
                    {category.name}
                    <span className="font-sans text-xs text-charcoal-400">
                      {category.productCount}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="border-t border-sand px-6 py-5">
                <Link href="/track" className="text-sm text-charcoal-400">
                  Track an order
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative text-[13px] tracking-wide text-charcoal-600 transition-colors hover:text-charcoal-900',
        'after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-400',
        'after:transition-all after:duration-300 hover:after:w-full',
        active && 'text-charcoal-900 after:w-full',
      )}
    >
      {children}
    </Link>
  );
}
