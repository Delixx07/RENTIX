import { Link } from 'react-router-dom';
import Icon from './Icon';
import styles from './Footer.module.css';

const TRUST_BADGES = [
  { icon: 'shield', label: 'Rentix Protected' },
  { icon: 'checkCircle', label: 'E-KYC Verified' },
  { icon: 'lock', label: 'SSL Secured' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>
              <img src="/logo.png" alt="Rentix" className={styles.logoImg} />
              <span className={styles.logoText}>Rentix</span>
            </div>
            <p>Platform marketplace penyewaan gadget dan peralatan event terpercaya. Sewa aman, pakai nyaman.</p>
            <div className={styles.socials}>
              {['Instagram', 'TikTok', 'X', 'YouTube'].map((label) => (
                <span key={label} className={styles.social} title={label}>{label[0]}</span>
              ))}
            </div>
          </div>
          <div className={styles.col}>
            <h4>Produk</h4>
            <Link to="/browse">Kamera & Foto</Link>
            <Link to="/browse">Laptop & PC</Link>
            <Link to="/browse">Drone</Link>
            <Link to="/browse">Proyektor</Link>
            <Link to="/browse">Audio & Mic</Link>
          </div>
          <div className={styles.col}>
            <h4>Perusahaan</h4>
            <a href="#">Tentang Kami</a>
            <a href="#">Blog & Tips</a>
            <a href="#">Karir</a>
            <a href="#">Press Kit</a>
            <a href="#">Hubungi Kami</a>
          </div>
          <div className={styles.col}>
            <h4>Dukungan</h4>
            <Link to="/how-it-works">Cara Kerja</Link>
            <Link to="/trust">Trust & Safety Center</Link>
            <Link to="/promo">Promo Mahasiswa</Link>
            <Link to="/trust">Pusat Bantuan 24/7</Link>
            <a href="#">Kebijakan Privasi</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 Rentix. Semua hak dilindungi.</span>
          <div className={styles.badges}>
            {TRUST_BADGES.map((b) => (
              <span key={b.label} className={styles.badge}><Icon name={b.icon} size={14} /> {b.label}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
