'use client';

import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageUploader, type EditableImage } from '@/components/admin/image-uploader';
import { useToast } from '@/components/ui/toast';
import type { CategoryDTO, ProductDTO } from '@aurelia/backend/shared';
import { cn } from '@/lib/utils';

type FormState = {
  title: string;
  description: string;
  price: string;
  comparePrice: string;
  material: string;
  sku: string;
  categoryId: string;
  stock: string;
  isPopular: boolean;
  isNewArrival: boolean;
  isActive: boolean;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryDTO[];
  product?: ProductDTO;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>({
    title: product?.title ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    comparePrice: product?.comparePrice ? String(product.comparePrice) : '',
    material: product?.material ?? '',
    sku: product?.sku ?? '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    stock: product ? String(product.stock) : '10',
    isPopular: product?.isPopular ?? false,
    isNewArrival: product?.isNewArrival ?? true,
    isActive: product?.isActive ?? true,
  });

  const [images, setImages] = useState<EditableImage[]>(
    product?.images.map((image) => ({ url: image.url, isPrimary: image.isPrimary })) ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;

    if (!form.title.trim() || !form.description.trim() || !form.categoryId) {
      toast({ title: 'Title, description and category are required', variant: 'error' });
      return;
    }
    if (!(Number(form.price) > 0)) {
      toast({ title: 'Enter a price greater than zero', variant: 'error' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        product ? `/api/products/${product.id}` : '/api/products',
        {
          method: product ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
            stock: Number(form.stock),
            images,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not save the product');

      toast({ title: product ? 'Product updated' : 'Product created', description: form.title });
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      setSaving(false);
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    }
  }

  async function remove() {
    if (!product || deleting) return;
    if (!confirm(`Delete “${product.title}”? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete the product');

      toast({ title: 'Product deleted' });
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      setDeleting(false);
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-charcoal-400 transition hover:text-charcoal-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to products
          </Link>
          <h1 className="heading-display mt-3 text-3xl sm:text-4xl">
            {product ? 'Edit product' : 'New product'}
          </h1>
        </div>

        <div className="flex gap-2">
          {product ? (
            <button
              type="button"
              onClick={remove}
              disabled={deleting}
              className="btn-outline border-rose-200 px-5 py-2.5 text-rose-500 hover:border-rose-500 hover:bg-rose-500"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          ) : null}
          <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {product ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-serif text-xl text-charcoal-900">Details</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className="label" htmlFor="title">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Aurelia Solitaire Ring"
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="description">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={6}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe the materials, stones, sizing and styling…"
                  className="input resize-y"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="material">
                    Material
                  </label>
                  <input
                    id="material"
                    value={form.material}
                    onChange={(e) => update('material', e.target.value)}
                    placeholder="18k Rose Gold · Moissanite"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="sku">
                    SKU
                  </label>
                  <input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => update('sku', e.target.value)}
                    placeholder="AUR-RING-001"
                    className="input"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-serif text-xl text-charcoal-900">Images</h2>
            <p className="mt-1 text-xs text-charcoal-400">
              Upload one or more photos, then pick which one appears as the cover.
            </p>
            <div className="mt-5">
              <ImageUploader images={images} onChange={setImages} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-serif text-xl text-charcoal-900">Pricing</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <label className="label" htmlFor="price">
                  Price (USD) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder="489.00"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="comparePrice">
                  Compare-at price
                </label>
                <input
                  id="comparePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(e) => update('comparePrice', e.target.value)}
                  placeholder="560.00"
                  className="input"
                />
                <p className="mt-1.5 text-xs text-charcoal-400">
                  Shown struck through to display a discount.
                </p>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-serif text-xl text-charcoal-900">Organisation</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className="label" htmlFor="categoryId">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="categoryId"
                  value={form.categoryId}
                  onChange={(e) => update('categoryId', e.target.value)}
                  className="input"
                >
                  {categories.length === 0 ? <option value="">No categories yet</option> : null}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="stock">
                  Stock quantity
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => update('stock', e.target.value)}
                  className="input"
                />
                <p className="mt-1.5 text-xs text-charcoal-400">
                  Set to 0 to mark the piece as sold out.
                </p>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-serif text-xl text-charcoal-900">Visibility</h2>
            <div className="mt-4 space-y-2">
              <Toggle
                label="Popular"
                hint="Feature in the Popular Right Now section"
                checked={form.isPopular}
                onChange={(v) => update('isPopular', v)}
              />
              <Toggle
                label="New arrival"
                hint="Feature in the New Arrivals section"
                checked={form.isNewArrival}
                onChange={(v) => update('isNewArrival', v)}
              />
              <Toggle
                label="Published"
                hint="Visible on the storefront"
                checked={form.isActive}
                onChange={(v) => update('isActive', v)}
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition hover:bg-ivory"
    >
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition',
          checked ? 'bg-gold-400' : 'bg-sand',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
            checked ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-charcoal-900">{label}</span>
        <span className="block text-xs text-charcoal-400">{hint}</span>
      </span>
    </button>
  );
}
