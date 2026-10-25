import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";

function authorized(request: Request) {
  const expected = process.env.MODERATION_ADMIN_TOKEN;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(expected && provided && provided === expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const status = new URL(request.url).searchParams.get("status") ?? "open";
  return NextResponse.json({ reports: await prisma.report.findMany({ where: { status }, orderBy: { createdAt: "asc" }, take: 100 }) });
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  let payload: { id?: string; status?: string; resolvedBy?: string };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Send JSON." }, { status: 400 }); }
  if (!payload.id || !["open", "reviewing", "resolved", "dismissed"].includes(payload.status ?? "")) return NextResponse.json({ error: "Invalid report update." }, { status: 400 });
  if (payload.resolvedBy && !await prisma.user.findUnique({ where: { id: payload.resolvedBy }, select: { id: true } })) return NextResponse.json({ error: "Resolver not found." }, { status: 400 });
  const report = await prisma.report.update({ where: { id: payload.id }, data: { status: payload.status, resolvedAt: payload.status === "resolved" || payload.status === "dismissed" ? new Date() : null, resolvedBy: payload.resolvedBy ?? null } });
  return NextResponse.json({ report });
}
