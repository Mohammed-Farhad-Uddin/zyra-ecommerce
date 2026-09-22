import { CategoryManager } from '@/components/admin/category-manager';
import { getCategories } from '@aurelia/backend';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="heading-display text-3xl sm:text-4xl">Categories</h1>
        <p className="mt-1.5 text-sm text-charcoal-400">
          Organise the catalogue — {categories.length}{' '}
          {categories.length === 1 ? 'category' : 'categories'}
        </p>
      </header>

      <CategoryManager categories={categories} />
    </div>
  );
}
