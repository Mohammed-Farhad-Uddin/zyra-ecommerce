'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, Loader2, Lock, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SmartImage } from '@/components/ui/smart-image';
import { useToast } from '@/components/ui/toast';
import { SHIPPING_FEE } from '@aurelia/backend/shared';
import { formatPrice } from '@/lib/utils';
import { selectSubtotal, useCart } from '@/store/cart';

type FormState = {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  customerName: '',
  phone: '',
  address: '',
  city: '',
  note: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, hydrated, clear } = useCart();
  const subtotal = useCart(selectSubtotal);

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && items.length === 0 && !submitting) router.replace('/cart');
  }, [hydrated, items.length, router, submitting]);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next: Errors = {};
    if (form.customerName.trim().length < 3) next.customerName = 'Please enter your full name';
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim()))
      next.phone = 'Enter a valid phone number we can call';
    if (form.address.trim().length < 10)
      next.address = 'Enter the full delivery address, including area';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not place the order');

      clear();
      router.push(`/order/${data.orderNumber}`);
    } catch (error) {
      setSubmitting(false);
      toast({
        title: 'Order could not be placed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error',
      });
    }
  }

  if (!hydrated) {
    return (
      <div className="container-luxe py-24">
        <div className="mx-auto h-72 max-w-4xl animate-pulse rounded-2xl bg-ivory" />
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 lg:py-16">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-charcoal-400 transition hover:text-charcoal-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to bag
      </Link>

      <h1 className="heading-display mt-5 text-4xl sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-sm text-charcoal-400">
        Cash on delivery — no payment is taken now.
      </p>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-900 text-xs text-cream">
                1
              </span>
              <h2 className="font-serif text-2xl text-charcoal-900">Delivery details</h2>
            </div>

            <div className="mt-6 grid gap-5">
              <Field
                label="Full name"
                required
                error={errors.customerName}
                value={form.customerName}
                onChange={(v) => update('customerName', v)}
                placeholder="e.g. Nadia Rahman"
                autoComplete="name"
              />
              <Field
                label="Phone number"
                required
                error={errors.phone}
                value={form.phone}
                onChange={(v) => update('phone', v)}
                placeholder="+880 1700 000000"
                type="tel"
                autoComplete="tel"
              />
              <div>
                <label className="label" htmlFor="address">
                  Full delivery address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="House / flat, road, area, landmark"
                  autoComplete="street-address"
                  className="input resize-none"
                />
                {errors.address ? (
                  <p className="mt-1.5 text-xs text-rose-500">{errors.address}</p>
                ) : null}
              </div>
              <Field
                label="City / district"
                value={form.city}
                onChange={(v) => update('city', v)}
                placeholder="Dhaka"
                autoComplete="address-level2"
              />
              <div>
                <label className="label" htmlFor="note">
                  Order note (optional)
                </label>
                <textarea
                  id="note"
                  rows={2}
                  value={form.note}
                  onChange={(e) => update('note', e.target.value)}
                  placeholder="Gift wrapping, preferred delivery time…"
                  className="input resize-none"
                />
              </div>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-900 text-xs text-cream">
                2
              </span>
              <h2 className="font-serif text-2xl text-charcoal-900">Payment</h2>
            </div>

            <div className="mt-6 flex items-start gap-4 rounded-2xl border-2 border-gold-300 bg-gold-100/30 p-5">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
              <div>
                <p className="text-sm font-medium text-charcoal-900">Cash on Delivery</p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal-400">
                  Hand the exact amount to our courier when your parcel arrives. Please inspect
                  the piece before paying — no card or online payment required.
                </p>
              </div>
              <BadgeCheck className="ml-auto h-5 w-5 shrink-0 text-gold-500" />
            </div>
          </div>
        </motion.div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="card p-6">
            <h2 className="font-serif text-2xl text-charcoal-900">Your order</h2>

            <div className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ivory">
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal-900 text-[10px] text-cream">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base text-charcoal-900">{item.title}</p>
                    <p className="text-xs text-charcoal-400">{formatPrice(item.price)} each</p>
                  </div>
                  <span className="text-sm text-charcoal-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="hairline my-5" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-charcoal-400">
                <span>Subtotal</span>
                <span className="text-charcoal-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-400">
                <span>Delivery</span>
                <span className="text-green-700">
                  {SHIPPING_FEE > 0 ? formatPrice(SHIPPING_FEE) : 'Free'}
                </span>
              </div>
            </div>

            <div className="hairline my-5" />

            <div className="flex items-baseline justify-between">
              <span className="text-sm text-charcoal-400">Total due on delivery</span>
              <span className="font-serif text-3xl text-charcoal-900">
                {formatPrice(subtotal + SHIPPING_FEE)}
              </span>
            </div>

            <button type="submit" disabled={submitting} className="btn-gold mt-6 w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing your order…
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Place order
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-charcoal-400">
              By placing this order you agree to pay in cash on delivery.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
