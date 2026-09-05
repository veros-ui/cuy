import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

export async function POST(req:Request,{params}:{params:{id:string}}){
 try{
  const u=await requireUser();
  const project=await prisma.project.findFirst({where:{id:params.id,status:"PUBLISHED"},select:{id:true,premium:true}});
  if(!project)return NextResponse.json({error:"Project tidak ditemukan."},{status:404});
  const d=await req.json();
  const body=String(d.body||"").trim();
  if(!body)return NextResponse.json({error:"Review tidak boleh kosong."},{status:400});
  if(body.length>2000)return NextResponse.json({error:"Review maksimal 2000 karakter."},{status:400});
  const rating=Number(d.rating);
  if(!Number.isInteger(rating)||rating<1||rating>5)return NextResponse.json({error:"Rating harus 1 sampai 5."},{status:400});
  const r=await prisma.review.upsert({where:{userId_projectId:{userId:u.id,projectId:project.id}},create:{userId:u.id,projectId:project.id,rating,body},update:{rating,body}});
  return NextResponse.json(r);
 }catch{return NextResponse.json({error:"Gagal menyimpan review."},{status:500})}
}
