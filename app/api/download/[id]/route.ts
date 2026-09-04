import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const s: any = await getServerSession(authOptions as any);
  if (!s?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const p = await prisma.project.findUnique({ where: { id: params.id } });
  if (!p) return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
  if (p.premium) {
    const bought = await prisma.purchase.findUnique({ where: { userId_projectId: { userId: s.user.id, projectId: p.id } } });
    if (!bought && s.user.role !== "ADMIN") return NextResponse.json({ error: "Project belum dibeli" }, { status: 403 });
  }
  await prisma.project.update({ where: { id: p.id }, data: { downloads: { increment: 1 } } });
  return NextResponse.redirect(p.downloadUrl);
}
