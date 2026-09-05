import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

export async function GET(){
 try{
  const u=await requireUser();
  if(u.role==="ADMIN"){
   const chats=await prisma.chat.findMany({include:{user:{select:{id:true,name:true,email:true,role:true}},messages:{orderBy:{createdAt:"asc"},include:{sender:{select:{id:true,name:true,email:true,role:true}}}}},orderBy:{lastMessageAt:"desc"}});
   await prisma.message.updateMany({where:{chatId:{in:chats.map(c=>c.id)},senderId:{not:u.id},read:false},data:{read:true}});
   return NextResponse.json(chats);
  }
  const chat=await prisma.chat.findUnique({where:{userId:u.id},include:{user:{select:{id:true,name:true,email:true,role:true}},messages:{orderBy:{createdAt:"asc"},include:{sender:{select:{id:true,name:true,email:true,role:true}}}}}});
  if(chat)await prisma.message.updateMany({where:{chatId:chat.id,senderId:{not:u.id},read:false},data:{read:true}});
  return NextResponse.json(chat);
 }catch{return NextResponse.json({error:"Login required"},{status:401})}
}

export async function POST(req:Request){
 try{
  const u=await requireUser();
  const {body,chatId}=await req.json();
  const text=String(body||"").trim();
  if(!text)return NextResponse.json({error:"Pesan tidak boleh kosong."},{status:400});
  let chat;
  if(u.role==="ADMIN"){
   if(!chatId)return NextResponse.json({error:"Chat tidak ditemukan."},{status:400});
   chat=await prisma.chat.findUnique({where:{id:String(chatId)}});
   if(!chat)return NextResponse.json({error:"Chat tidak ditemukan."},{status:404});
  }else{
   chat=await prisma.chat.upsert({where:{userId:u.id},create:{userId:u.id},update:{}});
  }
  const message=await prisma.message.create({data:{chatId:chat.id,senderId:u.id,body:text}});
  await prisma.chat.update({where:{id:chat.id},data:{lastMessageAt:new Date(),status:"OPEN"}});
  return NextResponse.json(message,{status:201});
 }catch{return NextResponse.json({error:"Gagal mengirim pesan."},{status:500})}
}
