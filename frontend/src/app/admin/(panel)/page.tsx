import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  Tags,
  TriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/smart-image';
import { prisma } from '@aurelia/backend';
import { formatDate, formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, orderCount, pendingCount, delivered, recentOrders, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'Pending' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: 'Delivered' } }),
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        include: { images: { take: 1, orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] } },
        orderBy: { stock: 'asc' },
        take: 5,
      }),
    ]);

  const stats = [
    {
      label: 'Revenue (delivered)',
      value: formatPrice(delivered._sum.total ?? 0),
      icon: DollarSign,
      href: '/admin/orders',
    },
    { label: 'Total orders', value: orderCount, icon: ShoppingCart, href: '/admin/orders' },
    { label: 'Pending orders', value: pendingCount, icon: Clock, href: '/admin/orders' },
    { label: 'Products', value: productCount, icon: Package, href: '/admin/products' },
    { label: 'Categories', value: categoryCount, icon: Tags, href: '/admin/categories' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="heading-display text-3xl sm:text-4xl">Dashboard</h1>
        <p className="mt-1.5 text-sm text-charcoal-400">
          A snapshot of the store — {formatDate(new Date())}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="card group p-5 transition hover:border-gold-200 hover:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory">
                <Icon className="h-4 w-4 text-gold-500" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-charcoal-400 opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="mt-4 font-serif text-3xl text-charcoal-900">{value}</p>
            <p className="mt-0.5 text-xs text-charcoal-400">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-sand px-5 py-4">
            <h2 className="font-serif text-xl text-charcoal-900">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-gold-500 hover:text-gold-600">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-charcoal-400">No orders yet.</p>
          ) : (
            <div className="divide-y divide-sand">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal-900">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-charcoal-400">
                      {order.orderNumber} · {order.items.length} item(s) ·{' '}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm text-charcoal-800">{formatPrice(order.total)}</span>
                  <StatusPill status={order.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-sand px-5 py-4">
            <TriangleAlert className="h-4 w-4 text-rose-400" />
            <h2 className="font-serif text-xl text-charcoal-900">Low stock</h2>
          </div>

          {lowStock.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-charcoal-400">
              Every product is well stocked.
            </p>
          ) : (
            <div className="divide-y divide-sand">
              {lowStock.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 px-5 py-3 transition hover:bg-ivory"
                >
                  <div className="relative h-11 w-10 shrink-0 overflow-hidden rounded-lg bg-ivory">
                    <SmartImage
                      src={product.images[0]?.url}
                      alt={product.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm text-charcoal-800">
                    {product.title}
                  </p>
                  <span
                    className={
                      product.stock === 0
                        ? 'rounded-full bg-rose-100 px-2.5 py-1 text-[11px] text-rose-600'
                        : 'rounded-full bg-gold-100 px-2.5 py-1 text-[11px] text-gold-600'
                    }
                  >
                    {product.stock === 0 ? 'Sold out' : `${product.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: 'bg-gold-100 text-gold-600',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-rose-100 text-rose-600',
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${styles[status] ?? 'bg-ivory text-charcoal-400'}`}
    >
      {status}
    </span>
  );
}
