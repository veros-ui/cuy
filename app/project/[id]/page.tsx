"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [p, setP] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetch(`/api/projects/${params.id}`).then(r => r.json()).then(setP); }, [params.id]);
  useEffect(() => { if (session) fetch('/api/wishlist').then(r => r.ok ? r.json() : []).then((xs:any[]) => setSaved(xs.some(x => x.id === params.id))); }, [session, params.id]);
  if (!p) return <main className="page"><div className="loading-card">Loading project...</div></main>;
  async function wishlist() { if (!session) { location.href = '/login'; return; } const r = await fetch('/api/wishlist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({projectId:p.id}) }); if(r.ok) setSaved((v)=>!v); }
  return <main><header><Link className="brand" href="/">KINGDAPA<span>-HIZ</span></Link><nav><Link href="/">Store</Link>{session && <Link href="/profile">Profile</Link>}</nav></header><section className="detail"><div className="detail-cover">{p.photoUrl ? <img src={p.photoUrl} alt=""/> : <div className="cover-placeholder">KH</div>}</div><div className="detail-copy"><div className="tag">{p.category} · {p.premium ? 'PREMIUM' : 'FREE'}</div><h1>{p.name}</h1><p className="lead">{p.description}</p><div className="creator"><div className="avatar"><img src={p.owner?.image || '/'} alt="" onError={(e:any)=>e.currentTarget.style.display='none'}/></div><div><small>CREATED BY</small><strong>{p.owner?.name || 'Anonymous'}</strong></div></div><div className="detail-actions"><button className="primary" onClick={()=>location.href=p.premium?`/checkout/${p.id}`:`/api/download/${p.id}`}>{p.premium?`Beli · Rp ${p.price.toLocaleString('id-ID')}`:'Download gratis'}</button><button className="ghost" onClick={wishlist}>{saved?'Tersimpan':'Wishlist'}</button></div><div className="stats"><span>{p.views} views</span><span>{p.downloads} downloads</span></div></div></section></main>;
}
