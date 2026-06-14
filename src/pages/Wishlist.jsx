import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../lib/api';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

export default function Wishlist() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px 60px' }}>
        <div className="section-header" style={{ marginBottom: 28 }}>
          <span className="section-tag">Wishlist</span>
          <h1 className="section-title">Barang yang Kamu Simpan</h1>
        </div>

        {loading ? (
          <div className="empty-state"><div className="es-icon"><Icon name="heart" size={40} /></div><h3>Memuat…</h3></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="es-icon"><Icon name="heart" size={40} /></div>
            <h3>Wishlist masih kosong</h3>
            <p>Tekan ikon hati pada produk untuk menyimpannya di sini.</p>
            <Link to="/browse" className="btn-lg amber" style={{ marginTop: 18 }}>Jelajahi Produk</Link>
          </div>
        ) : (
          <div className="product-grid">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
