import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

const messageSelect={sender:{select:{id:true,name:true,email:true,role:true}}};

export async function GET(req:Request){
 try{
  const u=await requireUser();
  const url=new URL(req.url);
  const chatId=url.searchParams.get("chatId");
  if(u.role==="ADMIN"){
   const chats=await prisma.chat.findMany({include:{user:{select:{id:true,name:true,email:true,role:true}},messages:{orderBy:{createdAt:"asc"},include:messageSelect}},orderBy:{lastMessageAt:"desc"}});
   if(chatId)await prisma.message.updateMany({where:{chatId,senderId:{not:u.id},read:false},data:{read:true}});
   return NextResponse.json(chats);
  }
  const chat=await prisma.chat.findUnique({where:{userId:u.id},include:{user:{select:{id:true,name:true,email:true,role:true}},messages:{orderBy:{createdAt:"asc"},include:messageSelect}}});
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
  if(text.length>2000)return NextResponse.json({error:"Pesan maksimal 2000 karakter."},{status:400});
  let chat;
  if(u.role==="ADMIN"){
   if(!chatId)return NextResponse.json({error:"Chat tidak ditemukan."},{status:400});
   chat=await prisma.chat.findUnique({where:{id:String(chatId)}});
   if(!chat)return NextResponse.json({error:"Chat tidak ditemukan."},{status:404});
  }else{
   chat=await prisma.chat.upsert({where:{userId:u.id},create:{userId:u.id},update:{}});
  }
  if(chat.status==="RESOLVED"&&u.role!=="ADMIN"){
   await prisma.chat.update({where:{id:chat.id},data:{status:"OPEN"}});
  }
  const message=await prisma.message.create({data:{chatId:chat.id,senderId:u.id,body:text}});
  await prisma.chat.update({where:{id:chat.id},data:{lastMessageAt:new Date(),status:"OPEN"}});
  return NextResponse.json(message,{status:201});
 }catch{return NextResponse.json({error:"Gagal mengirim pesan."},{status:500})}
}
