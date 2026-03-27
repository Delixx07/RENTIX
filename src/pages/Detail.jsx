import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS, REVIEWS, fmt } from '../data/products';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import useStore from '../store/useStore';
import styles from './Detail.module.css';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openModal, closeModal } = useStore();
  const p = PRODUCTS.find(x => x.id === +id);

  const [durType, setDurType] = useState('day');
  const [qty, setQty] = useState(1);
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  const { unitPrice, perLabel } = useMemo(() => {
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000));
    if (durType === 'week') return { unitPrice: p?.priceWeek, perLabel: 'minggu' };
    if (durType === 'month') return { unitPrice: p?.priceMonth, perLabel: 'bulan' };
    return { unitPrice: (p?.price || 0) * days, perLabel: `${days} hari` };
  }, [durType, startDate, endDate, p]);

  const subtotal = unitPrice * qty;
  const insurance = Math.round(subtotal * 0.05);
  const total = subtotal + insurance;

  if (!p) return <div className="page"><div className="container empty-state"><div className="es-icon">🔍</div><h3>Produk tidak ditemukan</h3><Link to="/browse">Kembali ke Browse</Link></div><Footer /></div>;

  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  const handleBook = () => {
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      alert('Pilih tanggal yang valid!'); return;
    }
    addToCart(p);
    navigate('/cart');
  };

  const showProtection = () => openModal(
    <div>
      <div className="modal-header"><span className="modal-title">🛡️ Rentix Protection</span><button className="modal-close-btn" onClick={closeModal}>✕</button></div>
      <p style={{ fontSize: '.87rem', color: 'var(--gray-600)', marginBottom: 20, lineHeight: 1.65 }}>Transaksi ini otomatis dilindungi asuransi pihak ketiga:</p>
      {[['⚡','Kerusakan Tidak Disengaja','Ditanggung hingga nilai penuh.'],['🔒','Kehilangan','Ganti rugi ke pemilik.'],['🚫','Penipuan','Escrow — dana cair setelah barang diterima.'],['🗑️','Data Wipe','Penghapusan data terjamin.']].map(([ic,t,d])=>(
        <div key={t} style={{ display:'flex', gap:12, padding:14, background:'var(--gray-50)', borderRadius:12, marginBottom:10 }}>
          <span style={{ fontSize:'1.3rem' }}>{ic}</span><div><strong style={{ fontSize:'.9rem', color:'var(--navy)' }}>{t}</strong><p style={{ fontSize:'.82rem', color:'var(--gray-500)', marginTop:3, lineHeight:1.5 }}>{d}</p></div>
        </div>
      ))}
      <button style={{ width:'100%', padding:13, border:'none', background:'linear-gradient(135deg,#235784,#40A8C4)', color:'#fff', borderRadius:12, fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:800, cursor:'pointer', marginTop:16 }} onClick={closeModal}>Saya Mengerti</button>
    </div>
  );

  return (
    <div className="page" style={{ background: '#fff' }}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.bcLink}>Beranda</Link> /
          <Link to="/browse" className={styles.bcLink}>Jelajahi</Link> /
          <span>{p.name}</span>
        </div>

        <div className={styles.grid}>
          {/* LEFT */}
          <div>
            <div className={styles.galleryMain}><img src={p.img} alt={p.name} /></div>
            <div className={styles.thumbs}>
              {[0,1,2,3].map(i => (
                <div key={i} className={`${styles.thumb} ${i===0?styles.thumbActive:''}`}><img src={p.img} alt="" /></div>
              ))}
            </div>

            <h3 className={styles.reviewsTitle}>Ulasan Penyewa</h3>
            {REVIEWS.slice(0, 3).map(r => (
              <div key={r.name} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.avatar}>{r.initial}</div>
                  <div><div className={styles.reviewName}>{r.name}</div><div style={{ color:'var(--amber)', fontSize:'.8rem' }}>{'★'.repeat(r.rating)}</div></div>
                  <span className={styles.reviewDate}>{r.date}</span>
                </div>
                <p className={styles.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div>
            <div className={styles.detailBadges}>
              {p.badges.includes('protected') && <button className={styles.dbProtection} onClick={showProtection}>🛡️ Rentix Protection</button>}
              {p.ownerVerified && <span className={styles.dbKyc}>✅ E-KYC Verified</span>}
              <span className={styles.dbWipe}>🗑️ Data Wipe</span>
            </div>
            <h1 className={styles.name}>{p.name}</h1>
            <div className={styles.ratingRow}>
              <span style={{ color:'var(--amber)' }}>{'★'.repeat(Math.round(p.rating))}</span>
              <strong style={{ color:'var(--navy)' }}>{p.rating}</strong>
              <span style={{ color:'var(--gray-400)' }}>({p.reviews} ulasan)</span>
              <span style={{ color: p.available ? '#22c55e' : '#ef4444', fontWeight:600, fontSize:'.85rem' }}>
                {p.available ? '✓ Tersedia' : '✗ Habis'}
              </span>
            </div>
            <p className={styles.desc}>{p.desc}</p>

            <div className={styles.specs}>
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className={styles.specRow}>
                  <span className={styles.specLabel}>{k}</span>
                  <span className={styles.specVal}>{v}</span>
                </div>
              ))}
            </div>

            <div className={styles.ownerCard}>
              <div className={styles.ownerAvatar}>{p.owner[0]}</div>
              <div>
                <div className={styles.ownerName}>{p.owner}</div>
                <div className={styles.ownerMeta}>⭐ 4.9 · 98% Response Rate · 2 jam respons</div>
              </div>
              {p.ownerVerified && <div className={styles.ownerVerified} style={{ marginLeft:'auto' }}>✓ Terverifikasi</div>}
            </div>

            {/* BOOKING CARD */}
            <div className={styles.bookCard}>
              <div className={styles.bookPrice}>
                <span className={styles.bookPriceVal}>{fmt(durType==='day'?p.price:durType==='week'?p.priceWeek:p.priceMonth)}</span>
                <span className={styles.bookPricePer}> / {durType==='day'?'hari':durType==='week'?'minggu':'bulan'}</span>
              </div>
              <div className={styles.durTabs}>
                {[['day','Harian'],['week','Mingguan'],['month','Bulanan']].map(([v,l]) => (
                  <button key={v} className={`${styles.durTab} ${durType===v?styles.durActive:''}`} onClick={() => setDurType(v)}>{l}</button>
                ))}
              </div>
              <div className={styles.dateRow}>
                <div className={styles.dateField}><label>Tanggal Mulai</label><input type="date" min={today} value={startDate} onChange={e=>setStartDate(e.target.value)} /></div>
                <div className={styles.dateField}><label>Tanggal Selesai</label><input type="date" min={today} value={endDate} onChange={e=>setEndDate(e.target.value)} /></div>
              </div>
              <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>Jumlah Unit</span>
                <div className={styles.qtyCtrl}>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(p.stock, q+1))}>+</button>
                </div>
              </div>
              <div className={styles.summary}>
                <div className={styles.sumRow}><span>{fmt(unitPrice)} × {perLabel} × {qty}</span><span>{fmt(subtotal)}</span></div>
                <div className={styles.sumRow}><span>🛡️ Rentix Protection <span className={styles.proBadge}>5%</span></span><span>{fmt(insurance)}</span></div>
                <div className={`${styles.sumRow} ${styles.sumTotal}`}><span>Total</span><span>{fmt(total)}</span></div>
              </div>
              <button className={styles.bookBtn} onClick={handleBook}>🛒 Pesan Sekarang</button>
              <div className={styles.bookGuarantee}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Pembayaran aman · Batal gratis 24 jam
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ padding: '40px 0 60px' }}>
            <h3 style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.2rem', fontWeight:800, color:'var(--navy)', marginBottom:20 }}>Produk Serupa</h3>
            <div className="product-grid">{related.map(pr => <ProductCard key={pr.id} product={pr} />)}</div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
