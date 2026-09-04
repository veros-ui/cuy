import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const s: any = await getServerSession(authOptions as any);
  if (!s?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const rows = await prisma.wishlist.findMany({ where: { userId: s.user.id }, include: { project: { include: { owner: { select: { name: true, image: true } } } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows.map((x) => x.project));
}

export async function POST(req: Request) {
  const s: any = await getServerSession(authOptions as any);
  if (!s?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { projectId } = await req.json();
  const existing = await prisma.wishlist.findUnique({ where: { userId_projectId: { userId: s.user.id, projectId } } });
  if (existing) await prisma.wishlist.delete({ where: { id: existing.id } });
  else await prisma.wishlist.create({ data: { userId: s.user.id, projectId } });
  return NextResponse.json({ saved: !existing });
}
