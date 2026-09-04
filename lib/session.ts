import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const session=()=>getServerSession(authOptions);
export async function requireUser(){const s=await session();if(!s?.user?.id)throw new Error("UNAUTHORIZED");return s.user;}
export async function requireAdmin(){const u=await requireUser();if((u as any).role!=="ADMIN")throw new Error("FORBIDDEN");return u;}
