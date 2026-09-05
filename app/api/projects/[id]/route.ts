import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

const EDITABLE_FIELDS=["name","description","category","tags","technology","license","requirements","installation","documentation","demoUrl","githubUrl","screenshots","coverUrl","downloadUrl","premium","price","featured","status","version","changelog"] as const;
const ALLOWED_STATUS=new Set(["DRAFT","PUBLISHED","ARCHIVED"]);

function buildUpdate(input:any){
 const d:any={};
 for(const key of EDITABLE_FIELDS)if(Object.prototype.hasOwnProperty.call(input,key))d[key]=input[key];
 if(Object.prototype.hasOwnProperty.call(d,"name")){d.name=String(d.name||"").trim();if(!d.name)return {error:"Nama project wajib diisi."};if(d.name.length>160)return {error:"Nama project terlalu panjang."};}
 if(Object.prototype.hasOwnProperty.call(d,"description")){d.description=String(d.description||"").trim();if(!d.description)return {error:"Deskripsi wajib diisi."};if(d.description.length>20000)return {error:"Deskripsi terlalu panjang."};}
 if(Object.prototype.hasOwnProperty.call(d,"premium"))d.premium=Boolean(d.premium);
 if(Object.prototype.hasOwnProperty.call(d,"price")){const price=Number(d.price);if(!Number.isInteger(price)||price<0)return {error:"Harga tidak valid."};d.price=price;}
 if(Object.prototype.hasOwnProperty.call(d,"status")){d.status=String(d.status);if(!ALLOWED_STATUS.has(d.status))return {error:"Status project tidak valid."};}
 return {data:d};
}

export async function GET(_:Request,{params}:{params:{id:string}}){
 try{
  const p=await prisma.project.findFirst({where:{id:params.id,status:"PUBLISHED"},select:{id:true,name:true,slug:true,description:true,category:true,tags:true,technology:true,license:true,requirements:true,installation:true,documentation:true,demoUrl:true,githubUrl:true,screenshots:true,coverUrl:true,premium:true,price:true,views:true,downloads:true,featured:true,status:true,version:true,changelog:true,ownerId:true,createdAt:true,updatedAt:true,owner:{select:{id:true,name:true,image:true,bio:true}},reviews:{select:{id:true,rating:true,body:true,helpful:true,createdAt:true,user:{select:{name:true,image:true}}},orderBy:{createdAt:"desc"}}}});
  if(!p)return NextResponse.json({error:"Not found"},{status:404});
  await prisma.project.update({where:{id:p.id},data:{views:{increment:1}}});
  return NextResponse.json(p);
 }catch{return NextResponse.json({error:"Project gagal dimuat."},{status:500})}
}

export async function PATCH(req:Request,{params}:{params:{id:string}}){
 try{
  const u=await requireUser();
  const p=await prisma.project.findUnique({where:{id:params.id},select:{id:true,ownerId:true}});
  if(!p||!(p.ownerId===u.id||u.role==="ADMIN"))return NextResponse.json({error:"Forbidden"},{status:403});
  const result=buildUpdate(await req.json());
  if("error" in result)return NextResponse.json({error:result.error},{status:400});
  if(!Object.keys(result.data).length)return NextResponse.json({error:"Tidak ada perubahan."},{status:400});
  const updated=await prisma.project.update({where:{id:p.id},data:result.data});
  return NextResponse.json(updated);
 }catch{return NextResponse.json({error:"Gagal memperbarui project."},{status:500})}
}

export async function DELETE(_:Request,{params}:{params:{id:string}}){
 try{
  const u=await requireUser();
  const p=await prisma.project.findUnique({where:{id:params.id},select:{id:true,ownerId:true}});
  if(!p||!(p.ownerId===u.id||u.role==="ADMIN"))return NextResponse.json({error:"Forbidden"},{status:403});
  await prisma.project.delete({where:{id:p.id}});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Gagal menghapus project."},{status:500})}
}
