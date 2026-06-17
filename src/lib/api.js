import { supabase, isSupabaseConfigured } from './supabase';
import { PRODUCTS as STATIC_PRODUCTS, REVIEWS as STATIC_REVIEWS, priceBreakdown } from '../data/products';

// Foto gadget asli per kategori (file lokal di /public). Dipakai sebagai gambar
// produk, untuk listing tanpa foto, dan saat gambar gagal dimuat (onError).
const CAT_IMAGE = {
  camera: '/product_camera.png',
  laptop: '/product_laptop.png',
  projector: '/product_projector.png',
  audio: '/product_microphone.png',
  drone: '/product_drone.png',
  stabilizer: '/product_gimbal.png',
  ht: '/product_ht.png',
};
export const fallbackImage = (cat) => CAT_IMAGE[cat] || '/product_camera.png';

// Map a Supabase product row (snake_case) → app product shape (camelCase)
function mapProduct(row) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    cat: row.cat,
    name: row.name,
    img: row.img || fallbackImage(row.cat),
    price: row.price,
    priceWeek: row.price_week,
    priceMonth: row.price_month,
    rating: Number(row.rating) || 0,
    reviews: row.reviews || 0,
    owner: row.owner_name || 'Rentix Vendor',
    ownerVerified: row.owner_verified,
    badges: row.badges || [],
    desc: row.description || '',
    specs: row.specs || {},
    available: row.available,
    stock: row.stock || 1,
    isPremium: row.is_premium,
    city: row.city || 'Surabaya',
  };
}

function mapReview(row) {
  return {
    id: row.id,
    name: row.author_name || 'Pengguna Rentix',
    initial: (row.author_name || 'R')[0].toUpperCase(),
    rating: row.rating,
    text: row.text,
    direction: row.direction,
    productId: row.product_id,
    date: timeAgo(row.created_at),
  };
}

function timeAgo(ts) {
  if (!ts) return 'Baru saja';
  const d = (Date.now() - new Date(ts)) / 86400000;
  if (d < 1) return 'Hari ini';
  if (d < 7) return `${Math.floor(d)} hari lalu`;
  if (d < 30) return `${Math.floor(d / 7)} minggu lalu`;
  return `${Math.floor(d / 30)} bulan lalu`;
}

// True when Supabase is reachable AND the schema has been applied.
// Cached so we only probe once per session.
let _ready = null;
export async function dbReady() {
  if (!isSupabaseConfigured) return false;
  if (_ready !== null) return _ready;
  const { error } = await supabase.from('products').select('id').limit(1);
  _ready = !error;
  return _ready;
}

// Synchronous best-effort flag for UI banners. null = belum diketahui.
export function dbStatus() {
  if (!isSupabaseConfigured) return 'unconfigured';
  if (_ready === null) return 'unknown';
  return _ready ? 'online' : 'offline';
}

// ---------- PRODUCTS ----------
export async function fetchProducts() {
  if (await dbReady()) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('is_premium', { ascending: false })
      .order('id', { ascending: true });
    if (!error && data) return data.map(mapProduct);
  }
  return STATIC_PRODUCTS;
}

export async function fetchProduct(id) {
  if (await dbReady()) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (!error && data) return mapProduct(data);
  }
  return STATIC_PRODUCTS.find((p) => p.id === +id) || null;
}

export async function createProduct(payload, ownerId, ownerName) {
  if (!(await dbReady())) {
    return { ok: false, reason: 'db-offline' };
  }
  const { error } = await supabase.from('products').insert({
    owner_id: ownerId,
    owner_name: ownerName,
    cat: payload.cat,
    name: payload.name,
    img: payload.img || fallbackImage(payload.cat),
    price: payload.price,
    price_week: payload.priceWeek,
    price_month: payload.priceMonth,
    badges: ['protected'],
    description: payload.desc,
    specs: payload.specs || {},
    stock: payload.stock || 1,
    city: payload.city || 'Surabaya',
    owner_verified: true,
  });
  return { ok: !error, reason: error?.message };
}

export async function fetchOwnerProducts(ownerId) {
  if (!(await dbReady()) || !ownerId) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('owner_id', ownerId)
    .order('id', { ascending: false });
  return error ? [] : data.map(mapProduct);
}

export async function deleteProduct(id, ownerId) {
  if (!(await dbReady())) return { ok: false, reason: 'db-offline' };
  const { error } = await supabase.from('products').delete().eq('id', id).eq('owner_id', ownerId);
  return { ok: !error, reason: error?.message };
}

// ---------- STORAGE (upload) ----------
// Uploads a file to `bucket` under a per-user folder. Returns a usable URL.
export async function uploadFile(bucket, userId, file) {
  if (!(await dbReady()) || !file || !userId) return { ok: false, reason: 'db-offline' };
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) return { ok: false, reason: error.message };
  if (bucket === 'products') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { ok: true, url: data.publicUrl, path };
  }
  return { ok: true, path }; // private bucket (kyc): keep only the path
}

// ---------- REVIEWS ----------
export async function fetchReviews(productId = null) {
  if (await dbReady()) {
    let q = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (productId) q = q.eq('product_id', productId);
    const { data, error } = await q;
    if (!error && data) return data.map(mapReview);
  }
  return STATIC_REVIEWS;
}

export async function createReview({ productId, rating, text, authorId, authorName, direction = 'to_owner', targetUserId = null }) {
  if (!(await dbReady())) return { ok: false, reason: 'db-offline' };
  const row = {
    product_id: productId,
    author_id: authorId,
    author_name: authorName,
    rating,
    text,
    direction,
  };
  // Kolom target_user_id ditambahkan oleh migrations.sql — hanya kirim bila ada nilainya.
  if (targetUserId) row.target_user_id = targetUserId;
  const { error } = await supabase.from('reviews').insert(row);
  return { ok: !error, reason: error?.message };
}

// ---------- RENTALS ----------
export async function createRentals(items, renterId) {
  if (!(await dbReady())) return { ok: false, reason: 'db-offline' };
  const rows = items.map((i) => {
    const days = i.days || 1;
    const { subtotal, insurance, total } = priceBreakdown(i.price * i.qty * days);
    return {
      renter_id: renterId,
      product_id: i.id,
      product_name: i.name,
      start_date: i.startDate || null,
      end_date: i.endDate || null,
      qty: i.qty,
      days,
      subtotal,
      insurance,
      total, // sudah termasuk asuransi 2% + PPN 11%
      status: 'escrow',
    };
  });
  const { error } = await supabase.from('rentals').insert(rows);
  return { ok: !error, reason: error?.message };
}

export async function fetchMyRentals(renterId) {
  if (!(await dbReady()) || !renterId) return [];
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('renter_id', renterId)
    .order('created_at', { ascending: false });
  return error ? [] : data;
}

// Rentals placed on products owned by `ownerId` — used for two-way rating.
export async function fetchRentalsAsOwner(ownerId) {
  if (!(await dbReady()) || !ownerId) return [];
  const ownIds = (await fetchOwnerProducts(ownerId)).map((p) => p.id);
  if (ownIds.length === 0) return [];
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .in('product_id', ownIds)
    .order('created_at', { ascending: false });
  return error ? [] : data;
}

// ---------- PROMOS ----------
const STATIC_PROMOS = [
  { id: 1, code: 'MAHASISWA20', title: 'Diskon Mahasiswa 20%', description: 'Khusus mahasiswa terverifikasi (KTM). Berlaku untuk semua kategori, sepanjang semester.', discount: 20, audience: 'student' },
  { id: 2, code: 'EVENTKAMPUS', title: 'Paket Event Kampus', description: 'Sewa alat untuk BEM/Hima/UKM. Harga khusus paket HT + proyektor + sound.', discount: 15, audience: 'campus' },
  { id: 3, code: 'TUGASAKHIR', title: 'Promo Tugas Akhir', description: 'Sewa kamera & laptop untuk dokumentasi dan pengerjaan tugas akhir.', discount: 10, audience: 'student' },
  { id: 4, code: 'WELCOME10', title: 'Selamat Datang', description: 'Diskon untuk transaksi pertama semua pengguna baru Rentix.', discount: 10, audience: 'all' },
];

export async function fetchPromos() {
  if (await dbReady()) {
    const { data, error } = await supabase.from('promos').select('*').eq('active', true).order('id');
    if (!error && data?.length) return data;
  }
  return STATIC_PROMOS;
}
