import { AdminShell } from '@/components/admin/admin-shell';
import { prisma } from '@aurelia/backend';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = await prisma.order.count({ where: { status: 'Pending' } });

  return <AdminShell pendingCount={pendingCount}>{children}</AdminShell>;
}
