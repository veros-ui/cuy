import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";
export async function GET(){try{const u=await requireUser();const count=await prisma.message.count({where:{read:false,senderId:{not:u.id},...(u.role!=="ADMIN"?{chat:{userId:u.id}}:{})}});return NextResponse.json({count})}catch{return NextResponse.json({count:0})}}
