# Rentix

> **Sewa Aman, Pakai Nyaman.** — Platform marketplace penyewaan gadget dan peralatan event terpercaya.

![Rentix Logo](public/logo.png)

Rentix adalah platform marketplace penyewaan gadget dan peralatan penunjang event (kamera, laptop, proyektor, drone, handy talky, gimbal, mikrofon) yang mempertemukan penyewa dengan pemilik barang — mulai dari sewa harian hingga bulanan.

Aplikasi ini **full-stack**: frontend React + backend Supabase (database, autentikasi, dan API).

---

## Cara Menjalankan (Cepat)

> Backend Supabase **sudah disiapkan**. Kamu tidak perlu membuat project Supabase sendiri — cukup minta isi file `.env` ke pemilik repo (lewat WhatsApp/chat), lalu ikuti langkah berikut.

### Prasyarat
- **Node.js v18+** (cek: `node -v`) — unduh di [nodejs.org](https://nodejs.org)
- **Git** (cek: `git --version`)

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/Delixx07/RENTIX.git
cd RENTIX

# 2. Install dependencies
npm install

# 3. Buat file .env (lihat langkah 4 di bawah sebelum menjalankan)
#    Windows (PowerShell):
Copy-Item .env.example .env
#    macOS / Linux:
cp .env.example .env
```

**4. Isi file `.env`.** Buka `.env`, lalu tempel `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` yang kamu dapat dari pemilik repo:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...isi-key-disini...
```

```bash
# 5. Jalankan aplikasi
npm run dev
```

Buka alamat yang muncul di terminal (biasanya **http://localhost:5173**). Selesai!

> Untuk pemilik repo: cara mengisi `.env` dari dashboard Supabase ada di bagian [Setup Supabase (untuk pemilik project)](#setup-supabase-untuk-pemilik-project).
> Mengalami error? Lihat [Troubleshooting](#troubleshooting).

---

## Daftar Isi

1. [Fitur Utama](#fitur-utama)
2. [Tech Stack](#tech-stack)
3. [Setup Supabase (untuk pemilik project)](#setup-supabase-untuk-pemilik-project)
4. [Struktur Proyek](#struktur-proyek)
5. [Halaman & Route](#halaman--route)
6. [Alur Uji Coba (Demo)](#alur-uji-coba-demo)
7. [Troubleshooting](#troubleshooting)

---

## Fitur Utama

- **Browse & Filter** — Cari gadget berdasarkan kategori, harga, rating, dan ketersediaan (data dari database)
- **Detail Produk** — Galeri, spesifikasi, booking card, dan form ulasan
- **Keranjang & Checkout** — Membuat transaksi sewa yang tersimpan di database (escrow)
- **Sewakan Barangmu** — Pemilik mendaftarkan produk yang langsung masuk ke database
- **Autentikasi + E-KYC** — Register/login nyata via Supabase Auth, status verifikasi tersimpan per pengguna
- **Rating Dua Arah** — Penyewa & pemilik saling memberi ulasan
- **Rentix Protection** — Asuransi otomatis 5% per transaksi
- **Promo Mahasiswa & B2B Kampus** — Kode promo + kemitraan organisasi kampus
- **Premium Vendor Listing** — Vendor premium tampil teratas
- **Trust & Safety Center** — Pusat bantuan 24/7 + form laporan
- **Dashboard** — Riwayat sewa, verifikasi E-KYC & KTM, statistik akun

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | React 19 + Vite |
| Routing | React Router DOM v7 |
| State | Zustand |
| Backend | Supabase (PostgreSQL + Auth + Row Level Security) |
| Styling | CSS Modules + ikon SVG |

---

## Setup Supabase (untuk pemilik project)

> Bagian ini **hanya perlu dilakukan sekali oleh pemilik repo**. Anggota tim lain cukup mengikuti [Cara Menjalankan (Cepat)](#cara-menjalankan-cepat) di atas dan meminta isi `.env`.

### 1. Buat project Supabase
1. Login ke [supabase.com](https://supabase.com) → **New project**.
2. Beri nama (mis. `rentix`), atur password database, pilih region terdekat (mis. Singapore), lalu **Create**.

### 2. Buat database (jalankan SQL)
1. Dashboard Supabase → **SQL Editor** → **New query**.
2. Salin seluruh isi [`supabase/schema.sql`](supabase/schema.sql), tempel, lalu klik **Run** (atau `Ctrl+Enter`).

   > Klik **Run**, bukan tab "Explain". Sekali jalan membuat tabel (`profiles`, `products`, `rentals`, `reviews`, `promos`), Row Level Security, trigger profil otomatis, dan data awal (8 produk, promo, ulasan).

### 3. Ambil kredensial untuk `.env`
Dashboard Supabase → **Project Settings → API**, salin:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

Kedua nilai inilah yang dibagikan ke anggota tim untuk mengisi `.env` mereka.

### 4. (Disarankan) Matikan konfirmasi email
Agar bisa langsung login setelah daftar saat demo:
- **Authentication → Sign In / Providers → Email** → matikan **Confirm email** → **Save**.

> Anon key aman dipakai di frontend karena dilindungi Row Level Security. Jangan commit `.env` ke GitHub — file ini sudah masuk `.gitignore`. Bagikan isinya lewat chat pribadi.

### Perintah lain

```bash
npm run dev       # Mode pengembangan (hot reload)
npm run build     # Build untuk produksi (output ke folder dist/)
npm run preview   # Pratinjau hasil build secara lokal
npm run lint      # Cek kualitas kode dengan ESLint
```

---

## Struktur Proyek

```
RENTIX/
├── public/                 # Logo & gambar produk
├── src/
│   ├── components/         # Navbar, Footer, ProductCard, Icon, Stars, Toast, Modal
│   ├── pages/             # Home, Browse, Detail, Cart, ListItem, HowItWorks,
│   │                      # Login, Register, Trust, Promo, Dashboard
│   ├── lib/               # supabase.js (client) & api.js (data layer + fallback)
│   ├── data/              # Katalog statis (fallback) & helper
│   ├── store/             # Zustand store (auth + cart + UI)
│   ├── App.jsx            # Routing utama
│   ├── main.jsx           # Entry point
│   └── index.css          # Style global & variabel warna
├── supabase/
│   └── schema.sql         # Skema database + RLS + seed data
├── .env.example           # Contoh konfigurasi environment
└── package.json
```

---

## Halaman & Route

| Route | Halaman |
|---|---|
| `/` | Beranda |
| `/browse` | Jelajahi produk |
| `/product/:id` | Detail produk + ulasan |
| `/cart` | Keranjang & checkout |
| `/list-item` | Sewakan barangmu |
| `/promo` | Promo mahasiswa & B2B kampus |
| `/trust` | Trust & Safety Center |
| `/how-it-works` | Cara kerja |
| `/dashboard` | Dashboard pengguna (riwayat sewa, verifikasi) |
| `/login` · `/register` | Masuk · Daftar |

---

## Alur Uji Coba (Demo)

Setelah aplikasi jalan dan Supabase aktif:

1. **Daftar akun** di `/register`.
2. Klik avatar di navbar → masuk **Dashboard** → klik **Verifikasi KTP** dan **Verifikasi KTM**.
3. Buka **/promo** → kode `MAHASISWA20` kini terbuka (status mahasiswa aktif).
4. **Jelajahi** produk → pilih satu → **Pesan Sekarang** → **Checkout**.
5. Kembali ke **Dashboard** → transaksi muncul di **Riwayat Sewa** (status `escrow`).
6. Di halaman produk → tulis **ulasan**; ulasan tersimpan ke database.

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Gagal login/daftar atau produk tidak muncul | Cek `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` di `.env` sudah benar. Restart server setelah mengubah `.env`. |
| Daftar tapi tidak bisa langsung login | Pemilik project perlu mematikan **Confirm email** di Supabase, atau buka link konfirmasi di email. |
| `Could not find the table 'public.products'` | Database belum disiapkan — pemilik project menjalankan SQL (lihat [Setup Supabase](#setup-supabase-untuk-pemilik-project)). |
| Perubahan `.env` tidak terbaca | Hentikan server (`Ctrl+C`) lalu jalankan `npm run dev` lagi. |
| Port 5173 sudah dipakai | Vite otomatis pindah ke port lain — lihat alamat di terminal. |

---

Dibuat untuk Rentix — Sewa Aman, Pakai Nyaman.
