"use client";
import {useEffect,useState} from "react";

type AdminEmail={id:string;email:string;source:"ENV"|"DATABASE"};

export default function Admin(){
 const [d,setD]=useState<any>();
 const [admins,setAdmins]=useState<AdminEmail[]>([]);
 const [email,setEmail]=useState("");
 const [msg,setMsg]=useState("");
 const [busy,setBusy]=useState(false);
 async function loadAdmins(){const r=await fetch("/api/admin/emails");const x=await r.json();if(r.ok)setAdmins(x);else setMsg(x.error||"Admin only")}
 useEffect(()=>{fetch("/api/admin").then(r=>r.json()).then(setD);loadAdmins()},[]);
 async function addAdmin(e:React.FormEvent){e.preventDefault();setMsg("");setBusy(true);const r=await fetch("/api/admin/emails",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});const x=await r.json();setBusy(false);if(!r.ok){setMsg(x.error||"Gagal menambahkan admin");return}setEmail("");setMsg(`${x.email} sekarang menjadi admin.`);loadAdmins()}
 async function removeAdmin(target:string){if(!confirm(`Hapus ${target} dari daftar admin?`))return;setMsg("");setBusy(true);const r=await fetch("/api/admin/emails",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:target})});const x=await r.json();setBusy(false);if(!r.ok){setMsg(x.error||"Gagal menghapus admin");return}setMsg(`${target} bukan admin lagi.`);loadAdmins()}
 if(!d)return <div className="panel">Admin only / loading…</div>;
 return <><h1>Admin Dashboard</h1><div className="stats">{[[d.users,"Users"],[d.projects,"Projects"],[d.transactions,"Transactions"],[d.downloads,"Downloads"],[d.views,"Views"],[`$${(d.revenue/100).toFixed(2)}`,"Revenue"]].map(([n,l])=><div className="stat" key={l}><b>{n}</b>{l}</div>)}</div><div className="panel"><h2>Admin access</h2><p>Tambahkan email di sini. Email tersebut otomatis mendapat role ADMIN saat login atau saat akun dibuat.</p><form className="form" onSubmit={addAdmin}><input type="email" required value={email} onChange={e=>setEmail(e.target.value.toLowerCase())} placeholder="admin@example.com"/><button disabled={busy}>Tambah admin</button></form>{msg&&<p>{msg}</p>}<div className="list">{admins.map(a=><div className="panel" key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}><div><b>{a.email}</b><div className="muted">{a.source === "ENV" ? "Environment admin" : "Added from dashboard"}</div></div>{a.source === "DATABASE"&&<button type="button" disabled={busy} onClick={()=>removeAdmin(a.email)}>Hapus</button>}</div>)}</div></div><div className="panel"><h2>Moderation controls</h2><p>Project status, featured flag, coupons, reports, users, transactions, audit/analytics models are included in the data layer. Add operational admin CRUD as needed for your deployment policy.</p></div></>}
