import {PrismaAdapter} from "@next-auth/prisma-adapter";
import type {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import {prisma} from "./prisma";

const envAdmins=()=>new Set((process.env.ADMIN_EMAILS||process.env.ADMIN_EMAIL||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
const isAdminEmail=async(email:string)=>envAdmins().has(email.toLowerCase())||!!(await prisma.adminEmail.findUnique({where:{email:email.toLowerCase()}}));

export const authOptions:NextAuthOptions={
 adapter:PrismaAdapter(prisma),
 session:{strategy:"jwt"},
 providers:[
  CredentialsProvider({
   name:"Email",
   credentials:{email:{type:"email"},password:{type:"password"}},
   async authorize(c){
    if(!c?.email||!c.password)return null;
    const email=c.email.toLowerCase();
    const u=await prisma.user.findUnique({where:{email}});
    if(!u?.password||!(await bcrypt.compare(c.password,u.password)))return null;
    const admin=await isAdminEmail(email);
    if(admin&&u.role!=="ADMIN")await prisma.user.update({where:{id:u.id},data:{role:"ADMIN"}});
    return {id:u.id,email:u.email,name:u.name,role:admin?"ADMIN":u.role};
   }
  }),
  GoogleProvider({clientId:process.env.GOOGLE_CLIENT_ID||"",clientSecret:process.env.GOOGLE_CLIENT_SECRET||""})
 ],
 callbacks:{
  async signIn({user}){
   if(user.email&&user.id&&await isAdminEmail(user.email))
    await prisma.user.update({where:{id:user.id},data:{role:"ADMIN"}});
   return true;
  },
  async jwt({token,user}){
   if(user){
    token.id=user.id;
    if(user.email)token.email=user.email.toLowerCase();
   }
   const email=String(token.email||"").toLowerCase();
   if(email){
    const admin=await isAdminEmail(email);
    if(admin){
     token.role="ADMIN";
    }else if(token.id){
     const dbUser=await prisma.user.findUnique({where:{id:String(token.id)},select:{role:true}});
     token.role=dbUser?.role||"USER";
    }else{
     token.role="USER";
    }
   }else{
    token.role="USER";
   }
   return token;
  },
  async session({session,token}){
   if(session.user){
    session.user.id=String(token.id||"");
    session.user.role=String(token.role||"USER");
   }
   return session;
  }
 },
 pages:{signIn:"/login"}
};
