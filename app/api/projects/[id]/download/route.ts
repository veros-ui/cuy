import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET(_:Request,{params}:{params:{id:string}}){
 try{
  const u=await requireUser();
  const p=await prisma.project.findUnique({where:{id:params.id}});
  if(!p)return NextResponse.json({error:"Not found"},{status:404});
  if(p.premium&&(u.role!=="PREMIUM"&&u.role!=="ADMIN"))return NextResponse.json({error:"Premium membership required. Chat Admin untuk upgrade."},{status:403});
  await prisma.project.update({where:{id:p.id},data:{downloads:{increment:1}}});
  return NextResponse.redirect(p.downloadUrl);
 }catch{return NextResponse.json({error:"Login required"},{status:401})}
}
