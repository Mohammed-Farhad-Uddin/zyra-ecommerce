'use client';

import { Package, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TrackOrderPage() {
  const router = useRouter();
  const [value, setValue] = useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const id = value.trim().toUpperCase();
    if (id) router.push(`/order/${encodeURIComponent(id)}`);
  }

  return (
    <div className="container-luxe flex max-w-xl flex-col items-center py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory">
        <Package className="h-7 w-7 text-gold-400" />
      </span>
      <h1 className="heading-display mt-6 text-4xl">Track your order</h1>
      <p className="mt-3 text-sm text-charcoal-400">
        Enter the order ID from your confirmation screen, for example ZYR-XXXXXX.
      </p>

      <form onSubmit={submit} className="mt-8 flex w-full gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ZYR-XXXXXX"
            className="input pl-11 uppercase tracking-wider"
          />
        </div>
        <button type="submit" className="btn-primary shrink-0">
          Track
        </button>
      </form>
    </div>
  );
}
