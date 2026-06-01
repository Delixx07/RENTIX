# Rentix 🚀

> **Sewa Aman, Pakai Nyaman.** — Platform marketplace penyewaan gadget dan peralatan event terpercaya.

![Rentix Banner](public/logo.png)

## Tentang Rentix

Rentix adalah platform marketplace penyewaan gadget dan peralatan penunjang event (laptop, kamera, proyektor, drone, handy talky, gimbal, dan mikrofon) yang mempertemukan penyewa dengan pemilik barang secara fleksibel, mulai dari sewa harian hingga bulanan.

## Fitur Utama

- 🔍 **Browse & Filter** — Temukan gadget berdasarkan kategori, harga, rating, dan ketersediaan (data dari database)
- 📦 **Detail Produk** — Galeri, spesifikasi, booking card + form ulasan
- 🛒 **Keranjang & Checkout** — Membuat transaksi sewa tersimpan di database (escrow)
- 📝 **Sewakan Barangmu** — Pemilik mendaftarkan produk → tersimpan ke database
- 🔐 **Auth + E-KYC** — Register/login nyata (Supabase Auth) + status verifikasi tersimpan per user
- ⭐ **Rating Dua Arah** — Penyewa & pemilik saling memberi ulasan
- 🛡️ **Rentix Protection** — Asuransi otomatis 5% per transaksi (insurance margin)
- 🎓 **Promo Mahasiswa & B2B Kampus** — Kode promo + kemitraan organisasi kampus
- ⭐ **Premium Vendor Listing** — Vendor premium tampil teratas (revenue stream)
- 🤝 **Trust & Safety Center** — Pusat bantuan 24/7 + form laporan
- 📊 **Dashboard** — Riwayat sewa, verifikasi E-KYC & KTM, statistik akun

## Tech Stack

- **React 19** + **Vite**
- **React Router DOM v7** — Client-side routing
- **Zustand** — State management (auth, cart, wishlist, modal, toast)
- **Supabase** — Backend: Postgres database + Auth + Row Level Security
- **CSS Modules** — Component-scoped styling

## Backend Setup (Supabase)

1. Buat project di [supabase.com](https://supabase.com).
2. Salin `.env.example` → `.env` dan isi:
   ```
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon public key>
   ```
   (Project Settings → API)
3. Buka **SQL Editor** di dashboard Supabase, tempel isi [`supabase/schema.sql`](supabase/schema.sql), lalu **Run**.
   Ini membuat tabel `profiles`, `products`, `rentals`, `reviews`, `promos`, RLS, trigger profil otomatis, dan seed data.
4. (Opsional) Di **Authentication → Providers → Email**, matikan "Confirm email" agar bisa langsung login saat demo.

> Tanpa `.env`/skema, aplikasi tetap berjalan memakai data statis sebagai fallback. Auth & penyimpanan transaksi aktif setelah langkah di atas selesai.

## Project Structure

```
src/
├── components/     # Navbar, Footer, ProductCard, Toast, Modal
├── pages/          # Home, Browse, Detail, Cart, ListItem, HowItWorks,
│                   # Login, Register, Trust, Promo, Dashboard
├── lib/            # supabase.js (client), api.js (data layer + fallback)
├── data/           # Static fallback catalog & helpers
├── store/          # Zustand store (auth + cart + UI)
└── index.css       # Global styles & CSS variables
supabase/
└── schema.sql      # Database schema + RLS + seed
public/
└── logo.png + product images
```

## Getting Started

```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Build for production
```

## Halaman Tersedia

| Route | Halaman |
|---|---|
| `/` | Beranda (Home) |
| `/browse` | Jelajahi Produk |
| `/product/:id` | Detail Produk + Ulasan |
| `/cart` | Keranjang & Checkout |
| `/list-item` | Sewakan Barangmu |
| `/promo` | Promo Mahasiswa & B2B Kampus |
| `/trust` | Trust & Safety Center |
| `/how-it-works` | Cara Kerja |
| `/dashboard` | Dashboard pengguna (riwayat sewa, verifikasi) |
| `/login` · `/register` | Masuk · Daftar |

---

Made with ❤️ for Rentix — Sewa Aman, Pakai Nyaman.
