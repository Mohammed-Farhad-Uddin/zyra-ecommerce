'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { SmartImage } from '@/components/ui/smart-image';
import { formatPrice } from '@/lib/utils';
import { selectSubtotal, useCart } from '@/store/cart';

export function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem } = useCart();
  const subtotal = useCart(selectSubtotal);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-charcoal-900/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col bg-cream shadow-lift"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-sand px-6 py-5">
              <div>
                <h2 className="font-serif text-2xl text-charcoal-900">Your Bag</h2>
                <p className="text-xs text-charcoal-400">
                  {items.length} {items.length === 1 ? 'piece' : 'pieces'} selected
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-charcoal-400 transition hover:bg-ivory hover:text-charcoal-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory">
                  <ShoppingBag className="h-7 w-7 text-gold-400" />
                </span>
                <p className="font-serif text-xl text-charcoal-900">Your bag is empty</p>
                <p className="text-sm text-charcoal-400">
                  Discover pieces made to be worn every day and kept for a lifetime.
                </p>
                <Link href="/shop" onClick={closeCart} className="btn-primary mt-2">
                  Browse the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="flex gap-4"
                      >
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory"
                        >
                          <SmartImage
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={closeCart}
                              className="font-serif text-lg leading-snug text-charcoal-900 hover:text-gold-500"
                            >
                              {item.title}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              aria-label={`Remove ${item.title}`}
                              className="p-1 text-charcoal-400 transition hover:text-rose-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-sand bg-white">
                              <button
                                type="button"
                                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="px-2.5 py-1.5 text-charcoal-400 hover:text-charcoal-900"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="px-2.5 py-1.5 text-charcoal-400 hover:text-charcoal-900"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-medium text-charcoal-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="space-y-4 border-t border-sand bg-white px-6 py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-charcoal-400">Subtotal</span>
                    <span className="font-serif text-2xl text-charcoal-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-400">
                    Delivery is added at checkout: ৳60 inside Dhaka, ৳120 outside. Pay in cash on
                    arrival.
                  </p>
                  <div className="grid gap-2">
                    <Link href="/checkout" onClick={closeCart} className="btn-gold w-full">
                      Checkout · Cash on Delivery
                    </Link>
                    <Link href="/cart" onClick={closeCart} className="btn-outline w-full">
                      View full bag
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
