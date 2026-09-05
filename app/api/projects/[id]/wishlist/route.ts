import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

export async function POST(_:Request,{params}:{params:{id:string}}){
 try{
  const u=await requireUser();
  const project=await prisma.project.findUnique({where:{id:params.id,status:"PUBLISHED"},select:{id:true}});
  if(!project)return NextResponse.json({error:"Project tidak ditemukan."},{status:404});
  const existing=await prisma.wishlist.findUnique({where:{userId_projectId:{userId:u.id,projectId:project.id}}});
  if(existing){await prisma.wishlist.delete({where:{id:existing.id}});return NextResponse.json({saved:false});}
  await prisma.wishlist.create({data:{userId:u.id,projectId:project.id}});
  return NextResponse.json({saved:true});
 }catch{return NextResponse.json({error:"Gagal memperbarui wishlist."},{status:500})}
}
