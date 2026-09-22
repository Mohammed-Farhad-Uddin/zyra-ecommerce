'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = 'View all',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
      className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-12"
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="heading-display text-4xl sm:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-xl text-balance text-sm leading-relaxed text-charcoal-400">
          {description}
        </p>
      ) : null}
      {href ? (
        <Link
          href={href}
          className="group mt-1 inline-flex items-center gap-2 text-[12px] uppercase tracking-luxe text-charcoal-800 transition hover:text-gold-500"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </motion.div>
  );
}
