'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/smart-image';
import type { CategoryDTO } from '@aurelia/backend/shared';

export function CategoryStrip({ categories }: { categories: CategoryDTO[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: index * 0.07 }}
          className="group relative overflow-hidden rounded-2xl"
        >
          <Link href={`/shop?category=${category.slug}`} className="block">
            <div className="relative aspect-[3/4] bg-ivory">
              <SmartImage
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <h3 className="font-serif text-xl text-white">{category.name}</h3>
              <p className="text-[10px] uppercase tracking-luxe text-white/70">
                {category.productCount ?? 0} pieces
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
