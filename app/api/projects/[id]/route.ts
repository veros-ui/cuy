import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const p = await prisma.project.findUnique({ where: { id: params.id }, include: { owner: { select: { id: true, name: true, image: true, bio: true, avatarBorder: true, role: true } } } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.project.update({ where: { id: p.id }, data: { views: { increment: 1 } } });
  return NextResponse.json(p);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s: any = await getServerSession(authOptions as any);
  if (s?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const s: any = await getServerSession(authOptions as any);
  if (s?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const data: any = {};
  for (const key of ["name", "description", "category", "photoUrl", "downloadUrl"]) if (typeof b[key] === "string") data[key] = b[key];
  if (typeof b.premium === "boolean") data.premium = b.premium;
  if (b.price !== undefined) data.price = Math.max(0, Number(b.price || 0));
  return NextResponse.json(await prisma.project.update({ where: { id: params.id }, data }));
}
