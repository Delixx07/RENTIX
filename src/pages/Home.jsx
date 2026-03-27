import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, REVIEWS, fmt } from '../data/products';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import useStore from '../store/useStore';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useStore();
  const [search, setSearch] = useState('');
  const particleRef = useRef(null);

  useEffect(() => {
    const el = particleRef.current;
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = styles.particle;
      const s = Math.random() * 60 + 20;
      p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*8}s`;
      el.appendChild(p);
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const showKycModal = () => openModal(
    <div>
      <div className="modal-header">
        <span className="modal-title">🔐 Verifikasi E-KYC</span>
        <button className="modal-close-btn" onClick={closeModal}>✕</button>
      </div>
      <p style={{ fontSize: '.87rem', color: 'var(--gray-600)', marginBottom: 16, lineHeight: 1.65 }}>
        Unggah KTP/KTM untuk verifikasi identitas. Data diproses aman menggunakan biometrik, OCR, dan AI terintegrasi database Dukcapil.
      </p>
      <div className="upload-zone"><div style={{ fontSize: '2rem', marginBottom: 10 }}>📄</div><p><strong>Klik untuk unggah KTP/KTM</strong><br />JPG, PNG maks. 5MB</p></div>
      <div style={{ background: 'rgba(64,168,196,.08)', border: '1px solid rgba(64,168,196,.2)', borderRadius: 10, padding: 12, fontSize: '.8rem', color: 'var(--gray-600)', lineHeight: 1.6, marginTop: 14 }}>
        ✅ Dicocokkan langsung ke database Dukcapil<br />✅ Liveness check biometrik otomatis<br />✅ Data terenkripsi AES-256
      </div>
      <button className={styles.modalBtn} onClick={() => { showToast('Verifikasi berhasil dikirim! Proses 5 menit.', '✅'); closeModal(); }}>Mulai Verifikasi</button>
    </div>
  );

  const showProtectionModal = () => openModal(
    <div>
      <div className="modal-header">
        <span className="modal-title">🛡️ Rentix Protection</span>
        <button className="modal-close-btn" onClick={closeModal}>✕</button>
      </div>
      <p style={{ fontSize: '.87rem', color: 'var(--gray-600)', marginBottom: 20, lineHeight: 1.65 }}>Setiap transaksi otomatis dilindungi asuransi pihak ketiga:</p>
      {[
        ['⚡', 'Kerusakan Tidak Disengaja', 'Ditanggung hingga nilai penuh barang.'],
        ['🔒', 'Kehilangan', 'Asuransi menanggung ganti rugi ke pemilik.'],
        ['🚫', 'Penipuan & Fraud', 'Sistem escrow — dana cair setelah barang diterima.'],
        ['🗑️', 'Data Wipe Protocol', 'Penghapusan data terjamin setelah masa sewa.'],
      ].map(([ic, t, d]) => (
        <div key={t} style={{ display: 'flex', gap: 12, padding: '14px', background: 'var(--gray-50)', borderRadius: 12, marginBottom: 10 }}>
          <span style={{ fontSize: '1.3rem' }}>{ic}</span>
          <div><strong style={{ fontSize: '.9rem', color: 'var(--navy)' }}>{t}</strong><p style={{ fontSize: '.82rem', color: 'var(--gray-500)', marginTop: 3, lineHeight: 1.5 }}>{d}</p></div>
        </div>
      ))}
      <button className={styles.modalBtn} onClick={closeModal}>Saya Mengerti</button>
    </div>
  );

  return (
    <div className="page">
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.particles} ref={particleRef} />
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Platform Penyewaan Gadget Terpercaya #1
            </div>
            <h1 className={styles.heroTitle}>Sewa Aman,<br /><span>Pakai Nyaman.</span></h1>
            <p className={styles.heroDesc}>Marketplace penyewaan gadget & peralatan event terlengkap. Kamera, laptop, proyektor, drone, dan lebih banyak — mulai harian hingga bulanan.</p>
            <div className={styles.heroActions}>
              <Link to="/browse" className="btn-lg amber">🔍 Jelajahi Sekarang</Link>
              <Link to="/how-it-works" className="btn-lg ghost">Cara Kerja</Link>
            </div>
            <div className={styles.heroStats}>
              {[['1,200+','Produk Aktif'],['8,500+','Pengguna Terverifikasi'],['4.9★','Rating Pengguna']].map(([n,l]) => (
                <div key={l}><div className={styles.statNum}>{n}</div><div className={styles.statLbl}>{l}</div></div>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <img src={PRODUCTS[0].img} alt="Featured" />
              <div className={styles.heroCardMeta}>
                <div>
                  <div className={styles.heroCardName}>{PRODUCTS[0].name}</div>
                  <div className={styles.heroCardSub}>⭐ 4.9 · 128 ulasan</div>
                </div>
                <div className={styles.heroCardPrice}>{fmt(PRODUCTS[0].price)}<span>/hari</span></div>
              </div>
            </div>
            <div className={`${styles.floatBadge} ${styles.badgeTop}`}>
              <span className={styles.fbIcon}>🛡️</span>
              <div><div className={styles.fbTitle}>Rentix Protected</div><div className={styles.fbSub}>Asuransi Otomatis</div></div>
            </div>
            <div className={`${styles.floatBadge} ${styles.badgeBtm}`}>
              <span className={styles.fbIcon}>✅</span>
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
              <input className={styles.sbInput} placeholder="Kamera, laptop, proyektor..." value={search} onChange={e => setSearch(e.target.value)} />
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Cari
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
            {CATEGORIES.map(c => (
              <Link to={`/browse?cat=${c.id}`} key={c.id} className={styles.catCard}>
                <div className={styles.catIcon}>{c.icon}</div>
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
            {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/browse" className="btn-lg navy">Lihat Semua Produk →</Link>
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
            {[
              { icon: '🔐', cls: styles.secBlue, title: 'Verifikasi E-KYC', desc: 'Pengguna wajib verifikasi KTP/KTM via teknologi biometrik, OCR, dan AI terintegrasi database Dukcapil resmi secara real-time.', features: ['Verifikasi KTP/KTM otomatis', 'Liveness check wajah (biometrik)', 'Terintegrasi database Dukcapil', 'Mematuhi regulasi OJK'], btn: 'Pelajari Lebih →', action: showKycModal },
              { icon: '🛡️', cls: styles.secAmber, title: 'Rentix Protection', desc: 'Bekerja sama dengan asuransi pihak ketiga — setiap barang yang disewa otomatis terlindungi dari kerusakan tidak disengaja maupun kehilangan.', features: ['Proteksi kerusakan tidak disengaja', 'Ganti rugi kehilangan barang', 'Escrow pembayaran otomatis', 'Klaim cepat maks. 3×24 jam'], btn: 'Cek Coverage →', action: showProtectionModal },
              { icon: '🗑️', cls: styles.secSky, title: 'Perlindungan Privasi', desc: 'Setelah sewa selesai, gadget seperti laptop & kamera wajib melewati Data Wipe Protocol sertifikasi untuk jaminan privasi penyewa.', features: ['Factory reset & format wajib', 'Sertifikasi wipe tersertifikasi', 'Data pribadi tidak dapat diakses', 'Berlaku untuk laptop & kamera'], btn: 'Lihat Detail →', action: () => showToast('Fitur Privasi aktif di setiap transaksi', '🔒') },
            ].map(sec => (
              <div key={sec.title} className={styles.secCard}>
                <div className={`${styles.secIcon} ${sec.cls}`}>{sec.icon}</div>
                <h3 className={styles.secTitle}>{sec.title}</h3>
                <p className={styles.secDesc}>{sec.desc}</p>
                <ul className={styles.secFeatures}>
                  {sec.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className={styles.secBtn} onClick={sec.action}>{sec.btn}</button>
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
              <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 28px' }}>Dari menemukan gadget hingga menikmatinya — hanya butuh beberapa menit.</p>
              {[['1','Pilih & Pesan','Temukan gadget, pilih tanggal sewa, dan lakukan pemesanan.'],['2','Verifikasi & Bayar','Verifikasi E-KYC sekali saja. Bayar aman via escrow Rentix.'],['3','Terima Barang','Barang dikirim/diambil. Kondisi dicek bersama.'],['4','Kembalikan','Kembalikan tepat waktu. Deposit cair otomatis.']].map(([n,t,d]) => (
                <div key={n} className={styles.howStep}>
                  <div className={styles.howNum}>{n}</div>
                  <div><div className={styles.howStepTitle}>{t}</div><div className={styles.howStepDesc}>{d}</div></div>
                </div>
              ))}
              <Link to="/how-it-works" className="btn-lg amber" style={{ marginTop: 8 }}>Pelajari Lebih Lanjut</Link>
            </div>
            <div className={styles.catMini}>
              {[{e:'📷',l:'Kamera & Foto',s:'14 produk',c:'rgba(35,87,132,.08)'},{e:'💻',l:'Laptop & PC',s:'11 produk',c:'rgba(247,170,0,.08)'},{e:'🚁',l:'Drone',s:'4 produk',c:'rgba(64,168,196,.1)'},{e:'🎙️',l:'Audio & Mic',s:'5 produk',c:'rgba(188,219,223,.5)'}].map(c => (
                <Link to="/browse" key={c.l} className={styles.catMiniCard} style={{ background: c.c }}>
                  <span className={styles.catMiniEmoji}>{c.e}</span>
                  <div className={styles.catMiniLabel}>{c.l}</div>
                  <div className={styles.catMiniSub}>{c.s}</div>
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
            {REVIEWS.map(r => (
              <div key={r.name} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.reviewAvatar}>{r.initial}</div>
                  <div>
                    <div className={styles.reviewName}>{r.name}</div>
                    <div style={{ color: 'var(--amber)', fontSize: '.8rem' }}>{'★'.repeat(r.rating)}</div>
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
            <Link to="/list-item" className="btn-lg amber">🚀 Mulai Sewakan Barang</Link>
            <Link to="/register" className="btn-lg ghost">Daftar Gratis</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
