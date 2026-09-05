import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";

const publicProjectSelect={
 id:true,name:true,slug:true,description:true,category:true,tags:true,technology:true,license:true,requirements:true,installation:true,documentation:true,demoUrl:true,githubUrl:true,screenshots:true,coverUrl:true,premium:true,price:true,views:true,downloads:true,featured:true,status:true,version:true,changelog:true,ownerId:true,createdAt:true,updatedAt:true,
 owner:{select:{id:true,name:true,image:true}},
 reviews:{select:{rating:true}}
};

export async function GET(req:Request){
 try{
  const u=new URL(req.url);
  const q=u.searchParams.get("q")||"";
  const category=u.searchParams.get("category");
  const premium=u.searchParams.get("premium");
  const sort=u.searchParams.get("sort")||"new";
  const where:any={status:"PUBLISHED",...(q?{OR:[{name:{contains:q,mode:"insensitive"}},{description:{contains:q,mode:"insensitive"}},{tags:{contains:q,mode:"insensitive"}}]}:{})};
  if(category)where.category=category;
  if(premium!==null&&premium!=="")where.premium=premium==="true";
  const order:any=sort==="popular"?{downloads:"desc"}:sort==="views"?{views:"desc"}:sort==="price_asc"?{price:"asc"}:sort==="price_desc"?{price:"desc"}:{createdAt:sort==="old"?"asc":"desc"};
  const projects=await prisma.project.findMany({where,orderBy:order,select:publicProjectSelect,take:48});
  return NextResponse.json(projects);
 }catch{return NextResponse.json({error:"Gagal memuat marketplace."},{status:500})}
}

export async function POST(req:Request){
 try{
  const user=await requireUser();
  const d=await req.json();
  const name=String(d.name||"").trim();
  const description=String(d.description||"").trim();
  const downloadUrl=String(d.downloadUrl||"").trim();
  if(!name||!description||!downloadUrl)return NextResponse.json({error:"Nama, deskripsi, dan URL download wajib."},{status:400});
  if(name.length>160||description.length>20000)return NextResponse.json({error:"Data project terlalu panjang."},{status:400});
  const premium=d.premium===true||d.premium==="true"||d.premium===1||d.premium==="1";
  const price=Number(d.price);
  const normalizedPrice=Number.isInteger(price)?Math.max(0,price):0;
  const slug=(name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"project")+"-"+Date.now().toString(36);
  const p=await prisma.project.create({data:{name,slug,description,category:String(d.category||"Other"),tags:String(d.tags||""),technology:String(d.technology||""),license:String(d.license||"MIT"),requirements:String(d.requirements||""),installation:String(d.installation||""),documentation:d.documentation?String(d.documentation):null,demoUrl:d.demoUrl?String(d.demoUrl):null,githubUrl:d.githubUrl?String(d.githubUrl):null,screenshots:String(d.screenshots||""),coverUrl:d.coverUrl?String(d.coverUrl):null,downloadUrl,premium,price:normalizedPrice,ownerId:user.id}});
  return NextResponse.json(p,{status:201});
 }catch(e){return NextResponse.json({error:String(e).includes("UNAUTHORIZED")?"Login required":"Gagal membuat project."},{status:String(e).includes("UNAUTHORIZED")?401:500})}
}
