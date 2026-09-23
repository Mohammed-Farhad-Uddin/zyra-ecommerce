'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/smart-image';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=85';

const stats = [
  { value: '14k–18k', label: 'Solid & recycled gold' },
  { value: '2,400+', label: 'Happy customers' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ivory via-cream to-rose-50">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[460px] w-[460px] rounded-full bg-rose-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-32 h-[420px] w-[420px] rounded-full bg-gold-100/70 blur-3xl" />

      <div className="container-luxe relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white/70 px-4 py-1.5 text-[11px] uppercase tracking-luxe text-gold-500 backdrop-blur">
            <Sparkles className="h-3 w-3" />
            The Autumn Collection
          </span>

          <h1 className="heading-display mt-6 text-5xl sm:text-6xl lg:text-[4.6rem]">
            Jewellery made
            <span className="block italic text-gold-500">to be remembered</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-balance text-[15px] leading-relaxed text-charcoal-400 lg:mx-0">
            Hand-finished rings, necklaces and earrings in recycled gold and ethically sourced
            stones. Designed quietly, worn every day, kept for a lifetime.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/shop" className="btn-primary group w-full sm:w-auto">
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/shop?sort=popular" className="btn-outline w-full sm:w-auto">
              Explore bestsellers
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-sand pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl text-charcoal-900">{stat.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-charcoal-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 lg:order-2"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ivory shadow-lift sm:aspect-[5/5]">
            <SmartImage
              src={HERO_IMAGE}
              alt="Model wearing the Zyra autumn collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/25 via-transparent to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute -bottom-6 left-4 rounded-2xl border border-sand bg-white/95 px-5 py-4 shadow-lift backdrop-blur sm:left-8"
          >
            <p className="eyebrow">Now trending</p>
            <p className="mt-1 font-serif text-xl text-charcoal-900">Celeste Pearl Drop</p>
            <p className="text-xs text-charcoal-400">From ৳398</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
