import { CartDrawer } from '@/components/store/cart-drawer';
import { Footer } from '@/components/store/footer';
import { Header } from '@/components/store/header';
import { getCategories } from '@aurelia/backend';

// Pages like /cart have no server fetch of their own, but this layout reads
// categories from MongoDB. Skip static generation so `next build` does not
// need a live database connection.
export const dynamic = 'force-dynamic';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
    </div>
  );
}
