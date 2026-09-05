import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

export async function PATCH(req:Request,{params}:{params:{id:string}}){
 try{
  const u=await requireUser();
  const chat=await prisma.chat.findUnique({where:{id:params.id}});
  if(!chat)return NextResponse.json({error:"Chat tidak ditemukan."},{status:404});
  if(u.role!=="ADMIN"&&chat.userId!==u.id)return NextResponse.json({error:"Forbidden"},{status:403});
  const {status}=await req.json();
  if(u.role!=="ADMIN"||!['OPEN','RESOLVED'].includes(status))return NextResponse.json({error:"Admin only"},{status:403});
  const updated=await prisma.chat.update({where:{id:params.id},data:{status}});
  return NextResponse.json(updated);
 }catch{return NextResponse.json({error:"Gagal mengubah chat."},{status:500})}
}
