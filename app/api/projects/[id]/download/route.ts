import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

export async function GET(_:Request,{params}:{params:{id:string}}){
 try{
  const u=await requireUser();
  const p=await prisma.project.findFirst({where:{id:params.id,status:"PUBLISHED"},select:{id:true,premium:true,downloadUrl:true}});
  if(!p)return NextResponse.json({error:"Project tidak ditemukan."},{status:404});
  if(p.premium&&u.role!=="ADMIN"&&u.role!=="PREMIUM")return NextResponse.json({error:"Project Premium membutuhkan role PREMIUM."},{status:403});
  await prisma.project.update({where:{id:p.id},data:{downloads:{increment:1}}});
  return NextResponse.redirect(p.downloadUrl);
 }catch{return NextResponse.json({error:"Login required"},{status:401})}
}
