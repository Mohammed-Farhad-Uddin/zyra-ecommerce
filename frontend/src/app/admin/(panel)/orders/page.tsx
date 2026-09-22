import { OrdersBoard } from '@/components/admin/orders-board';
import { prisma } from '@aurelia/backend';
import type { OrderDTO, OrderStatus } from '@aurelia/backend/shared';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const data: OrderDTO[] = orders.map((order) => ({
    ...order,
    status: order.status as OrderStatus,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="heading-display text-3xl sm:text-4xl">Orders</h1>
        <p className="mt-1.5 text-sm text-charcoal-400">
          Every cash-on-delivery order placed on the storefront
        </p>
      </header>

      <OrdersBoard orders={data} />
    </div>
  );
}
