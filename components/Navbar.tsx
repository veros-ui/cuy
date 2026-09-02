"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { UserIcon, LogoutIcon } from "./Icons";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <span className="brand-dot" />
          Projekku
        </Link>

        {session?.user && (
          <div className="nav-links">
            <Link href="/">Beranda</Link>
            <Link href="/projects/new">Tambah Projek</Link>
            <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <UserIcon size={15} />
              Profil
            </Link>
            <button
              className="icon-btn"
              title="Keluar"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogoutIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
