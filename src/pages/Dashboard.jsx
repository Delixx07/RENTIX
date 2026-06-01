import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyRentals } from '../lib/api';
import { fmt } from '../data/products';
import useStore from '../store/useStore';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import styles from './Dashboard.module.css';

const KYC_LABEL = { unverified: 'Belum Verifikasi', pending: 'Menunggu Review', verified: 'Terverifikasi' };
const STATUS_CLS = { menunggu: styles.stWait, escrow: styles.stEscrow, berjalan: styles.stRun, selesai: styles.stDone, batal: styles.stCancel };

export default function Dashboard() {
  const { user, profile, authLoading, logout, updateProfile, showToast } = useStore();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchMyRentals(user.id).then((r) => { setRentals(r); setLoading(false); });
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return <div className="page"><div className="container empty-state"><div className="es-icon"><Icon name="clock" size={40} /></div><h3>Memuat…</h3></div></div>;
  }

  const kyc = profile?.kyc_status || 'unverified';

  const verifyKyc = async () => {
    await updateProfile({ kyc_status: 'verified' });
    showToast('E-KYC terverifikasi! Akunmu kini tepercaya.', '✅');
  };
  const verifyStudent = async () => {
    await updateProfile({ is_student: true });
    showToast('Status mahasiswa aktif! Promo terbuka 🎓', '🎓');
  };

  const totalSpent = rentals.reduce((s, r) => s + (r.total || 0), 0);

  return (
    <div className="page">
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headInner}>
            <div className={styles.avatar}>{(profile?.full_name || user.email)[0].toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <h1 className={styles.name}>{profile?.full_name || 'Pengguna Rentix'}</h1>
              <p className={styles.email}>{user.email}</p>
              <div className={styles.tags}>
                <span className={styles.tag}>
                  <Icon name={kyc === 'verified' ? 'checkCircle' : 'alert'} size={13} /> {KYC_LABEL[kyc]}
                </span>
                {profile?.is_student && <span className={styles.tag}><Icon name="graduation" size={13} /> Mahasiswa</span>}
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>
              <Icon name="logout" size={16} /> Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 60px' }}>
        {/* STAT CARDS */}
        <div className={styles.stats}>
          {[['Total Sewa', rentals.length], ['Total Pengeluaran', fmt(totalSpent)], ['Status Akun', KYC_LABEL[kyc]]].map(([l, v]) => (
            <div key={l} className={styles.statCard}><div className={styles.statVal}>{v}</div><div className={styles.statLbl}>{l}</div></div>
          ))}
        </div>

        {/* VERIFICATION */}
        <div className={styles.verifyGrid}>
          <div className={styles.verifyCard}>
            <div className={styles.vTitle}><Icon name="lock" size={18} /> Verifikasi E-KYC</div>
            <p className={styles.vDesc}>Unggah KTP untuk verifikasi identitas via biometrik & Dukcapil. Wajib sebelum menyewa.</p>
            {kyc === 'verified'
              ? <div className={styles.vDone}><Icon name="checkCircle" size={16} /> Identitas terverifikasi</div>
              : <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: 10 }} onClick={verifyKyc}>Mulai Verifikasi KTP</button>}
          </div>
          <div className={styles.verifyCard}>
            <div className={styles.vTitle}><Icon name="graduation" size={18} /> Status Mahasiswa</div>
            <p className={styles.vDesc}>Unggah KTM untuk membuka Promo Mahasiswa (diskon hingga 20%).</p>
            {profile?.is_student
              ? <div className={styles.vDone}><Icon name="checkCircle" size={16} /> Mahasiswa terverifikasi</div>
              : <button className="btn-outline" style={{ padding: '10px 20px' }} onClick={verifyStudent}>Verifikasi KTM</button>}
          </div>
        </div>

        {/* RENTAL HISTORY */}
        <h2 className={styles.sectionTitle}>Riwayat Sewa</h2>
        {loading ? (
          <div className="empty-state"><div className="es-icon"><Icon name="box" size={40} /></div><h3>Memuat riwayat…</h3></div>
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <div className="es-icon"><Icon name="box" size={40} /></div>
            <h3>Belum ada transaksi</h3>
            <p>Sewaanmu akan muncul di sini.</p>
            <Link to="/browse" className="btn-lg amber" style={{ marginTop: 18 }}>Jelajahi Produk</Link>
          </div>
        ) : (
          <div className={styles.rentalList}>
            {rentals.map((r) => (
              <div key={r.id} className={styles.rental}>
                <div style={{ flex: 1 }}>
                  <div className={styles.rName}>{r.product_name}</div>
                  <div className={styles.rMeta}>
                    {r.start_date && r.end_date ? `${r.start_date} → ${r.end_date}` : `${r.days} hari`} · {r.qty} unit
                  </div>
                </div>
                <span className={`${styles.status} ${STATUS_CLS[r.status] || ''}`}>{r.status}</span>
                <div className={styles.rTotal}>{fmt(r.total)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
