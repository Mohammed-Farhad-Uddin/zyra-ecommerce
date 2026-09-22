'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Store,
  Tags,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

export function AdminShell({
  children,
  pendingCount = 0,
}: {
  children: React.ReactNode;
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-charcoal-900 text-cream">
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/admin" className="font-serif text-xl tracking-[0.3em]">
          AURELIA
        </Link>
        <p className="mt-1 text-[9px] uppercase tracking-[0.38em] text-gold-300">Admin panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navigation.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition',
                active ? 'bg-white/10 text-cream' : 'text-cream/55 hover:bg-white/5 hover:text-cream',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {href === '/admin/orders' && pendingCount > 0 ? (
                <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold text-charcoal-900">
                  {pendingCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-cream/55 transition hover:bg-white/5 hover:text-cream"
        >
          <Store className="h-4 w-4" />
          View storefront
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-cream/55 transition hover:bg-rose-500/15 hover:text-rose-200"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 w-64">{sidebar}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-sand bg-cream/90 px-5 py-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu">
            <Menu className="h-5 w-5 text-charcoal-800" />
          </button>
          <span className="font-serif text-lg tracking-[0.2em] text-charcoal-900">AURELIA</span>
        </header>

        <main className="flex-1 bg-cream px-5 py-7 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-charcoal-900/50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-[90] w-64 lg:hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="absolute -right-11 top-4 rounded-full bg-white/10 p-2 text-cream"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
