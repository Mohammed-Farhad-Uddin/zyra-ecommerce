export const metadata = {
  title: 'Admin',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-charcoal-50">{children}</div>;
}
