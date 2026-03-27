import { useState } from 'react';
import Footer from '../components/Footer';
import styles from './HowItWorks.module.css';

const RENTER = [
  ['🔍','Temukan Produk','Cari gadget berdasarkan kategori, lokasi, atau tanggal sewa yang kamu butuhkan.'],
  ['✅','Verifikasi E-KYC','Unggah KTP/KTM sekali saja. Proses verifikasi otomatis hanya 5 menit via biometrik & AI.'],
  ['💳','Bayar Aman','Bayar via escrow Rentix. Dana hanya cair ke pemilik setelah kamu konfirmasi terima barang.'],
  ['📦','Terima & Cek Barang','Terima barang dari pemilik. Dokumentasikan kondisi awal bersama sebagai bukti.'],
  ['🎯','Pakai & Nikmati','Gunakan gadget sesuai kebutuhan. Semua terlindungi Rentix Protection selama masa sewa.'],
  ['↩️','Kembalikan Tepat Waktu','Kembalikan sesuai perjanjian. Deposit cair otomatis setelah cek kondisi selesai.'],
];

const OWNER = [
  ['📝','Daftarkan Barang','Upload foto, isi spesifikasi, dan tentukan harga harian/mingguan/bulanan.'],
  ['🔐','Verifikasi & Aktifkan','Akun verifikasi E-KYC. Produk aktif setelah review tim Rentix.'],
  ['📩','Terima Permintaan','Penyewa terverifikasi mengajukan sewa. Terima atau tolak dalam 24 jam.'],
  ['📬','Serahkan Barang','Serahkan ke penyewa. Dokumentasikan kondisi awal bersama.'],
  ['💰','Terima Pembayaran','Dana dari escrow cair otomatis setelah penyewa konfirmasi terima.'],
  ['🛡️','Barang Terlindungi','Kerusakan/kehilangan? Klaim ke asuransi Rentix dalam 24 jam.'],
];

const FAQ = [
  ['Apakah saya bisa menyewa tanpa verifikasi KTP?','Tidak. Verifikasi E-KYC wajib dilakukan sekali untuk menjaga keamanan semua pengguna. Proses ini otomatis dan hanya 5 menit.'],
  ['Apa yang terjadi jika barang rusak saat saya sewa?','Kerusakan tidak disengaja ditanggung oleh Rentix Protection. Laporkan dalam 24 jam dengan foto bukti.'],
  ['Berapa lama proses klaim asuransi?','Klaim diproses maks. 3×24 jam kerja. Dana ganti rugi langsung ditransfer ke rekening pemilik barang.'],
  ['Apakah data di laptop/kamera aman?','Ya. Setiap gadget dikembalikan wajib melalui Data Wipe Protocol. Data penyewa terjamin dihapus.'],
  ['Bisakah saya memperpanjang masa sewa?','Bisa! Hubungi pemilik via chat Rentix dan ajukan perpanjangan. Sistem update tanggal otomatis.'],
];

export default function HowItWorks() {
  const [tab, setTab] = useState('renter');
  const [openFaq, setOpenFaq] = useState(null);
  const steps = tab === 'renter' ? RENTER : OWNER;

  return (
    <div className="page">
      <div className={styles.header}>
        <div className="container">
          <span className="section-tag" style={{ background:'rgba(255,255,255,.1)', color:'#BCDBDF', borderColor:'rgba(255,255,255,.2)' }}>Cara Kerja</span>
          <h1 className={styles.heroTitle}>Bagaimana Rentix Bekerja?</h1>
          <p className={styles.heroSub}>Proses sewa-menyewa yang aman, mudah, dan transparan untuk semua pihak.</p>
        </div>
      </div>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab==='renter'?styles.active:''}`} onClick={() => setTab('renter')}>👥 Saya Penyewa</button>
            <button className={`${styles.tab} ${tab==='owner'?styles.active:''}`} onClick={() => setTab('owner')}>🏪 Saya Pemilik Barang</button>
          </div>
          <div className={styles.steps}>
            {steps.map(([ic, t, d], i) => (
              <div key={t} className={styles.step}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div>
                  <h4 className={styles.stepTitle}>{ic} {t}</h4>
                  <p className={styles.stepDesc}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="section-header">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Pertanyaan yang Sering Ditanyakan</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map(([q, a], i) => (
              <div key={q} className={styles.faqCard}>
                <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {q} <span>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div className={styles.faqA}>{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
