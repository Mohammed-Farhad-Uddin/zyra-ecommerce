import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { prisma } from '@aurelia/backend';
import { ORDER_STATUSES, type OrderStatus } from '@aurelia/backend/shared';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const { status } = (await request.json()) as { status?: OrderStatus };

  if (!status || !ORDER_STATUSES.includes(status))
    return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });

  try {
    const order = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}
