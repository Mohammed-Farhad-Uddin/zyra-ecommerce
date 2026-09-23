'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/smart-image';
import { useToast } from '@/components/ui/toast';
import type { ProductDTO } from '@aurelia/backend/shared';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/store/cart';

export function ProductCard({ product, index = 0 }: { product: ProductDTO; index?: number }) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const { toast } = useToast();

  const primary = product.images[0]?.url ?? null;
  const hover = product.images[1]?.url ?? null;
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  function quickAdd(event: React.MouseEvent) {
    event.preventDefault();
    if (!product.inStock || product.stock <= 0) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: primary,
      stock: product.stock,
      isFreeDelivery: product.isFreeDelivery,
    });
    toast({ title: 'Added to your bag', description: product.title });
    openCart();
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory">
          <SmartImage
            src={primary}
            alt={product.images[0]?.alt ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-all duration-700 ease-out',
              hover ? 'group-hover:opacity-0' : 'group-hover:scale-105',
            )}
          />
          {hover ? (
            <SmartImage
              src={hover}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
            />
          ) : null}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNewArrival ? (
              <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] uppercase tracking-luxe text-charcoal-800 backdrop-blur">
                New
              </span>
            ) : null}
            {discount ? (
              <span className="rounded-full bg-rose-400 px-3 py-1 text-[10px] uppercase tracking-luxe text-white">
                -{discount}%
              </span>
            ) : null}
          </div>

          {!product.inStock || product.stock <= 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-cream/70 backdrop-blur-[1px]">
              <span className="rounded-full bg-charcoal-900 px-4 py-1.5 text-[10px] uppercase tracking-luxe text-cream">
                Sold out
              </span>
            </div>
          ) : (
            <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={quickAdd}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-3 text-xs font-medium text-charcoal-900 shadow-soft backdrop-blur transition hover:bg-charcoal-900 hover:text-cream"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Quick add
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 text-center">
          <p className="text-[10px] uppercase tracking-luxe text-gold-500">
            {product.category.name}
          </p>
          <h3 className="mt-1.5 font-serif text-lg leading-snug text-charcoal-900 transition-colors group-hover:text-gold-500">
            {product.title}
          </h3>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-charcoal-800">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price ? (
              <span className="text-xs text-charcoal-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
