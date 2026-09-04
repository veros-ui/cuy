import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const category = url.searchParams.get("category") || "";
  const type = url.searchParams.get("type") || "";
  const sort = url.searchParams.get("sort") || "newest";
  const where: any = {};
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  if (category) where.category = category;
  if (type === "free") where.premium = false;
  if (type === "premium") where.premium = true;
  const orderBy: any = sort === "popular" ? { views: "desc" } : sort === "price-low" ? { price: "asc" } : sort === "price-high" ? { price: "desc" } : { createdAt: "desc" };
  const projects = await prisma.project.findMany({ where, orderBy, include: { owner: { select: { name: true, image: true, avatarBorder: true } } } });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const s: any = await getServerSession(authOptions as any);
  if (!s?.user?.id || s.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.name || !b.description || !b.downloadUrl) return NextResponse.json({ error: "Field wajib belum lengkap" }, { status: 400 });
  const p = await prisma.project.create({ data: { name: String(b.name).slice(0,120), description: String(b.description), category: b.category || "Other", photoUrl: b.photoUrl || null, downloadUrl: String(b.downloadUrl), premium: !!b.premium, price: Math.max(0, Number(b.price || 0)), ownerId: s.user.id } });
  return NextResponse.json(p);
}
