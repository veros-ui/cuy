"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const borders = ["solid", "double", "glow", "dashed"];

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", bio: "", image: "", avatarBorder: "solid" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated") {
      fetch("/api/profile").then(r => r.json()).then(data => {
        setForm({ name: data.name || "", bio: data.bio || "", image: data.image || "", avatarBorder: data.avatarBorder || "solid" });
        setLoading(false);
      });
    }
  }, [status, router]);

  function choosePhoto(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 512;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        setForm(v => ({ ...v, image: canvas.toDataURL("image/webp", 0.82) }));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage("");
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setMessage(data.error || "Gagal menyimpan");
    setForm({ name: data.name || "", bio: data.bio || "", image: data.image || "", avatarBorder: data.avatarBorder || "solid" });
    await update();
    setMessage("Profil tersimpan");
  }

  if (status !== "authenticated" || loading) return <main className="profile-page"><div className="profile-loading">Loading profile...</div></main>;

  const initials = (form.name || session.user?.email || "U").slice(0, 2).toUpperCase();
  return <main className="profile-page">
    <header><a className="brand" href="/">KINGDAPA<span>-HIZ</span></a><nav><a href="/">Store</a>{session.user?.role === "ADMIN" && <a href="/admin">Admin</a>}</nav></header>
    <section className="profile-shell">
      <a className="back" href="/">← Back to store</a>
      <div className="profile-grid">
        <aside className="profile-card">
          <div className={`avatar avatar-${form.avatarBorder}`}>{form.image ? <img src={form.image} alt="Profile" /> : <span>{initials}</span>}</div>
          <h1>{form.name || "Unnamed user"}</h1>
          <p className="profile-email">{session.user?.email}</p>
          <p className="profile-bio">{form.bio || "Belum ada bio."}</p>
          <div className="profile-meta"><span>{session.user?.role === "ADMIN" ? "ADMIN" : "MEMBER"}</span><span>PROJECT VAULT</span></div>
        </aside>
        <form className="panel profile-form" onSubmit={save}>
          <div className="section-head"><div><p className="eyebrow">ACCOUNT</p><h2>Edit profile</h2></div></div>
          <div className="photo-picker">
            <div className={`mini-avatar avatar-${form.avatarBorder}`}>{form.image ? <img src={form.image} alt="Preview" /> : <span>{initials}</span>}</div>
            <div><strong>Profile picture</strong><p>Pilih foto dari galeri/file. Otomatis dipotong jadi 1:1.</p><button type="button" className="ghost" onClick={() => fileRef.current?.click()}>Choose image</button><input ref={fileRef} hidden type="file" accept="image/*" onChange={e => choosePhoto(e.target.files?.[0])} /></div>
          </div>
          <label>Username<input value={form.name} maxLength={32} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} placeholder="Nama yang tampil di profil" required /></label>
          <label>Bio<textarea value={form.bio} maxLength={160} onChange={e => setForm(v => ({ ...v, bio: e.target.value }))} placeholder="Tulis sedikit tentang kamu..." rows={4} /></label>
          <label>Avatar border<select value={form.avatarBorder} onChange={e => setForm(v => ({ ...v, avatarBorder: e.target.value }))}>{borders.map(b => <option key={b} value={b}>{b[0].toUpperCase() + b.slice(1)}</option>)}</select></label>
          {message && <p className={message === "Profil tersimpan" ? "success" : "error"}>{message}</p>}
          <button className="primary" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </form>
      </div>
    </section>
  </main>;
}
