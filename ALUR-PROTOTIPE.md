# Alur Prototipe Rentix — Panduan Presentasi

> **Rentix — Sewa Aman, Pakai Nyaman.** Platform marketplace penyewaan gadget & peralatan event.
> Dokumen ini memandu demo prototipe dari awal sampai akhir, lengkap dengan poin yang bisa dijelaskan ke audiens.

---

## 1. Ringkasan untuk Pembuka (30 detik)

> "Rentix adalah marketplace yang mempertemukan **pemilik gadget menganggur** dengan **penyewa** (mahasiswa, content creator, panitia event). Aman karena ada **verifikasi E-KYC**, **asuransi otomatis**, dan **escrow pembayaran**. Prototipe ini sudah **full-stack**: React di frontend, Supabase (database + autentikasi) di backend."

Tiga pilar yang menjual:
1. **Trust** — E-KYC, rating dua arah, Trust & Safety Center.
2. **Zero-worry** — Rentix Protection (asuransi 2%) + escrow.
3. **Akses terjangkau** — sewa harian/mingguan/bulanan, promo mahasiswa.

---

## 2. Alur Demo Utama (Penyewa) — urutan yang disarankan

Jalankan `npm run dev`, buka **http://localhost:5173**.

| # | Langkah | Yang ditunjukkan & dijelaskan |
|---|---------|-------------------------------|
| 1 | **Beranda** (`/`) | Hero "Sewa Aman, Pakai Nyaman", statistik, 3 pilar keamanan, kategori, produk populer, testimonial. Tunjukkan animasi halus saat scroll & hover. |
| 2 | **Daftar akun** (`/register`) | Isi data → klik **Buat Akun**. Jelaskan: ini **autentikasi nyata** (Supabase Auth), bukan dummy. |
| 3 | **Dashboard** (klik avatar) | Klik **Unggah KTP** → status berubah jadi **Terverifikasi**. Jelaskan: tanpa E-KYC, checkout diblokir (mitigasi penipuan). Klik **Verifikasi KTM** → status mahasiswa aktif (membuka promo). |
| 4 | **Jelajahi** (`/browse`) | **Demo filter** (lihat bagian 3). Tunjukkan animasi grid yang ter-stagger saat ganti kategori. |
| 5 | **Detail produk** | Pilih durasi (Harian/Mingguan/Bulanan), tanggal, jumlah. Tunjukkan **rincian harga**: Subtotal → Asuransi 2% → PPN 11% → Total. Klik **Rentix Protection** (modal coverage). |
| 6 | **Pesan → Keranjang** (`/cart`) | Ringkasan pesanan + rincian biaya. Klik **Lanjut ke Pembayaran**. Jelaskan: transaksi tersimpan ke DB dengan status **escrow**. |
| 7 | **Kembali ke Dashboard** | Transaksi muncul di **Riwayat Sewa Saya**. |
| 8 | **Beri ulasan** | Buka produk → tulis ulasan (rating bintang). Jelaskan **rating produk auto-update**. |

---

## 3. Demo Filter (Jelajahi) — semua berfungsi

Tunjukkan satu per satu di halaman **/browse**:

- **Kategori** — klik chip "Kamera", "Laptop", dll → produk tersaring + animasi muncul ulang.
- **Harga/Hari** — geser slider → produk di atas batas hilang.
- **Keamanan**:
  - *Rentix Protected* → hanya produk berbadge "Dilindungi".
  - *Pemilik Terverifikasi* → hanya pemilik ber-E-KYC.
  - *Rating 4,5+* → hanya produk rating tinggi.
- **Ketersediaan** — *Tersedia Sekarang* → hanya stok > 0.
- **Pencarian** — ketik nama produk.
- **Urutkan** — Terpopuler / Rating / Harga termurah-termahal.
- **Reset Filter** — kembalikan semua ke awal.
- **Tanggal sewa** — dari Beranda, isi tanggal → terbawa & tampil di header Jelajahi.

> Poin jual: "Semua filter benar-benar memanipulasi data, bukan tampilan kosong."

---

## 4. Alur Demo Pemilik (Lender) — sisi kedua marketplace

| # | Langkah | Penjelasan |
|---|---------|-----------|
| 1 | **Sewakan Barangku** (`/list-item`) | Isi form, **upload foto** (ke Supabase Storage), set harga → **Daftarkan Produk**. |
| 2 | **Dashboard → Produk yang Saya Sewakan** | Produk muncul, bisa **Hapus**. |
| 3 | **Sewa pada Produk Saya** | Saat ada yang menyewa, pemilik bisa **Nilai Penyewa** → ini **rating dua arah**. |

---

## 5. Halaman Pendukung (sesuai Business Model Canvas)

- **Promo** (`/promo`) — Promo Mahasiswa (kode `MAHASISWA20`), B2B Kampus, **Premium Vendor Listing** → ini *revenue stream*.
- **Trust & Safety** (`/trust`) — 5 pilar keamanan + pusat bantuan 24/7 + form laporan → *customer relationship*.
- **Cara Kerja** (`/how-it-works`) — alur penyewa & pemilik + FAQ.
- **Wishlist** (`/wishlist`) — barang tersimpan (persist di browser).

---

## 6. Hubungan ke Business Model Canvas (untuk sesi tanya jawab)

| Elemen BMC | Wujud di prototipe |
|------------|--------------------|
| Value Proposition | E-KYC, Rentix Protection, escrow, akses terjangkau |
| Customer Segments | Mahasiswa, Content Creator, Panitia Event, Pemilik aset |
| Revenue Streams | **Commission/admin**, **Asuransi 2%**, **Premium Vendor** |
| Channels | Website/App, B2B Kampus (halaman Promo), Social Media |
| Key Activities | App Development, Security Auditing, Verifikasi KTP |
| Customer Relationship | Trust & Safety Center, Rating dua arah, Promo Mahasiswa |

**Struktur harga (sesuai Cost Structure):**
- Asuransi/proteksi **2%** per transaksi (insurance margin)
- **PPN 11%** sesuai regulasi
- Total = Subtotal + Asuransi + PPN

---

## 7. Sisi Teknis (kalau ditanya dosen)

- **Frontend**: React 19 + Vite, React Router, Zustand (state + persist), CSS Modules, ikon SVG, animasi halus + `prefers-reduced-motion`.
- **Backend**: Supabase — PostgreSQL, Auth, Storage, **Row Level Security** di semua tabel.
- **Tabel**: `profiles`, `products`, `rentals`, `reviews`, `promos`.
- **Keamanan**: anon key dilindungi RLS; KTP disimpan di bucket privat.
- **Fallback**: jika backend mati, app tetap jalan dengan data contoh (banner peringatan muncul).
- **Responsif**: HP, tablet, laptop — navbar jadi menu hamburger di layar kecil, grid menyesuaikan kolom.

---

## 8. Checklist Sebelum Demo

- [ ] `npm run dev` jalan, buka di browser.
- [ ] Env Supabase terisi (`.env`) — kalau di Vercel, set Environment Variables lalu redeploy.
- [ ] SQL sudah dijalankan: `schema.sql` → `migrations.sql` → `seed_more_products.sql` → `seed_more_products_2.sql` → `update_images.sql`.
- [ ] "Confirm email" di Supabase Auth dimatikan (biar bisa langsung login saat demo).
- [ ] Siapkan 1 akun yang sudah ter-verifikasi E-KYC untuk demo checkout cepat.
- [ ] Coba di HP/tablet (atau resize browser) untuk tunjukkan responsif.

---

## 9. Alur Singkat (1 kalimat per layar) — untuk slide

`Beranda → Daftar → Verifikasi E-KYC → Jelajahi (filter) → Detail (pilih durasi & tanggal) → Keranjang (asuransi + PPN) → Checkout (escrow) → Dashboard (riwayat) → Ulasan (rating dua arah).`

---

_Sewa Aman, Pakai Nyaman._
