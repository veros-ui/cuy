import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
export const metadata: Metadata = { title: "Projekku — Kumpulan Projek", description: "Platform untuk menampilkan kumpulan projek secara profesional" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="id"><body><Providers><Navbar />{children}</Providers></body></html>); }
