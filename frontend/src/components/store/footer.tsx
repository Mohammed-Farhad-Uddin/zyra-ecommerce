import { Instagram, Mail, Phone, Truck } from 'lucide-react';
import Link from 'next/link';
import type { CategoryDTO } from '@aurelia/backend/shared';

const promises = [
  { icon: Truck, title: 'Nationwide delivery', copy: 'Dhaka ৳60 · outside ৳120' },
  { icon: Phone, title: 'Cash on delivery', copy: 'Pay only when it arrives' },
];

export function Footer({ categories }: { categories: CategoryDTO[] }) {
  return (
    <footer className="mt-24 border-t border-sand bg-ivory">
      <div className="container-luxe grid gap-8 border-b border-sand py-12 sm:grid-cols-2">
        {promises.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-200 bg-white">
              <Icon className="h-4 w-4 text-gold-500" />
            </span>
            <div>
              <p className="text-sm font-medium text-charcoal-900">{title}</p>
              <p className="text-xs text-charcoal-400">{copy}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container-luxe grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl tracking-[0.3em] text-charcoal-900">Zyra</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.42em] text-gold-500">
            Fine Jewellery
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal-400">
            Every piece is finished by hand in small batches, using recycled precious metals and
            responsibly sourced stones — made to be worn daily and passed on.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="mailto:hello@aurelia.com"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white text-charcoal-600 transition hover:border-gold-300 hover:text-gold-500"
              aria-label="Email us"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white text-charcoal-600 transition hover:border-gold-300 hover:text-gold-500"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Collections</p>
          <ul className="space-y-2.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="text-sm text-charcoal-400 transition hover:text-charcoal-900"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Customer care</p>
          <ul className="space-y-2.5 text-sm text-charcoal-400">
            <li>
              <Link href="/shop" className="transition hover:text-charcoal-900">
                Shop all
              </Link>
            </li>
            <li>
              <Link href="/track" className="transition hover:text-charcoal-900">
                Track your order
              </Link>
            </li>
            <li>
              <Link href="/admin" className="transition hover:text-charcoal-900">
                Store admin
              </Link>
            </li>
            <li>+880 1700 000000</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand py-6">
        <div className="container-luxe flex flex-col items-center justify-between gap-2 text-xs text-charcoal-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Zyra Fine Jewellery. All rights reserved.</p>
          <p>Cash on delivery · No online payment required</p>
        </div>
      </div>
    </footer>
  );
}
