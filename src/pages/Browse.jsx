import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import { fetchProducts, dbStatus } from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import styles from './Browse.module.css';

export default function Browse() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [cat, setCat] = useState(searchParams.get('cat') || 'all');
  const rentStart = searchParams.get('start') || '';
  const rentEnd = searchParams.get('end') || '';
  const [sort, setSort] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(600000);
  // Filter aktif (controlled)
  const [fProtected, setFProtected] = useState(false);
  const [fVerified, setFVerified] = useState(false);
  const [fRating, setFRating] = useState(false);
  const [fAvailable, setFAvailable] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetchProducts().then((p) => {
      setProducts(p);
      setOffline(dbStatus() !== 'online');
      setLoading(false);
    });
  }, []);

  const resetFilters = () => {
    setCat('all'); setSearch(''); setMaxPrice(600000);
    setFProtected(false); setFVerified(false); setFRating(false); setFAvailable(false);
  };

  const filtered = products
    .filter(p => cat === 'all' || p.cat === cat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => p.price <= maxPrice)
    .filter(p => !fProtected || (p.badges || []).includes('protected'))
    .filter(p => !fVerified || p.ownerVerified)
    .filter(p => !fRating || p.rating >= 4.5)
    .filter(p => !fAvailable || (p.available && p.stock > 0))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const activeFilterKey = `${cat}-${sort}-${search}-${maxPrice}-${fProtected}-${fVerified}-${fRating}-${fAvailable}`;

  return (
    <div className="page">
      <div className={styles.header}>
        <div className="container">
          <div className={styles.top}>
            <div>
              <h1 className={styles.title}>Jelajahi Produk</h1>
              <p className={styles.subtitle}>
                {rentStart && rentEnd
                  ? `Periode sewa: ${rentStart} sampai ${rentEnd}`
                  : 'Temukan gadget terbaik untukmu'}
              </p>
            </div>
            <div className={styles.searchWrap}>
              <Icon name="search" size={18} />
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
                    <Icon name={c.icon} size={15} /> {c.name}
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
              <input type="range" className={styles.slider} min={50000} max={600000} step={10000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
            </div>
            <div className={styles.filterCard}>
              <div className={styles.filterTitle}>Keamanan</div>
              <label className={styles.chk}><input type="checkbox" checked={fProtected} onChange={e => setFProtected(e.target.checked)} /><span>Rentix Protected</span></label>
              <label className={styles.chk}><input type="checkbox" checked={fVerified} onChange={e => setFVerified(e.target.checked)} /><span>Pemilik Terverifikasi</span></label>
              <label className={styles.chk}><input type="checkbox" checked={fRating} onChange={e => setFRating(e.target.checked)} /><span>Rating 4,5+</span></label>
            </div>
            <div className={styles.filterCard}>
              <div className={styles.filterTitle}>Ketersediaan</div>
              <label className={styles.chk}><input type="checkbox" checked={fAvailable} onChange={e => setFAvailable(e.target.checked)} /><span>Tersedia Sekarang</span></label>
            </div>
            <button className={styles.clearBtn} onClick={resetFilters}>
              <Icon name="refresh" size={16} /> Reset Filter
            </button>
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
            {offline && !loading && (
              <div className={styles.offlineBar}>
                <Icon name="alert" size={16} /> Menampilkan data contoh — backend Supabase belum aktif.
              </div>
            )}
            {loading ? (
              <ProductSkeleton count={6} />
            ) : filtered.length > 0 ? (
              // key berubah saat filter/sort berganti → animasi stagger diputar ulang
              <div className="product-grid" key={activeFilterKey}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state anim-rise">
                <div className="es-icon"><Icon name="search" size={40} /></div>
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
