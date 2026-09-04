import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
export async function GET(){const s:any=await getServerSession(authOptions as any);if(!s?.user?.id)return NextResponse.json({error:'Login required'},{status:401});const rows=await prisma.purchase.findMany({where:{userId:s.user.id},include:{project:true},orderBy:{createdAt:'desc'}});return NextResponse.json(rows.map(x=>x.project));}
