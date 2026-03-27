import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

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
              {['📘','📸','🐦','▶️'].map((ic,i) => <span key={i} className={styles.social}>{ic}</span>)}
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
            <a href="#">Rentix Protection</a>
            <a href="#">Verifikasi E-KYC</a>
            <a href="#">Pusat Bantuan</a>
            <a href="#">Kebijakan Privasi</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2025 Rentix. Semua hak dilindungi.</span>
          <div className={styles.badges}>
            <span className={styles.badge}>🛡️ Rentix Protected</span>
            <span className={styles.badge}>✅ E-KYC Verified</span>
            <span className={styles.badge}>🔒 SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
