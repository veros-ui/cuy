import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function DELETE(req:Request,{params}:{params:{id:string}}){const session=await getServerSession(authOptions);if(!session?.user?.id)return NextResponse.json({error:"Harus login"},{status:401});const project=await prisma.project.findUnique({where:{id:params.id}});if(!project||project.ownerId!==session.user.id)return NextResponse.json({error:"Tidak diizinkan"},{status:403});await prisma.project.delete({where:{id:params.id}});return NextResponse.json({success:true})}