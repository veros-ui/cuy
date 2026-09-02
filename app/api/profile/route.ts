import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function PUT(req:Request){const session=await getServerSession(authOptions);if(!session?.user?.id)return NextResponse.json({error:"Harus login"},{status:401});const{name,bio,avatarUrl}=await req.json();const user=await prisma.user.update({where:{id:session.user.id},data:{name:name??undefined,bio:bio??undefined,avatarUrl:avatarUrl??undefined}});return NextResponse.json({name:user.name,bio:user.bio,avatarUrl:user.avatarUrl})}