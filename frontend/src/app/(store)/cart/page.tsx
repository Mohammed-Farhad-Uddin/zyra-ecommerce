'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/smart-image';
import { SHIPPING_FEE } from '@aurelia/backend/shared';
import { formatPrice } from '@/lib/utils';
import { selectSubtotal, useCart } from '@/store/cart';

export default function CartPage() {
  const { items, hydrated, setQuantity, removeItem } = useCart();
  const subtotal = useCart(selectSubtotal);

  if (!hydrated) {
    return (
      <div className="container-luxe py-24">
        <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-2xl bg-ivory" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-luxe flex flex-col items-center py-28 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ivory">
          <ShoppingBag className="h-8 w-8 text-gold-400" />
        </span>
        <h1 className="heading-display mt-7 text-4xl">Your bag is empty</h1>
        <p className="mt-3 max-w-sm text-sm text-charcoal-400">
          Nothing here yet. Explore the collection and find a piece you will reach for every day.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 lg:py-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-charcoal-400 transition hover:text-charcoal-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Continue shopping
      </Link>

      <h1 className="heading-display mt-5 text-4xl sm:text-5xl">Shopping Bag</h1>
      <p className="mt-2 text-sm text-charcoal-400">
        {items.length} {items.length === 1 ? 'piece' : 'pieces'} in your bag
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="card flex gap-5 p-4 sm:p-5"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory sm:h-32 sm:w-28"
                >
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-serif text-xl text-charcoal-900 transition hover:text-gold-500"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-charcoal-400">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.title}`}
                      className="rounded-full p-2 text-charcoal-400 transition hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-sand bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="px-3 py-2 text-charcoal-400 transition hover:text-charcoal-900"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-7 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="px-3 py-2 text-charcoal-400 transition hover:text-charcoal-900"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-serif text-xl text-charcoal-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="card p-6">
            <h2 className="font-serif text-2xl text-charcoal-900">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-charcoal-400">
                <span>Subtotal</span>
                <span className="text-charcoal-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-400">
                <span>Delivery</span>
                <span className="text-green-700">
                  {SHIPPING_FEE > 0 ? formatPrice(SHIPPING_FEE) : 'Free'}
                </span>
              </div>
              <div className="hairline my-4" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-charcoal-400">Total</span>
                <span className="font-serif text-3xl text-charcoal-900">
                  {formatPrice(subtotal + SHIPPING_FEE)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="btn-gold mt-6 w-full">
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-xs text-charcoal-400">
              Cash on delivery · pay when your order arrives
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
