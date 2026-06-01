import { supabase, isSupabaseConfigured } from './supabase';
import { PRODUCTS as STATIC_PRODUCTS, REVIEWS as STATIC_REVIEWS } from '../data/products';

// Map a Supabase product row (snake_case) → app product shape (camelCase)
function mapProduct(row) {
  return {
    id: row.id,
    cat: row.cat,
    name: row.name,
    img: row.img,
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
    img: payload.img || '/product_camera.png',
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

export async function createReview({ productId, rating, text, authorId, authorName, direction = 'to_owner' }) {
  if (!(await dbReady())) return { ok: false, reason: 'db-offline' };
  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    author_id: authorId,
    author_name: authorName,
    rating,
    text,
    direction,
  });
  return { ok: !error, reason: error?.message };
}

// ---------- RENTALS ----------
export async function createRentals(items, renterId) {
  if (!(await dbReady())) return { ok: false, reason: 'db-offline' };
  const rows = items.map((i) => {
    const days = i.days || 1;
    const subtotal = i.price * i.qty * days;
    const insurance = Math.round(subtotal * 0.05);
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
      total: subtotal + insurance,
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
