"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSession,signOut} from "next-auth/react";

export default function Nav(){
 const {data}=useSession();
 const [unread,setUnread]=useState(0);
 useEffect(()=>{
  let live=true;
  async function load(){
   if(!data?.user){if(live)setUnread(0);return}
   try{const r=await fetch("/api/chats/unread",{cache:"no-store"});const x=await r.json();if(live)setUnread(Number(x.count)||0)}catch{if(live)setUnread(0)}
  }
  load();
  const timer=setInterval(load,10000);
  return()=>{live=false;clearInterval(timer)};
 },[data?.user]);
 const chatLabel=<span>Chat Admin{unread>0&&<span className="chatbadge">{unread>99?"99+":unread}</span>}</span>;
 return <header><Link href="/" className="brand">ProjectVault</Link><details className="hamburger"><summary>☰</summary><div className="menu">{data?.user?<><Link href="/">Marketplace</Link><Link href="/dashboard">Dashboard</Link><Link href="/wishlist">Wishlist</Link><Link href="/chat">{chatLabel}</Link><Link href="/premium">Premium</Link><Link href="/profile">Profile</Link>{data.user.role==="ADMIN"&&<><Link href="/admin">Admin</Link><Link href="/admin/chats">Manage Chats</Link></>}<button onClick={()=>signOut({callbackUrl:"/"})}>Logout</button></>:<><Link href="/">Marketplace</Link><Link href="/login">Login</Link><Link href="/register">Register</Link></>}</div></details><nav className="desktopnav"><Link href="/">Marketplace</Link>{data?.user?<><Link href="/dashboard">Dashboard</Link><Link href="/wishlist">Wishlist</Link><Link href="/chat">{chatLabel}</Link><Link href="/premium">Premium</Link><Link href="/profile">Profile</Link>{data.user.role==="ADMIN"&&<Link href="/admin">Admin</Link>}<button onClick={()=>signOut({callbackUrl:"/"})}>Logout</button></>:<><Link href="/login">Login</Link><Link className="btn" href="/register">Register</Link></>}</nav></header>
}
