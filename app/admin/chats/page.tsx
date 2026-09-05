"use client";
import {useEffect,useState} from "react";

type Chat={id:string;status:string;user:{id:string;name:string|null;email:string|null;role:string};messages:any[]};

function username(u:{name:string|null;email:string|null}){return u.name?.trim()||u.email?.split("@")[0]||"user"}

export default function AdminChats(){
 const [chats,setChats]=useState<Chat[]>([]);
 const [selected,setSelected]=useState<string>("");
 const [body,setBody]=useState("");
 const [msg,setMsg]=useState("");
 const [loading,setLoading]=useState(true);

 async function load(chatId?:string){
  setLoading(true);
  try{
   const url=chatId?`/api/chats?chatId=${encodeURIComponent(chatId)}`:"/api/chats";
   const r=await fetch(url,{cache:"no-store"});
   const x=await r.json();
   if(r.ok){setChats(x);if(!selected&&x[0])setSelected(x[0].id);setMsg("");}
   else setMsg(x.error||"Admin only");
  }catch{setMsg("Gagal memuat chat.")}
  finally{setLoading(false)}
 }

 useEffect(()=>{load()},[]);

 const chat=chats.find(x=>x.id===selected);
 async function selectChat(id:string){setSelected(id);await load(id)}
 async function send(e:React.FormEvent){
  e.preventDefault();
  if(!chat||!body.trim())return;
  const r=await fetch("/api/chats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:chat.id,body})});
  const x=await r.json();
  if(!r.ok){setMsg(x.error||"Gagal mengirim");return}
  setBody("");setMsg("");await load(chat.id);
 }
 async function resolve(){
  if(!chat)return;
  const next=chat.status==="RESOLVED"?"OPEN":"RESOLVED";
  const r=await fetch(`/api/chats/${chat.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:next})});
  if(!r.ok){const x=await r.json();setMsg(x.error||"Gagal mengubah status");return}
  await load(chat.id);
 }
 return <div><h1>Chat Admin</h1><p className="muted">Pilih user untuk melihat dan membalas percakapan.</p><div className="chatlayout"><div className="chatlist">{chats.length?chats.map(c=><button key={c.id} className={`chatitem ${selected===c.id?"active":""}`} onClick={()=>selectChat(c.id)}><b>@{username(c.user)}</b><span>{c.messages[c.messages.length-1]?.body||"Belum ada pesan"}</span><small>{c.status}</small></button>):<div className="panel">{loading?"Memuat…":"Belum ada chat."}</div>}</div><div className="panel chatpanel">{chat?<><div className="row"><div><h2 style={{margin:"0 0 4px"}}>@{username(chat.user)}</h2><span className="muted">{chat.user.email||"No email"} · {chat.user.role}</span></div><button onClick={resolve}>{chat.status==="RESOLVED"?"Buka lagi":"Selesaikan"}</button></div><div className="chatbox">{chat.messages.map(m=><div key={m.id} className={`chatmsg ${m.sender?.role==="ADMIN"?"mine":"theirs"}`}><b>{m.sender?.role==="ADMIN"?"@admin":`@${username(m.sender||{})}`}</b><div>{m.body}</div><small>{new Date(m.createdAt).toLocaleString("id-ID")}</small></div>)}</div><form className="chatform" onSubmit={send}><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Balas sebagai @admin…" maxLength={2000}/><button>Kirim</button></form></>:<p className="muted">Pilih chat.</p>}{msg&&<p className="danger">{msg}</p>}</div></div></div>
}
