import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { generateOrderNumber, isDistrict, prisma, shippingFeeFor } from '@aurelia/backend';

type IncomingItem = { productId: string; quantity: number };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, city, note } = body as Record<string, string>;
    const items = (body.items ?? []) as IncomingItem[];

    if (!customerName?.trim() || customerName.trim().length < 3)
      return NextResponse.json({ error: 'A valid customer name is required' }, { status: 400 });
    if (!phone?.trim())
      return NextResponse.json({ error: 'A phone number is required' }, { status: 400 });
    if (!address?.trim() || address.trim().length < 10)
      return NextResponse.json({ error: 'A full delivery address is required' }, { status: 400 });
    const district = city?.trim() ?? '';
    if (!isDistrict(district))
      return NextResponse.json({ error: 'Select a district in Bangladesh' }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });

    // Prices and stock are re-read from the database so the client cannot dictate totals.
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, isActive: true },
      include: { images: { orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }], take: 1 } },
    });

    if (products.length === 0)
      return NextResponse.json({ error: 'None of these items are available' }, { status: 400 });

    const lines = items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
        if (!product.inStock || product.stock <= 0) return null;

        const finalQuantity = Math.min(quantity, product.stock);
        return {
          productId: product.id,
          title: product.title,
          imageUrl: product.images[0]?.url ?? null,
          unitPrice: product.price,
          quantity: finalQuantity,
          lineTotal: Number((product.price * finalQuantity).toFixed(2)),
        };
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    if (lines.length === 0)
      return NextResponse.json({ error: 'These items are out of stock' }, { status: 400 });

    const subtotal = Number(lines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2));
    const allFree = lines.every((line) =>
      Boolean(products.find((product) => product.id === line.productId)?.isFreeDelivery),
    );
    const shippingFee = shippingFeeFor(district, allFree);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: district,
          note: note?.trim() || null,
          subtotal,
          shippingFee,
          total: Number((subtotal + shippingFee).toFixed(2)),
          items: { create: lines },
        },
        include: { items: true },
      });

      for (const line of lines) {
        const product = products.find((p) => p.id === line.productId)!;
        const remaining = Math.max(0, product.stock - line.quantity);
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: remaining, inStock: remaining > 0 },
        });
      }

      return created;
    });

    return NextResponse.json(
      { orderNumber: order.orderNumber, id: order.id, total: order.total },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/orders', error);
    return NextResponse.json({ error: 'Something went wrong placing your order' }, { status: 500 });
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}
