import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json(await prisma.project.findMany({orderBy:{createdAt:"desc"}}));}
export async function POST(req:Request){const s:any=await getServerSession(authOptions as any); if(!s?.user?.id||s.user.role!=="ADMIN")return NextResponse.json({error:"Unauthorized"},{status:401}); const b=await req.json(); const p=await prisma.project.create({data:{name:b.name,description:b.description,category:b.category||"Other",photoUrl:b.photoUrl,downloadUrl:b.downloadUrl,premium:!!b.premium,price:Number(b.price||0),ownerId:s.user.id}}); return NextResponse.json(p);}
