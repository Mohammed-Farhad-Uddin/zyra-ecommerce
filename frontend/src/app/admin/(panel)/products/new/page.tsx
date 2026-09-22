import Link from 'next/link';
import { ProductForm } from '@/components/admin/product-form';
import { getCategories } from '@aurelia/backend';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <h1 className="font-serif text-2xl text-charcoal-900">Create a category first</h1>
        <p className="mt-2 text-sm text-charcoal-400">
          Products need a category before they can be added to the store.
        </p>
        <Link href="/admin/categories" className="btn-primary mt-6">
          Go to categories
        </Link>
      </div>
    );
  }

  return <ProductForm categories={categories} />;
}
