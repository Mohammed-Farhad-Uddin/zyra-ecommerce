import { Check, MapPin, Package, Phone, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SmartImage } from '@/components/ui/smart-image';
import { prisma } from '@aurelia/backend';
import { formatDate, formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Order confirmed',
};

type Params = Promise<{ orderNumber: string }>;

export default async function OrderConfirmationPage({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber: decodeURIComponent(orderNumber) },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="container-luxe max-w-3xl py-14 lg:py-20">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-7 w-7 text-green-700" strokeWidth={2.5} />
        </span>
        <p className="eyebrow mt-6">Thank you</p>
        <h1 className="heading-display mt-3 text-4xl sm:text-5xl">Your order is confirmed</h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-charcoal-400">
          We have received your order and will call you shortly to confirm delivery. Keep the
          order ID below for reference.
        </p>
      </div>

      <div className="card mt-10 overflow-hidden">
        <div className="flex flex-col items-center justify-between gap-3 border-b border-sand bg-ivory px-6 py-5 sm:flex-row">
          <div>
            <p className="text-[11px] uppercase tracking-luxe text-charcoal-400">Order ID</p>
            <p className="mt-0.5 font-serif text-2xl tracking-wide text-charcoal-900">
              {order.orderNumber}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[11px] uppercase tracking-luxe text-charcoal-400">Placed on</p>
            <p className="mt-0.5 text-sm text-charcoal-800">{formatDate(order.createdAt)}</p>
          </div>
          <span className="rounded-full bg-gold-100 px-3.5 py-1.5 text-[11px] uppercase tracking-luxe text-gold-600">
            {order.status}
          </span>
        </div>

        <div className="divide-y divide-sand">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ivory">
                <SmartImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg text-charcoal-900">{item.title}</p>
                <p className="text-xs text-charcoal-400">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <span className="text-sm font-medium text-charcoal-900">
                {formatPrice(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 border-t border-sand bg-ivory/50 px-6 py-5 text-sm">
          <div className="flex justify-between text-charcoal-400">
            <span>Subtotal</span>
            <span className="text-charcoal-800">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-charcoal-400">
            <span>Delivery</span>
            <span className="text-green-700">
              {order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Free'}
            </span>
          </div>
          <div className="hairline my-3" />
          <div className="flex items-baseline justify-between">
            <span className="text-charcoal-400">Total payable on delivery</span>
            <span className="font-serif text-2xl text-charcoal-900">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-serif text-xl text-charcoal-900">Delivery to</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Detail icon={User} label="Name" value={order.customerName} />
          <Detail icon={Phone} label="Phone" value={order.phone} />
          <Detail
            icon={MapPin}
            label="Address"
            value={[order.address, order.city].filter(Boolean).join(', ')}
          />
          <Detail icon={Truck} label="Payment" value="Cash on delivery" />
        </div>
        {order.note ? (
          <p className="mt-4 rounded-xl bg-ivory p-4 text-xs leading-relaxed text-charcoal-400">
            <span className="font-medium text-charcoal-800">Note: </span>
            {order.note}
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/shop" className="btn-primary w-full sm:w-auto">
          Continue shopping
        </Link>
        <Link href="/track" className="btn-outline w-full sm:w-auto">
          <Package className="h-4 w-4" />
          Track this order
        </Link>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
      <div>
        <p className="text-[11px] uppercase tracking-wider text-charcoal-400">{label}</p>
        <p className="text-charcoal-800">{value}</p>
      </div>
    </div>
  );
}
