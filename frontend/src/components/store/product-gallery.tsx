'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { SmartImage } from '@/components/ui/smart-image';
import type { ProductImageDTO } from '@aurelia/backend/shared';
import { cn } from '@/lib/utils';

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImageDTO[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [{ id: 'fallback', url: '', alt: title } as ProductImageDTO];

  const step = (delta: number) =>
    setActive((current) => (current + delta + gallery.length) % gallery.length);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {gallery.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0">
          {gallery.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                'relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-ivory transition lg:h-24 lg:w-20',
                active === index
                  ? 'border-gold-400'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <SmartImage
                src={image.url}
                alt={image.alt ?? title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="group relative aspect-[4/5] flex-1 overflow-hidden rounded-3xl bg-ivory">
        <AnimatePresence mode="wait">
          <motion.div
            key={gallery[active]?.id ?? active}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <SmartImage
              src={gallery[active]?.url}
              alt={gallery[active]?.alt ?? title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {gallery.length > 1 ? (
          <>
            <GalleryArrow side="left" onClick={() => step(-1)} />
            <GalleryArrow side="right" onClick={() => step(1)} />
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {gallery.map((image, index) => (
                <span
                  key={image.id}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    active === index ? 'w-6 bg-charcoal-900' : 'w-1.5 bg-charcoal-900/25',
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function GalleryArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous image' : 'Next image'}
      className={cn(
        'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full',
        'bg-white/90 text-charcoal-800 opacity-0 shadow-soft backdrop-blur transition',
        'hover:bg-white group-hover:opacity-100',
        side === 'left' ? 'left-3' : 'right-3',
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
