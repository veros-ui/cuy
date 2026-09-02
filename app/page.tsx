import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";
import { PlusIcon } from "@/components/Icons";
export const dynamic="force-dynamic";
export default async function HomePage(){const session=await getServerSession(authOptions);if(!session)redirect("/login");const projects=await prisma.project.findMany({orderBy:{createdAt:"desc"},include:{owner:{select:{name:true,avatarUrl:true,image:true}}}});return <div className="container"><div className="page-header"><div><div className="page-title">Kumpulan Projek</div><div className="page-sub">Semua projek yang dibagikan oleh pengguna Projekku</div></div><Link href="/projects/new" className="btn btn-primary" style={{width:"auto",padding:"10px 18px"}}>Tambah Projek</Link></div>{projects.length===0?<div className="empty-state">Belum ada projek. Jadilah yang pertama menambahkan!</div>:<div className="grid">{projects.map(p=><ProjectCard key={p.id} name={p.name} description={p.description} function={p.function} photoUrl={p.photoUrl} ownerName={p.owner.name} ownerAvatar={p.owner.avatarUrl||p.owner.image}/>)}</div>}<Link href="/projects/new" className="fab" title="Tambah Projek"><PlusIcon/></Link></div>}
