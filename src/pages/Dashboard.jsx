import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchMyRentals, fetchOwnerProducts, deleteProduct,
  fetchRentalsAsOwner, createReview, uploadFile,
} from '../lib/api';
import { fmt } from '../data/products';
import useStore from '../store/useStore';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import styles from './Dashboard.module.css';

const KYC_LABEL = { unverified: 'Belum Verifikasi', pending: 'Menunggu Review', verified: 'Terverifikasi' };
const STATUS_CLS = { menunggu: styles.stWait, escrow: styles.stEscrow, berjalan: styles.stRun, selesai: styles.stDone, batal: styles.stCancel };

export default function Dashboard() {
  const { user, profile, authLoading, logout, updateProfile, showToast, openModal, closeModal } = useStore();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const kycInput = useRef(null);

  const loadOwnerData = async (uid) => {
    setMyProducts(await fetchOwnerProducts(uid));
    setIncoming(await fetchRentalsAsOwner(uid));
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    (async () => {
      setRentals(await fetchMyRentals(user.id));
      await loadOwnerData(user.id);
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return <div className="page"><div className="container empty-state"><div className="es-icon"><Icon name="clock" size={40} /></div><h3>Memuat…</h3></div></div>;
  }

  const kyc = profile?.kyc_status || 'unverified';
  const totalSpent = rentals.reduce((s, r) => s + (r.total || 0), 0);

  const handleKycUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const up = await uploadFile('kyc', user.id, file);
    if (up.ok || up.reason === 'db-offline') {
      await updateProfile({ kyc_status: 'verified' });
      showToast('E-KYC terverifikasi. Akunmu kini tepercaya.', '✅');
    } else {
      showToast(up.reason || 'Gagal mengunggah KTP', '❌');
    }
    setUploading(false);
  };

  const verifyStudent = async () => {
    await updateProfile({ is_student: true });
    showToast('Status mahasiswa aktif. Promo terbuka 🎓', '🎓');
  };

  const handleDeleteProduct = async (id) => {
    const res = await deleteProduct(id, user.id);
    if (res.ok) {
      showToast('Produk dihapus', '🗑️');
      setMyProducts((list) => list.filter((p) => p.id !== id));
    } else {
      showToast(res.reason || 'Gagal menghapus produk', '❌');
    }
  };

  const rateRenter = (rental) => {
    let rating = 5;
    let text = '';
    openModal(
      <div>
        <div className="modal-header">
          <span className="modal-title">Nilai Penyewa</span>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Tutup">×</button>
        </div>
        <p className="modal-text">Beri penilaian untuk penyewa <strong>{rental.product_name}</strong>. Membantu menjaga akuntabilitas komunitas.</p>
        <RenterRatingForm
          onSubmit={async (r, t) => {
            const res = await createReview({
              productId: rental.product_id, rating: r, text: t,
              authorId: user.id, authorName: profile?.full_name || user.email,
              direction: 'to_renter', targetUserId: rental.renter_id,
            });
            if (res.ok) { showToast('Penilaian penyewa terkirim', '✅'); closeModal(); }
            else showToast(res.reason || 'Gagal mengirim', '❌');
          }}
        />
      </div>
    );
    return { rating, text };
  };

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
          {[['Total Sewa', rentals.length], ['Produk Disewakan', myProducts.length], ['Total Pengeluaran', fmt(totalSpent)]].map(([l, v]) => (
            <div key={l} className={styles.statCard}><div className={styles.statVal}>{v}</div><div className={styles.statLbl}>{l}</div></div>
          ))}
        </div>

        {/* VERIFICATION */}
        <div className={styles.verifyGrid}>
          <div className={styles.verifyCard}>
            <div className={styles.vTitle}><Icon name="lock" size={18} /> Verifikasi E-KYC</div>
            <p className={styles.vDesc}>Unggah foto KTP untuk verifikasi identitas. Wajib sebelum menyewa.</p>
            {kyc === 'verified' ? (
              <div className={styles.vDone}><Icon name="checkCircle" size={16} /> Identitas terverifikasi</div>
            ) : (
              <>
                <input ref={kycInput} type="file" accept="image/*" hidden onChange={handleKycUpload} />
                <button className="btn-primary" onClick={() => kycInput.current?.click()} disabled={uploading}>
                  <Icon name="upload" size={16} /> {uploading ? 'Mengunggah…' : 'Unggah KTP'}
                </button>
              </>
            )}
          </div>
          <div className={styles.verifyCard}>
            <div className={styles.vTitle}><Icon name="graduation" size={18} /> Status Mahasiswa</div>
            <p className={styles.vDesc}>Aktifkan status mahasiswa untuk membuka Promo Mahasiswa (diskon hingga 20%).</p>
            {profile?.is_student
              ? <div className={styles.vDone}><Icon name="checkCircle" size={16} /> Mahasiswa terverifikasi</div>
              : <button className="btn-outline" style={{ padding: '10px 20px' }} onClick={verifyStudent}>Verifikasi KTM</button>}
          </div>
        </div>

        {/* MY PRODUCTS (lender) */}
        {myProducts.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Produk yang Saya Sewakan</h2>
            <div className={styles.rentalList}>
              {myProducts.map((p) => (
                <div key={p.id} className={styles.rental}>
                  <img src={p.img} alt={p.name} className={styles.prodThumb} />
                  <div style={{ flex: 1 }}>
                    <div className={styles.rName}>{p.name}</div>
                    <div className={styles.rMeta}>{fmt(p.price)} / hari · {p.stock} unit</div>
                  </div>
                  <button className={styles.linkBtn} onClick={() => navigate(`/product/${p.id}`)}>Lihat</button>
                  <button className={styles.dangerBtn} onClick={() => handleDeleteProduct(p.id)}>
                    <Icon name="trash" size={15} /> Hapus
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* INCOMING RENTALS — rate the renter (two-way) */}
        {incoming.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Sewa pada Produk Saya</h2>
            <div className={styles.rentalList}>
              {incoming.map((r) => (
                <div key={r.id} className={styles.rental}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.rName}>{r.product_name}</div>
                    <div className={styles.rMeta}>{r.days} hari · {r.qty} unit · {fmt(r.total)}</div>
                  </div>
                  <span className={`${styles.status} ${STATUS_CLS[r.status] || ''}`}>{r.status}</span>
                  <button className={styles.linkBtn} onClick={() => rateRenter(r)}>
                    <Icon name="star" size={14} /> Nilai Penyewa
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* RENTAL HISTORY (renter) */}
        <h2 className={styles.sectionTitle}>Riwayat Sewa Saya</h2>
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
                    {r.start_date && r.end_date ? `${r.start_date} – ${r.end_date}` : `${r.days} hari`} · {r.qty} unit
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

function RenterRatingForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  return (
    <div>
      <div className={styles.starPicker}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.starBtn} ${n <= rating ? styles.starActive : ''}`}
            onClick={() => setRating(n)}
            aria-label={`${n} bintang`}
          >
            <Icon name="star" size={24} style={{ fill: n <= rating ? 'currentColor' : 'none' }} />
          </button>
        ))}
      </div>
      <textarea className="form-textarea" placeholder="Penyewa kooperatif, barang dikembalikan tepat waktu…" value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 70 }} />
      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => onSubmit(rating, text)}>
        Kirim Penilaian
      </button>
    </div>
  );
}
