import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function POST(req:Request){
 try{
  const u=await requireUser();
  const {projectId}=await req.json();
  const p=await prisma.project.findUnique({where:{id:projectId}});
  if(!p)return NextResponse.json({error:"Not found"},{status:404});
  if(!p.premium)return NextResponse.json({url:`/projects/${p.id}`});
  if(u.role==="ADMIN"||u.role==="PREMIUM")return NextResponse.json({url:`/api/projects/${p.id}/download`});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY||"");
  const s=await stripe.checkout.sessions.create({mode:"payment",line_items:[{price_data:{currency:"usd",product_data:{name:p.name,description:p.description.slice(0,300)},unit_amount:p.price},quantity:1}],success_url:`${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${process.env.NEXTAUTH_URL}/checkout/cancel`,metadata:{userId:u.id,projectId:p.id}});
  return NextResponse.json({url:s.url});
 }catch{return NextResponse.json({error:"Stripe belum dikonfigurasi atau checkout gagal."},{status:500})}
}
