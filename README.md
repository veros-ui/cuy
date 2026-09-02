# Projekku

Platform kumpulan projek dengan login Google / Email & Password, database Neon Postgres, dan tema modern hitam.

## Fitur
- Login dengan Google (OAuth) atau Email & Password (bisa daftar akun baru)
- Database Neon Postgres (via Prisma ORM)
- Halaman utama menampilkan kumpulan projek (foto, nama, deskripsi, fungsi)
- Edit profil: nama & avatar (pilih dari galeri, avatar tampil dengan border)
- Tema modern hitam, ikon menggunakan SVG (bukan emoji)

## Setup
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Isi `.env` berdasarkan `.env.example`. Jangan commit secrets.
