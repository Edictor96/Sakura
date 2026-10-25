import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db/prisma";

async function userOrUnauthorized() {
  const user = await requireCurrentUser();
  return user ? user : null;
}

export async function GET() {
  const user = await userOrUnauthorized();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const items = await prisma.cartItem.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await userOrUnauthorized();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  let payload: { productId?: unknown; quantity?: unknown; variant?: unknown };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Send JSON." }, { status: 400 }); }
  const productId = typeof payload.productId === "string" ? payload.productId : "";
  const quantity = typeof payload.quantity === "number" && Number.isInteger(payload.quantity) ? payload.quantity : 1;
  const variant = typeof payload.variant === "string" && payload.variant.length <= 80 ? payload.variant : "Standard";
  if (!productId || quantity < 1 || quantity > 20) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    create: { userId: user.id, productId, quantity, variant },
    update: { quantity, variant },
    include: { product: true },
  });
  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const user = await userOrUnauthorized();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const productId = new URL(request.url).searchParams.get("productId") ?? "";
  if (!productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });
  await prisma.cartItem.deleteMany({ where: { userId: user.id, productId } });
  return NextResponse.json({ ok: true });
}
