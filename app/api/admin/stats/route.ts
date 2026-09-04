import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  const s: any = await getServerSession(authOptions as any);
  if (s?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [users, projects, premium, purchases, views, downloads] = await Promise.all([
    prisma.user.count(), prisma.project.count(), prisma.project.count({ where: { premium: true } }), prisma.purchase.count(), prisma.project.aggregate({ _sum: { views: true } }), prisma.project.aggregate({ _sum: { downloads: true } })
  ]);
  const top = await prisma.project.findMany({ orderBy: { views: "desc" }, take: 5, select: { id: true, name: true, views: true, downloads: true, price: true, premium: true } });
  return NextResponse.json({ users, projects, premium, purchases, views: views._sum.views || 0, downloads: downloads._sum.downloads || 0, top });
}
