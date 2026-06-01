import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPromos } from '../lib/api';
import useStore from '../store/useStore';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import styles from './Promo.module.css';

const AUD = {
  student: { icon: 'graduation', label: 'Mahasiswa' },
  campus: { icon: 'building', label: 'B2B Kampus' },
  all: { icon: 'spark', label: 'Semua Pengguna' },
};

const B2B_ITEMS = [
  { icon: 'camera', title: 'Paket Dokumentasi Event', desc: 'Kamera, drone, dan gimbal untuk meliput acara kampus.' },
  { icon: 'radio', title: 'Paket Operasional', desc: 'HT, proyektor, dan sound system untuk koordinasi panitia.' },
  { icon: 'card', title: 'Harga Khusus Organisasi', desc: 'Tarif kemitraan + invoice resmi untuk pertanggungjawaban.' },
];

const PREMIUM_PERKS = [
  'Prioritas tampil di hasil pencarian',
  'Badge Premium di setiap produk',
  'Statistik performa & insight penyewa',
  'Dukungan prioritas dari tim Rentix',
];

export default function Promo() {
  const { showToast, user, profile } = useStore();
  const [promos, setPromos] = useState([]);

  useEffect(() => { fetchPromos().then(setPromos); }, []);

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    showToast(`Kode ${code} disalin!`, '📋');
  };

  const isStudent = profile?.is_student;

  return (
    <div className="page">
      <div className={styles.header}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,.1)', color: '#BCDBDF', borderColor: 'rgba(255,255,255,.2)' }}>Promo & Program Pendidikan</span>
          <h1 className={styles.heroTitle}>Sewa Lebih Hemat untuk Mahasiswa & Kampus</h1>
          <p className={styles.heroSub}>Mendukung produktivitas mahasiswa, content creator, dan panitia event kampus se-Surabaya.</p>
        </div>
      </div>

      {/* STUDENT VERIFY BANNER */}
      <div className="container">
        <div className={styles.studentBanner}>
          <div className={styles.sbIcon}><Icon name="graduation" size={26} /></div>
          <div style={{ flex: 1 }}>
            <div className={styles.sbTitle}>{isStudent ? 'Status Mahasiswa Terverifikasi' : 'Verifikasi Status Mahasiswa'}</div>
            <p className={styles.sbDesc}>
              {isStudent
                ? 'Kamu sudah bisa pakai semua kode promo mahasiswa. Selamat berkarya!'
                : 'Unggah KTM dari Dashboard untuk membuka diskon mahasiswa hingga 20%.'}
            </p>
          </div>
          {!isStudent && <Link to={user ? '/dashboard' : '/login'} className="btn-primary" style={{ padding: '10px 20px', borderRadius: 10 }}>Verifikasi KTM</Link>}
        </div>
      </div>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Kode Promo Aktif</span>
            <h2 className="section-title">Pakai & Hemat Sekarang</h2>
          </div>
          <div className={styles.grid}>
            {promos.map((p) => {
              const locked = p.audience === 'student' && !isStudent;
              const aud = AUD[p.audience] || AUD.all;
              return (
                <div key={p.id || p.code} className={`${styles.promoCard} ${locked ? styles.locked : ''}`}>
                  <div className={styles.promoTop}>
                    <span className={styles.aud}><Icon name={aud.icon} size={13} /> {aud.label}</span>
                    <span className={styles.discount}>{p.discount}%</span>
                  </div>
                  <h3 className={styles.promoTitle}>{p.title}</h3>
                  <p className={styles.promoDesc}>{p.description}</p>
                  <div className={styles.codeRow}>
                    <code className={styles.code}>{p.code}</code>
                    <button className={styles.copyBtn} disabled={locked} onClick={() => copyCode(p.code)}>
                      {locked ? <><Icon name="lock" size={14} /> Khusus Mahasiswa</> : <><Icon name="copy" size={14} /> Salin Kode</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* B2B KAMPUS */}
      <section className="section" style={{ background: 'var(--mist-lt)' }}>
        <div className="container">
          <div className={styles.b2bGrid}>
            <div>
              <span className="section-tag">B2B Kampus</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Kemitraan untuk BEM, Hima & UKM</h2>
              <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 24px' }}>
                Rentix bekerja sama langsung dengan organisasi kampus di Surabaya untuk menyediakan alat dokumentasi & operasional event dengan harga khusus.
              </p>
              {B2B_ITEMS.map((item) => (
                <div key={item.title} className={styles.b2bItem}>
                  <span className={styles.b2bIcon}><Icon name={item.icon} size={22} /></span>
                  <div><div className={styles.b2bTitle}>{item.title}</div><div className={styles.b2bDesc}>{item.desc}</div></div>
                </div>
              ))}
              <button className="btn-lg amber" style={{ marginTop: 12 }} onClick={() => showToast('Tim B2B kami akan menghubungimu!', '🤝')}>Ajukan Kemitraan Kampus</button>
            </div>

            {/* PREMIUM VENDOR */}
            <div className={styles.premiumCard}>
              <div className={styles.premiumBadge}><Icon name="star" size={13} style={{ fill: 'currentColor' }} /> Premium Vendor</div>
              <h3 className={styles.premiumTitle}>Tampil Teratas, Sewa Lebih Cepat</h3>
              <p className={styles.premiumDesc}>Vendor premium muncul di urutan teratas pencarian & beranda — meningkatkan visibilitas dan jumlah transaksi.</p>
              <ul className={styles.premiumList}>
                {PREMIUM_PERKS.map((perk) => <li key={perk}>{perk}</li>)}
              </ul>
              <div className={styles.premiumPrice}>Rp99.000<span>/bulan</span></div>
              <button className="btn-lg navy" style={{ width: '100%', justifyContent: 'center' }} onClick={() => showToast('Upgrade Premium Vendor segera hadir', '⭐')}>Jadi Premium Vendor</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
