"use client";
import {useEffect,useState} from "react";

type Chat={id:string;status:string;user:{id:string;name:string|null;email:string|null;role:string};messages:any[]};
export default function AdminChats(){
 const [chats,setChats]=useState<Chat[]>([]);const [selected,setSelected]=useState<string>("");const [body,setBody]=useState("");const [msg,setMsg]=useState("");
 async function load(){const r=await fetch("/api/chats");const x=await r.json();if(r.ok){setChats(x);if(!selected&&x[0])setSelected(x[0].id)}else setMsg(x.error||"Admin only")}
 useEffect(()=>{load()},[]);
 const chat=chats.find(x=>x.id===selected);
 async function send(e:React.FormEvent){e.preventDefault();if(!chat||!body.trim())return;const r=await fetch("/api/chats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:chat.id,body})});const x=await r.json();if(!r.ok){setMsg(x.error||"Gagal mengirim");return}setBody("");load()}
 async function resolve(){if(!chat)return;await fetch(`/api/chats/${chat.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:chat.status==="RESOLVED"?"OPEN":"RESOLVED"})});load()}
 return <div><h1>Chat Admin</h1><div className="chatlayout"><div className="chatlist">{chats.length?chats.map(c=><button key={c.id} className={`chatitem ${selected===c.id?"active":""}`} onClick={()=>setSelected(c.id)}><b>@{c.user.name||c.user.email?.split("@")[0]||"user"}</b><span>{c.messages[c.messages.length-1]?.body||"Belum ada pesan"}</span><small>{c.status}</small></button>):<div className="panel">Belum ada chat.</div>}</div><div className="panel chatpanel">{chat?<><div className="row"><div><h2 style={{margin:"0 0 4px"}}>@{chat.user.name||chat.user.email?.split("@")[0]||"user"}</h2><span className="muted">{chat.user.email||"No email"} · {chat.user.role}</span></div><button onClick={resolve}>{chat.status==="RESOLVED"?"Buka lagi":"Selesaikan"}</button></div><div className="chatbox">{chat.messages.map(m=><div key={m.id} className={`chatmsg ${m.sender?.role==="ADMIN"?"mine":"theirs"}`}><b>{m.sender?.role==="ADMIN"?"Admin":`@${m.sender?.name||m.sender?.email?.split("@")[0]||"user"}`}</b><div>{m.body}</div><small>{new Date(m.createdAt).toLocaleString("id-ID")}</small></div>)}</div><form className="chatform" onSubmit={send}><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Balas sebagai Admin…" maxLength={2000}/><button>Kirim</button></form></>:<p className="muted">Pilih chat.</p>}{msg&&<p className="danger">{msg}</p>}</div></div></div>
}
