'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import type { ProductDTO } from '@aurelia/backend/shared';
import { useCart } from '@/store/cart';

export function AddToCart({ product }: { product: ProductDTO }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const { toast } = useToast();
  const router = useRouter();

  const available = product.inStock && product.stock > 0;
  const ceiling = product.stock > 0 ? product.stock : 1;

  function add(then?: 'cart' | 'checkout') {
    if (!available) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.images[0]?.url ?? null,
        stock: product.stock,
      },
      quantity,
    );

    if (then === 'checkout') {
      router.push('/checkout');
      return;
    }

    toast({
      title: 'Added to your bag',
      description: `${quantity} × ${product.title}`,
    });
    openCart();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-wider text-charcoal-400">Quantity</span>
        <div className="flex items-center rounded-full border border-sand bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="px-3.5 py-2.5 text-charcoal-400 transition hover:text-charcoal-900 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(ceiling, q + 1))}
            disabled={quantity >= ceiling}
            aria-label="Increase quantity"
            className="px-3.5 py-2.5 text-charcoal-400 transition hover:text-charcoal-900 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {available && product.stock <= 5 ? (
          <span className="text-xs text-rose-500">Only {product.stock} left</span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => add()}
          disabled={!available}
          className="btn-primary w-full"
        >
          <ShoppingBag className="h-4 w-4" />
          {available ? 'Add to Cart' : 'Sold out'}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => add('checkout')}
          disabled={!available}
          className="btn-gold w-full"
        >
          Buy now · Cash on delivery
        </motion.button>
      </div>
    </div>
  );
}
