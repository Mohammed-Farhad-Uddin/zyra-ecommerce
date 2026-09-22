'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Loader2,
  MapPin,
  Phone,
  ShoppingCart,
  StickyNote,
  Trash2,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SmartImage } from '@/components/ui/smart-image';
import { useToast } from '@/components/ui/toast';
import { ORDER_STATUSES, type OrderDTO, type OrderStatus } from '@aurelia/backend/shared';
import { cn, formatDate, formatPrice } from '@/lib/utils';

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-gold-100 text-gold-600',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-rose-100 text-rose-600',
};

export function OrdersBoard({ orders }: { orders: OrderDTO[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [filter, setFilter] = useState<'All' | OrderStatus>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = filter === 'All' ? orders : orders.filter((order) => order.status === filter);

  const counts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
    Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  };

  async function changeStatus(id: string, status: OrderStatus) {
    setBusyId(id);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Could not update the order');

      toast({ title: `Order marked ${status.toLowerCase()}` });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(order: OrderDTO) {
    if (!confirm(`Delete order ${order.orderNumber}? This cannot be undone.`)) return;

    setBusyId(order.id);
    try {
      const response = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete the order');

      toast({ title: 'Order deleted' });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(['All', ...ORDER_STATUSES] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              'rounded-full px-4 py-2 text-xs transition',
              filter === option
                ? 'bg-charcoal-900 text-cream'
                : 'border border-sand bg-white text-charcoal-600 hover:border-charcoal-900',
            )}
          >
            {option} · {counts[option]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory">
            <ShoppingCart className="h-6 w-6 text-gold-400" />
          </span>
          <h2 className="mt-5 font-serif text-2xl text-charcoal-900">
            {filter === 'All' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-charcoal-400">
            Orders placed on the storefront will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((order) => {
            const open = expanded === order.id;
            const busy = busyId === order.id;

            return (
              <motion.div key={order.id} layout className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : order.id)}
                  className="flex w-full flex-wrap items-center gap-4 px-5 py-4 text-left transition hover:bg-ivory/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg text-charcoal-900">
                        {order.customerName}
                      </span>
                      <span className="rounded-full bg-ivory px-2.5 py-0.5 text-[11px] tracking-wider text-charcoal-400">
                        {order.orderNumber}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-charcoal-400">
                      {order.phone} · {order.items.length} item(s) · {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span className="font-serif text-xl text-charcoal-900">
                    {formatPrice(order.total)}
                  </span>

                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-[11px] uppercase tracking-wider',
                      statusStyles[order.status],
                    )}
                  >
                    {order.status}
                  </span>

                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-charcoal-400 transition-transform',
                      open && 'rotate-180',
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-sand bg-ivory/40"
                    >
                      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_320px]">
                        <div>
                          <p className="eyebrow mb-3">Items</p>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                                  <SmartImage
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm text-charcoal-900">{item.title}</p>
                                  <p className="text-xs text-charcoal-400">
                                    {item.quantity} × {formatPrice(item.unitPrice)}
                                  </p>
                                </div>
                                <span className="text-sm text-charcoal-800">
                                  {formatPrice(item.lineTotal)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 space-y-1.5 border-t border-sand pt-4 text-sm">
                            <div className="flex justify-between text-charcoal-400">
                              <span>Subtotal</span>
                              <span className="text-charcoal-800">
                                {formatPrice(order.subtotal)}
                              </span>
                            </div>
                            <div className="flex justify-between text-charcoal-400">
                              <span>Delivery</span>
                              <span className="text-charcoal-800">
                                {order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Free'}
                              </span>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span className="text-charcoal-400">Total ({order.paymentMethod})</span>
                              <span className="font-medium text-charcoal-900">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="eyebrow mb-3">Customer</p>
                          <div className="space-y-3 text-sm">
                            <Detail icon={User} value={order.customerName} />
                            <Detail icon={Phone} value={order.phone} />
                            <Detail
                              icon={MapPin}
                              value={[order.address, order.city].filter(Boolean).join(', ')}
                            />
                            {order.note ? <Detail icon={StickyNote} value={order.note} /> : null}
                          </div>

                          <p className="eyebrow mb-3 mt-6">Update status</p>
                          <div className="flex flex-wrap gap-2">
                            {ORDER_STATUSES.map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={busy || order.status === status}
                                onClick={() => changeStatus(order.id, status)}
                                className={cn(
                                  'rounded-full px-4 py-2 text-xs transition disabled:opacity-60',
                                  order.status === status
                                    ? 'bg-charcoal-900 text-cream'
                                    : 'border border-sand bg-white text-charcoal-600 hover:border-charcoal-900',
                                )}
                              >
                                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : status}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(order)}
                            disabled={busy}
                            className="mt-4 inline-flex items-center gap-2 text-xs text-charcoal-400 transition hover:text-rose-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete this order
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
      <span className="text-charcoal-600">{value}</span>
    </div>
  );
}
