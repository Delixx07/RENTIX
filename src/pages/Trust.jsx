import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import useStore from '../store/useStore';
import styles from './Trust.module.css';

const PILLARS = [
  { icon: 'lock', title: 'Verifikasi E-KYC', desc: 'Setiap pengguna wajib verifikasi KTP/KTM via biometrik & AI terintegrasi Dukcapil. Mencegah penipuan sejak awal.' },
  { icon: 'shield', title: 'Rentix Protection', desc: 'Asuransi pihak ketiga melindungi setiap transaksi dari kerusakan & kehilangan, hingga 100% nilai barang.' },
  { icon: 'handshake', title: 'Escrow Pembayaran', desc: 'Dana penyewa ditahan Rentix dan baru cair ke pemilik setelah barang dikonfirmasi diterima.' },
  { icon: 'star', title: 'Rating Dua Arah', desc: 'Penyewa menilai pemilik, pemilik menilai penyewa. Akuntabilitas terjaga di kedua sisi komunitas.' },
  { icon: 'data', title: 'Data Wipe Protocol', desc: 'Laptop & kamera wajib melewati penghapusan data tersertifikasi sebelum dikembalikan. Privasi terjamin.' },
  { icon: 'headset', title: 'Bantuan 24/7', desc: 'Tim Trust & Safety siap membantu kapan saja jika terjadi sengketa, kerusakan, atau pertanyaan.' },
];

const REPORT_TYPES = ['Penipuan / Fraud', 'Barang Rusak', 'Barang Hilang', 'Sengketa Pembayaran', 'Pelanggaran Pengguna', 'Lainnya'];

export default function Trust() {
  const { showToast } = useStore();
  const [type, setType] = useState('');
  const [detail, setDetail] = useState('');

  const submitReport = () => {
    if (!type || !detail.trim()) { showToast('Pilih jenis laporan dan isi detail', '⚠️'); return; }
    showToast('Laporan diterima. Tim kami merespons < 24 jam.', '✅');
    setType(''); setDetail('');
  };

  return (
    <div className="page">
      <div className={styles.header}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,.1)', color: '#BCDBDF', borderColor: 'rgba(255,255,255,.2)' }}>Trust & Safety Center</span>
          <h1 className={styles.heroTitle}>Komunitas yang Aman & Terpercaya</h1>
          <p className={styles.heroSub}>Lima pilar keamanan + bantuan 24/7 menjaga integritas setiap transaksi di Rentix.</p>
          <div className={styles.heroStats}>
            {[['24/7', 'Pusat Bantuan'], ['100%', 'Transaksi Berasuransi'], ['<24 jam', 'Respons Laporan'], ['4,9', 'Rating Komunitas']].map(([n, l]) => (
              <div key={l}><div className={styles.statNum}>{n}</div><div className={styles.statLbl}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Trust Ecosystem</span>
            <h2 className="section-title">Bagaimana Kami Menjaga Keamananmu</h2>
            <p className="section-sub">Sistem berlapis yang melindungi penyewa maupun pemilik aset.</p>
          </div>
          <div className={styles.grid}>
            {PILLARS.map((p) => (
              <div key={p.title} className={styles.card}>
                <div className={styles.icon}><Icon name={p.icon} size={26} /></div>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="section-header">
            <span className="section-tag">Laporkan Masalah</span>
            <h2 className="section-title">Butuh Bantuan? Laporkan di Sini</h2>
            <p className="section-sub">Tim Trust & Safety kami merespons setiap laporan dalam waktu kurang dari 24 jam.</p>
          </div>
          <div className={styles.reportCard}>
            <div className="form-field">
              <label className="form-label">Jenis Laporan</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Pilih jenis...</option>
                {REPORT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Detail Kejadian</label>
              <textarea className="form-textarea" placeholder="Ceritakan apa yang terjadi, sertakan nomor transaksi jika ada..." value={detail} onChange={(e) => setDetail(e.target.value)} />
            </div>
            <button className="btn-lg navy" style={{ width: '100%', justifyContent: 'center' }} onClick={submitReport}>Kirim Laporan</button>
            <p className={styles.contactRow}>Darurat? Hubungi hotline <strong>0800-1-RENTIX</strong> · <Link to="/how-it-works" className={styles.link}>Lihat FAQ</Link></p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
