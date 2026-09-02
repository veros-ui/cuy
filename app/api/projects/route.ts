import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(){const projects=await prisma.project.findMany({orderBy:{createdAt:"desc"},include:{owner:{select:{name:true,avatarUrl:true,image:true}}}});return NextResponse.json(projects)}
export async function POST(req:Request){const session=await getServerSession(authOptions);if(!session?.user?.id)return NextResponse.json({error:"Harus login"},{status:401});const{name,description,function:fungsi,photoUrl}=await req.json();if(!name||!description||!fungsi)return NextResponse.json({error:"Nama, deskripsi, dan fungsi wajib diisi"},{status:400});const project=await prisma.project.create({data:{name,description,function:fungsi,photoUrl:photoUrl||null,ownerId:session.user.id}});return NextResponse.json(project,{status:201})}