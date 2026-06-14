import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fmt } from '../data/products';
import { fetchProduct, fetchProducts, fetchReviews, createReview } from '../lib/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import Stars from '../components/Stars';
import useStore from '../store/useStore';
import styles from './Detail.module.css';

const PROTECTION_ITEMS = [
  ['Kerusakan Tidak Disengaja', 'Ditanggung hingga nilai penuh.'],
  ['Kehilangan', 'Ganti rugi ke pemilik.'],
  ['Penipuan', 'Escrow — dana cair setelah barang diterima.'],
  ['Data Wipe', 'Penghapusan data terjamin.'],
];

const DURATIONS = [['day', 'Harian'], ['week', 'Mingguan'], ['month', 'Bulanan']];

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openModal, closeModal, showToast, user, profile } = useStore();

  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(5);
  const [myText, setMyText] = useState('');

  const [durType, setDurType] = useState('day');
  const [qty, setQty] = useState(1);
  const [today] = useState(() => new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const prod = await fetchProduct(id);
      if (!active) return;
      setP(prod);
      setLoading(false);
      if (prod) {
        const all = await fetchProducts();
        if (!active) return;
        setRelated(all.filter((x) => x.cat === prod.cat && x.id !== prod.id).slice(0, 4));
        setReviews(await fetchReviews(prod.id));
      }
    };
    load();
    return () => { active = false; };
  }, [id]);

  const { unitPrice, perLabel, daysCount } = useMemo(() => {
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000));
    if (durType === 'week') return { unitPrice: p?.priceWeek, perLabel: 'minggu', daysCount: 7 };
    if (durType === 'month') return { unitPrice: p?.priceMonth, perLabel: 'bulan', daysCount: 30 };
    return { unitPrice: (p?.price || 0) * days, perLabel: `${days} hari`, daysCount: days };
  }, [durType, startDate, endDate, p]);

  const subtotal = unitPrice * qty;
  const insurance = Math.round(subtotal * 0.05);
  const total = subtotal + insurance;

  if (loading) return <div className="page"><div className="container empty-state"><div className="es-icon"><Icon name="box" size={40} /></div><h3>Memuat produk…</h3></div></div>;
  if (!p) return <div className="page"><div className="container empty-state"><div className="es-icon"><Icon name="search" size={40} /></div><h3>Produk tidak ditemukan</h3><Link to="/browse">Kembali ke Browse</Link></div><Footer /></div>;

  const handleBook = () => {
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      showToast('Pilih tanggal yang valid!', '⚠️'); return;
    }
    addToCart(p, { qty, days: daysCount, startDate, endDate });
    navigate('/cart');
  };

  const submitReview = async () => {
    if (!user) { showToast('Masuk dulu untuk memberi ulasan', '🔒'); navigate('/login'); return; }
    if (!myText.trim()) { showToast('Tulis ulasanmu dulu', '⚠️'); return; }
    const res = await createReview({
      productId: p.id, rating: myRating, text: myText.trim(),
      authorId: user.id, authorName: profile?.full_name || user.email, direction: 'to_owner',
    });
    if (res.ok) {
      showToast('Ulasan terkirim! Terima kasih 🙌', '✅');
      setMyText('');
      setReviews(await fetchReviews(p.id));
    } else {
      showToast(res.reason || 'Gagal mengirim ulasan', '❌');
    }
  };

  const showProtection = () => openModal(
    <div>
      <div className="modal-header"><span className="modal-title">Rentix Protection</span><button className="modal-close-btn" onClick={closeModal} aria-label="Tutup">×</button></div>
      <p className="modal-text">Transaksi ini otomatis dilindungi asuransi pihak ketiga:</p>
      {PROTECTION_ITEMS.map(([title, desc]) => (
        <div key={title} className="modal-item">
          <span className="modal-item-mark"><Icon name="check" size={15} /></span>
          <div><strong>{title}</strong><p>{desc}</p></div>
        </div>
      ))}
      <button className={styles.modalBtn} onClick={closeModal}>Saya Mengerti</button>
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
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`${styles.thumb} ${i === 0 ? styles.thumbActive : ''}`}><img src={p.img} alt="" /></div>
              ))}
            </div>

            <h3 className={styles.reviewsTitle}>Ulasan Penyewa ({reviews.length})</h3>

            {/* WRITE A REVIEW (two-way rating) */}
            <div className={styles.reviewForm}>
              <div className={styles.reviewFormTitle}>Beri Ulasan untuk Pemilik</div>
              <div className={styles.starPicker}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.starBtn} ${n <= myRating ? styles.starActive : ''}`}
                    onClick={() => setMyRating(n)}
                    aria-label={`Beri ${n} bintang`}
                  >
                    <Icon name="star" size={22} style={{ fill: n <= myRating ? 'currentColor' : 'none' }} />
                  </button>
                ))}
              </div>
              <textarea className="form-textarea" placeholder="Bagaimana pengalaman sewamu?" value={myText} onChange={e => setMyText(e.target.value)} style={{ minHeight: 70 }} />
              <button className="btn-primary" style={{ marginTop: 10, padding: '9px 18px', borderRadius: 10 }} onClick={submitReview}>Kirim Ulasan</button>
            </div>

            {reviews.length === 0 && <p className={styles.noReviews}>Belum ada ulasan. Jadilah yang pertama!</p>}
            {reviews.map(r => (
              <div key={r.id || r.name} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.avatar}>{r.initial}</div>
                  <div><div className={styles.reviewName}>{r.name}</div><Stars value={r.rating} size={13} /></div>
                  <span className={styles.reviewDate}>{r.date}</span>
                </div>
                <p className={styles.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div>
            <div className={styles.detailBadges}>
              {p.badges.includes('protected') && <button className={styles.dbProtection} onClick={showProtection}><Icon name="shield" size={14} /> Rentix Protection</button>}
              {p.ownerVerified && <span className={styles.dbKyc}><Icon name="checkCircle" size={14} /> E-KYC Verified</span>}
              <span className={styles.dbWipe}><Icon name="data" size={14} /> Data Wipe</span>
            </div>
            <h1 className={styles.name}>{p.name}</h1>
            <div className={styles.ratingRow}>
              <Stars value={p.rating} size={16} />
              <strong style={{ color: 'var(--navy)' }}>{p.rating}</strong>
              <span style={{ color: 'var(--gray-400)' }}>({p.reviews} ulasan)</span>
              <span className={p.available ? styles.inStock : styles.outStock}>
                {p.available ? 'Tersedia' : 'Habis'}
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
                <div className={styles.ownerMeta}>4,9 rating · 98% response rate · respons 2 jam</div>
              </div>
              {p.ownerVerified && <div className={styles.ownerVerified} style={{ marginLeft: 'auto' }}><Icon name="checkCircle" size={14} /> Terverifikasi</div>}
            </div>

            {/* BOOKING CARD */}
            <div className={styles.bookCard}>
              <div className={styles.bookPrice}>
                <span className={styles.bookPriceVal}>{fmt(durType === 'day' ? p.price : durType === 'week' ? p.priceWeek : p.priceMonth)}</span>
                <span className={styles.bookPricePer}> / {durType === 'day' ? 'hari' : durType === 'week' ? 'minggu' : 'bulan'}</span>
              </div>
              <div className={styles.durTabs}>
                {DURATIONS.map(([v, l]) => (
                  <button key={v} className={`${styles.durTab} ${durType === v ? styles.durActive : ''}`} onClick={() => setDurType(v)}>{l}</button>
                ))}
              </div>
              <div className={styles.dateRow}>
                <div className={styles.dateField}><label>Tanggal Mulai</label><input type="date" min={today} value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div className={styles.dateField}><label>Tanggal Selesai</label><input type="date" min={today} value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
              </div>
              <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>Jumlah Unit</span>
                <div className={styles.qtyCtrl}>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(p.stock, q + 1))}>+</button>
                </div>
              </div>
              <div className={styles.summary}>
                <div className={styles.sumRow}><span>{fmt(unitPrice)} × {perLabel} × {qty}</span><span>{fmt(subtotal)}</span></div>
                <div className={styles.sumRow}><span className={styles.sumIcon}><Icon name="shield" size={14} /> Rentix Protection <span className={styles.proBadge}>5%</span></span><span>{fmt(insurance)}</span></div>
                <div className={`${styles.sumRow} ${styles.sumTotal}`}><span>Total</span><span>{fmt(total)}</span></div>
              </div>
              <button className={styles.bookBtn} onClick={handleBook}><Icon name="cart" size={18} /> Pesan Sekarang</button>
              <div className={styles.bookGuarantee}>
                <Icon name="shield" size={14} />
                Pembayaran aman · Batal gratis 24 jam
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ padding: '40px 0 60px' }}>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 20 }}>Produk Serupa</h3>
            <div className="product-grid">{related.map(pr => <ProductCard key={pr.id} product={pr} />)}</div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
