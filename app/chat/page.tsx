"use client";
import {useEffect,useState} from "react";

export default function ChatPage(){
 const [chat,setChat]=useState<any>(null);const [body,setBody]=useState("");const [loading,setLoading]=useState(true);const [msg,setMsg]=useState("");
 async function load(){const r=await fetch("/api/chats");const x=await r.json();if(r.ok)setChat(x);else setMsg(x.error||"Login required");setLoading(false)}
 useEffect(()=>{load()},[]);
 async function send(e:React.FormEvent){e.preventDefault();if(!body.trim())return;const r=await fetch("/api/chats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body})});const x=await r.json();if(!r.ok){setMsg(x.error||"Gagal mengirim");return}setBody("");setMsg("");load()}
 if(loading)return <div className="panel">Loading…</div>;
 return <div><h1>Chat Admin</h1><div className="panel"><p className="muted">Chat langsung dengan admin. Setiap pesan menampilkan username pengirim.</p><div className="chatbox">{chat?.messages?.length?chat.messages.map((m:any)=><div key={m.id} className={`chatmsg ${m.senderId===chat.userId?"mine":"theirs"}`}><b>{m.sender?.role==="ADMIN"?"Admin":`@${m.sender?.name||m.sender?.email?.split("@")[0]||"user"}`}</b><div>{m.body}</div><small>{new Date(m.createdAt).toLocaleString("id-ID")}</small></div>):<p className="muted">Belum ada pesan. Kirim pesan pertama ke admin.</p>}</div><form className="chatform" onSubmit={send}><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Tulis pesan ke admin…" maxLength={2000}/><button>Kirim</button></form>{msg&&<p className="danger">{msg}</p>}</div></div>
}
