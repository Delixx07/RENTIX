import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, fmt, BADGE_MAP } from '../data/products';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import styles from './Browse.module.css';

export default function Browse() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [cat, setCat] = useState(searchParams.get('cat') || 'all');
  const [sort, setSort] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(500000);

  const filtered = PRODUCTS
    .filter(p => cat === 'all' || p.cat === cat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => p.price <= maxPrice)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <div className="page">
      <div className={styles.header}>
        <div className="container">
          <div className={styles.top}>
            <div>
              <h1 className={styles.title}>Jelajahi Produk</h1>
              <p className={styles.subtitle}>Temukan gadget terbaik untukmu</p>
            </div>
            <div className={styles.searchWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Cari nama produk..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.body}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <div className={styles.filterTitle}>Kategori</div>
              <div className={styles.chips}>
                {CATEGORIES.map(c => (
                  <button key={c.id} className={`${styles.chip} ${cat === c.id ? styles.active : ''}`} onClick={() => setCat(c.id)}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterCard}>
              <div className={styles.filterTitle}>Harga/Hari</div>
              <div className={styles.rangeRow}>
                <span>Rp 0</span>
                <span>Rp {(maxPrice/1000).toFixed(0)}rb</span>
              </div>
              <input type="range" className={styles.slider} min={50000} max={500000} step={10000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
            </div>
            <div className={styles.filterCard}>
              <div className={styles.filterTitle}>Keamanan</div>
              {['🛡️ Rentix Protected','✅ Pemilik Terverifikasi','⭐ Rating 4.5+'].map(f => (
                <label key={f} className={styles.chk}><input type="checkbox" defaultChecked={f.includes('Protected')||f.includes('Terverifikasi')} /><span>{f}</span></label>
              ))}
            </div>
            <div className={styles.filterCard}>
              <div className={styles.filterTitle}>Ketersediaan</div>
              {['Tersedia Sekarang','Tersedia Minggu Ini'].map(f => (
                <label key={f} className={styles.chk}><input type="checkbox" defaultChecked={f.includes('Sekarang')} /><span>{f}</span></label>
              ))}
            </div>
            <button className={styles.clearBtn} onClick={() => { setCat('all'); setSearch(''); setMaxPrice(500000); }}>🔄 Reset Filter</button>
          </aside>

          {/* RESULTS */}
          <div>
            <div className={styles.resultsBar}>
              <span className={styles.count}>Menampilkan <strong>{filtered.length}</strong> produk</span>
              <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="popular">Terpopuler</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
              </select>
            </div>
            {filtered.length > 0 ? (
              <div className="product-grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state">
                <div className="es-icon">🔍</div>
                <h3>Tidak ada hasil</h3>
                <p>Coba ubah kata kunci atau filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
