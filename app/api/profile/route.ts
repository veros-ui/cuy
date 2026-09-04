import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, bio: true, avatarBorder: true, role: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 32) : "";
    const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 160) : "";
    const image = typeof body.image === "string" ? body.image : null;
    const allowedBorders = ["solid", "double", "glow", "dashed"];
    const avatarBorder = allowedBorders.includes(body.avatarBorder) ? body.avatarBorder : "solid";

    if (!name) return NextResponse.json({ error: "Username wajib diisi" }, { status: 400 });
    if (image && image.length > 2200000) return NextResponse.json({ error: "Foto terlalu besar" }, { status: 400 });

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, bio, image, avatarBorder },
      select: { id: true, name: true, email: true, image: true, bio: true, avatarBorder: true, role: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan profil" }, { status: 500 });
  }
}
