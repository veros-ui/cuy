import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";
export async function DELETE(_:Request,{params}:{params:{id:string}}){const s:any=await getServerSession(authOptions as any);if(s?.user?.role!=="ADMIN")return NextResponse.json({error:"Unauthorized"},{status:401});await prisma.project.delete({where:{id:params.id}});return NextResponse.json({ok:true});}
export async function PATCH(req:Request,{params}:{params:{id:string}}){const s:any=await getServerSession(authOptions as any);if(s?.user?.role!=="ADMIN")return NextResponse.json({error:"Unauthorized"},{status:401});const b=await req.json();return NextResponse.json(await prisma.project.update({where:{id:params.id},data:b}));}