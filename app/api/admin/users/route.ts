import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireAdmin} from "@/lib/session";

const ADMIN="ADMIN";
const PREMIUM="PREMIUM";
const USER="USER";

export async function GET(){
 try{
  await requireAdmin();
  const users=await prisma.user.findMany({select:{id:true,name:true,email:true,role:true,createdAt:true},orderBy:{createdAt:"desc"}});
  return NextResponse.json(users);
 }catch{return NextResponse.json({error:"Admin only"},{status:403})}
}

export async function PATCH(req:Request){
 try{
  const current=await requireAdmin();
  const {userId,role}=await req.json();
  if(!userId||![USER,PREMIUM,ADMIN].includes(role))return NextResponse.json({error:"Role tidak valid."},{status:400});
  const target=await prisma.user.findUnique({where:{id:userId},select:{id:true,email:true,role:true}});
  if(!target)return NextResponse.json({error:"User tidak ditemukan."},{status:404});
  if(target.id===current.id&&role!==ADMIN)return NextResponse.json({error:"Admin yang sedang login tidak bisa menurunkan rolenya sendiri."},{status:400});
  const email=String(target.email||"").toLowerCase();
  const envAdmins=new Set((process.env.ADMIN_EMAILS||process.env.ADMIN_EMAIL||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
  if(envAdmins.has(email)&&role!==ADMIN)return NextResponse.json({error:"Admin dari environment variable tidak bisa diturunkan."},{status:400});
  const user=await prisma.user.update({where:{id:userId},data:{role},select:{id:true,name:true,email:true,role:true}});
  return NextResponse.json(user);
 }catch{return NextResponse.json({error:"Gagal mengubah role."},{status:500})}
}
