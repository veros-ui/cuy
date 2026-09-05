import {NextResponse} from "next/server";
import {Prisma} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

export async function GET(){
 try{
  const u=await requireUser();
  const user=await prisma.user.findUnique({where:{id:u.id},select:{id:true,name:true,email:true,image:true,bio:true,avatarBorder:true,role:true,createdAt:true,_count:{select:{projects:true,purchases:true,followers:true}}}});
  return user?NextResponse.json(user):NextResponse.json({error:"User tidak ditemukan."},{status:404});
 }catch{return NextResponse.json({error:"Login required"},{status:401})}
}

export async function PATCH(req:Request){
 try{
  const u=await requireUser();
  const d=await req.json();
  if(!d||typeof d!=="object"||Array.isArray(d))return NextResponse.json({error:"Body tidak valid."},{status:400});
  const data:Prisma.UserUpdateInput={};
  if(Object.prototype.hasOwnProperty.call(d,"name")){const name=String(d.name||"").trim();if(!name||name.length>60)return NextResponse.json({error:"Username wajib dan maksimal 60 karakter."},{status:400});data.name=name;}
  if(Object.prototype.hasOwnProperty.call(d,"bio")){const bio=String(d.bio||"").trim();if(bio.length>1000)return NextResponse.json({error:"Bio maksimal 1000 karakter."},{status:400});data.bio=bio||null;}
  if(Object.prototype.hasOwnProperty.call(d,"image")){const image=String(d.image||"").trim();if(image.length>2000)return NextResponse.json({error:"URL avatar terlalu panjang."},{status:400});data.image=image||null;}
  if(Object.prototype.hasOwnProperty.call(d,"avatarBorder")){const border=String(d.avatarBorder||"solid");if(!["solid","circle","none"].includes(border))return NextResponse.json({error:"Avatar border tidak valid."},{status:400});data.avatarBorder=border;}
  if(!Object.keys(data).length)return NextResponse.json({error:"Tidak ada perubahan."},{status:400});
  const user=await prisma.user.update({where:{id:u.id},data,select:{id:true,name:true,email:true,image:true,bio:true,avatarBorder:true,role:true}});
  return NextResponse.json(user);
 }catch(e){return NextResponse.json({error:String(e).includes("UNAUTHORIZED")?"Login required":"Gagal memperbarui profile."},{status:String(e).includes("UNAUTHORIZED")?401:500})}
}
