import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, fmt } from '../data/products';
import { fetchProducts, fetchReviews } from '../lib/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import Stars from '../components/Stars';
import useStore from '../store/useStore';
import styles from './Home.module.css';

const HERO_STATS = [
  ['1.200+', 'Produk Aktif'],
  ['8.500+', 'Pengguna Terverifikasi'],
  ['4,9', 'Rating Pengguna'],
];

const HOW_STEPS = [
  ['Pilih & Pesan', 'Temukan gadget, pilih tanggal sewa, dan lakukan pemesanan.'],
  ['Verifikasi & Bayar', 'Verifikasi E-KYC sekali saja. Bayar aman via escrow Rentix.'],
  ['Terima Barang', 'Barang dikirim atau diambil. Kondisi dicek bersama.'],
  ['Kembalikan', 'Kembalikan tepat waktu. Deposit cair otomatis.'],
];

const QUICK_CATS = [
  { icon: 'camera', label: 'Kamera & Foto', sub: '14 produk', bg: 'rgba(35,87,132,.08)' },
  { icon: 'laptop', label: 'Laptop & PC', sub: '11 produk', bg: 'rgba(247,170,0,.08)' },
  { icon: 'drone', label: 'Drone', sub: '4 produk', bg: 'rgba(64,168,196,.1)' },
  { icon: 'audio', label: 'Audio & Mic', sub: '5 produk', bg: 'rgba(188,219,223,.5)' },
];

const SECURITY = [
  {
    icon: 'lock', cls: styles.secBlue, title: 'Verifikasi E-KYC',
    desc: 'Pengguna wajib verifikasi KTP/KTM via teknologi biometrik, OCR, dan AI terintegrasi database Dukcapil resmi secara real-time.',
    features: ['Verifikasi KTP/KTM otomatis', 'Liveness check wajah (biometrik)', 'Terintegrasi database Dukcapil', 'Mematuhi regulasi OJK'],
    btn: 'Pelajari lebih lanjut', modal: 'kyc',
  },
  {
    icon: 'shield', cls: styles.secAmber, title: 'Rentix Protection',
    desc: 'Bekerja sama dengan asuransi pihak ketiga — setiap barang yang disewa otomatis terlindungi dari kerusakan tidak disengaja maupun kehilangan.',
    features: ['Proteksi kerusakan tidak disengaja', 'Ganti rugi kehilangan barang', 'Escrow pembayaran otomatis', 'Klaim cepat maks. 3x24 jam'],
    btn: 'Cek perlindungan', modal: 'protection',
  },
  {
    icon: 'data', cls: styles.secSky, title: 'Perlindungan Privasi',
    desc: 'Setelah sewa selesai, gadget seperti laptop & kamera wajib melewati Data Wipe Protocol bersertifikasi untuk menjamin privasi penyewa.',
    features: ['Factory reset & format wajib', 'Penghapusan data tersertifikasi', 'Data pribadi tidak dapat diakses', 'Berlaku untuk laptop & kamera'],
    btn: 'Lihat detail', modal: 'privacy',
  },
];

const PROTECTION_ITEMS = [
  ['Kerusakan Tidak Disengaja', 'Ditanggung hingga nilai penuh barang.'],
  ['Kehilangan', 'Asuransi menanggung ganti rugi ke pemilik.'],
  ['Penipuan & Fraud', 'Sistem escrow — dana cair setelah barang diterima.'],
  ['Data Wipe Protocol', 'Penghapusan data terjamin setelah masa sewa.'],
];

export default function Home() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const particleRef = useRef(null);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchReviews().then((list) => setReviews(list.slice(0, 6)));
  }, []);

  useEffect(() => {
    const el = particleRef.current;
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('div');
      dot.className = styles.particle;
      const size = Math.random() * 60 + 20;
      dot.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 12 + 8}s;animation-delay:${Math.random() * 8}s`;
      el.appendChild(dot);
    }
  }, []);

  const featured = products[0];
  const today = new Date().toISOString().split('T')[0];

  const openKycModal = () => openModal(
    <div>
      <div className="modal-header">
        <span className="modal-title">Verifikasi E-KYC</span>
        <button className="modal-close-btn" onClick={closeModal} aria-label="Tutup">×</button>
      </div>
      <p className="modal-text">
        Unggah KTP/KTM untuk verifikasi identitas. Data diproses aman menggunakan biometrik, OCR, dan AI terintegrasi database Dukcapil.
      </p>
      <div className="upload-zone">
        <Icon name="upload" size={28} />
        <p><strong>Klik untuk unggah KTP/KTM</strong><br />JPG, PNG maks. 5MB</p>
      </div>
      <ul className="modal-checklist">
        <li>Dicocokkan langsung ke database Dukcapil</li>
        <li>Liveness check biometrik otomatis</li>
        <li>Data terenkripsi AES-256</li>
      </ul>
      <button className={styles.modalBtn} onClick={() => { showToast('Verifikasi berhasil dikirim. Proses 5 menit.'); closeModal(); }}>
        Mulai Verifikasi
      </button>
    </div>
  );

  const openProtectionModal = () => openModal(
    <div>
      <div className="modal-header">
        <span className="modal-title">Rentix Protection</span>
        <button className="modal-close-btn" onClick={closeModal} aria-label="Tutup">×</button>
      </div>
      <p className="modal-text">Setiap transaksi otomatis dilindungi asuransi pihak ketiga:</p>
      {PROTECTION_ITEMS.map(([title, desc]) => (
        <div key={title} className="modal-item">
          <span className="modal-item-mark"><Icon name="check" size={15} /></span>
          <div><strong>{title}</strong><p>{desc}</p></div>
        </div>
      ))}
      <button className={styles.modalBtn} onClick={closeModal}>Saya Mengerti</button>
    </div>
  );

  const modalHandlers = {
    kyc: openKycModal,
    protection: openProtectionModal,
    privacy: () => showToast('Perlindungan privasi aktif di setiap transaksi'),
  };

  return (
    <div className="page">
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.particles} ref={particleRef} />
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Icon name="star" size={14} style={{ fill: 'currentColor' }} />
              Platform Penyewaan Gadget Terpercaya
            </div>
            <h1 className={styles.heroTitle}>Sewa Aman,<br /><span>Pakai Nyaman.</span></h1>
            <p className={styles.heroDesc}>
              Marketplace penyewaan gadget & peralatan event terlengkap. Kamera, laptop, proyektor, drone, dan lainnya — mulai harian hingga bulanan.
            </p>
            <div className={styles.heroActions}>
              <Link to="/browse" className="btn-lg amber"><Icon name="search" size={18} /> Jelajahi Sekarang</Link>
              <Link to="/how-it-works" className="btn-lg ghost">Cara Kerja</Link>
            </div>
            <div className={styles.heroStats}>
              {HERO_STATS.map(([num, label]) => (
                <div key={label}><div className={styles.statNum}>{num}</div><div className={styles.statLbl}>{label}</div></div>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <img src={featured?.img || '/product_camera.png'} alt="Produk unggulan" />
              <div className={styles.heroCardMeta}>
                <div>
                  <div className={styles.heroCardName}>{featured?.name || 'Sony Alpha A7 III Mirrorless'}</div>
                  <div className={styles.heroCardSub}>{featured?.rating || '4,9'} · {featured?.reviews || 128} ulasan</div>
                </div>
                <div className={styles.heroCardPrice}>{fmt(featured?.price || 350000)}<span>/hari</span></div>
              </div>
            </div>
            <div className={`${styles.floatBadge} ${styles.badgeTop}`}>
              <span className={styles.fbIcon}><Icon name="shield" size={20} /></span>
              <div><div className={styles.fbTitle}>Rentix Protected</div><div className={styles.fbSub}>Asuransi Otomatis</div></div>
            </div>
            <div className={`${styles.floatBadge} ${styles.badgeBtm}`}>
              <span className={styles.fbIcon}><Icon name="checkCircle" size={20} /></span>
              <div><div className={styles.fbTitle}>E-KYC Verified</div><div className={styles.fbSub}>Identitas Terverifikasi</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className={styles.searchOuter}>
        <div className="container">
          <div className={styles.searchBar}>
            <div className={styles.sbField}>
              <span className={styles.sbLabel}>Cari Produk</span>
              <input className={styles.sbInput} placeholder="Kamera, laptop, proyektor..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={styles.sbDivider} />
            <div className={styles.sbField}>
              <span className={styles.sbLabel}>Tanggal Mulai</span>
              <input type="date" className={styles.sbInput} min={today} />
            </div>
            <div className={styles.sbDivider} />
            <div className={styles.sbField}>
              <span className={styles.sbLabel}>Tanggal Selesai</span>
              <input type="date" className={styles.sbInput} min={today} />
            </div>
            <button className={styles.sbBtn} onClick={() => navigate(`/browse?q=${search}`)}>
              <Icon name="search" size={18} /> Cari
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className={`section-sm ${styles.catSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Kategori</span>
            <h2 className="section-title">Temukan Gadget yang Kamu Butuhkan</h2>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map((c) => (
              <Link to={`/browse?cat=${c.id}`} key={c.id} className={styles.catCard}>
                <div className={styles.catIcon}><Icon name={c.icon} size={26} /></div>
                <div className={styles.catName}>{c.name}</div>
                <div className={styles.catCount}>{c.count} produk</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Pilihan Populer</span>
            <h2 className="section-title">Produk Paling Banyak Disewa</h2>
            <p className="section-sub">Dipilih berdasarkan rating tertinggi dan ulasan terpercaya dari pengguna Rentix.</p>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/browse" className="btn-lg navy">Lihat Semua Produk <Icon name="arrowRight" size={18} /></Link>
          </div>
        </div>
      </section>

      {/* SECURITY FEATURES */}
      <section className="section" style={{ background: 'var(--mist-lt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Keamanan</span>
            <h2 className="section-title">Sewa dengan Tenang, Kami Jaga Keamananmu</h2>
            <p className="section-sub">Tiga pilar keamanan Rentix untuk pengalaman sewa yang aman dan terpercaya.</p>
          </div>
          <div className={styles.secGrid}>
            {SECURITY.map((sec) => (
              <div key={sec.title} className={styles.secCard}>
                <div className={`${styles.secIcon} ${sec.cls}`}><Icon name={sec.icon} size={28} /></div>
                <h3 className={styles.secTitle}>{sec.title}</h3>
                <p className={styles.secDesc}>{sec.desc}</p>
                <ul className={styles.secFeatures}>
                  {sec.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <button className={styles.secBtn} onClick={modalHandlers[sec.modal]}>{sec.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS TEASER */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className={styles.howGrid}>
            <div>
              <span className="section-tag">Cara Kerja</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Mudah dalam 4 Langkah</h2>
              <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 28px' }}>
                Dari menemukan gadget hingga menikmatinya — hanya butuh beberapa menit.
              </p>
              {HOW_STEPS.map(([title, desc], i) => (
                <div key={title} className={styles.howStep}>
                  <div className={styles.howNum}>{i + 1}</div>
                  <div><div className={styles.howStepTitle}>{title}</div><div className={styles.howStepDesc}>{desc}</div></div>
                </div>
              ))}
              <Link to="/how-it-works" className="btn-lg amber" style={{ marginTop: 8 }}>Pelajari Lebih Lanjut</Link>
            </div>
            <div className={styles.catMini}>
              {QUICK_CATS.map((c) => (
                <Link to="/browse" key={c.label} className={styles.catMiniCard} style={{ background: c.bg }}>
                  <span className={styles.catMiniEmoji}><Icon name={c.icon} size={34} /></span>
                  <div className={styles.catMiniLabel}>{c.label}</div>
                  <div className={styles.catMiniSub}>{c.sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Testimonial</span>
            <h2 className="section-title">Apa Kata Pengguna Kami</h2>
          </div>
          <div className={styles.reviewGrid}>
            {reviews.map((r) => (
              <div key={r.id || r.name} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.reviewAvatar}>{r.initial}</div>
                  <div>
                    <div className={styles.reviewName}>{r.name}</div>
                    <Stars value={r.rating} size={13} />
                  </div>
                  <span className={styles.reviewDate}>{r.date}</span>
                </div>
                <p className={styles.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.ctaBanner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Punya Gadget Menganggur?</h2>
          <p className={styles.ctaDesc}>Sewakan barangmu dan dapatkan passive income. Barang terlindungi asuransi Rentix 100%.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/list-item" className="btn-lg amber">Mulai Sewakan Barang</Link>
            <Link to="/register" className="btn-lg ghost">Daftar Gratis</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
