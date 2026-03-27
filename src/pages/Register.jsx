import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import styles from './Auth.module.css';

export default function Register() {
  const { showToast } = useStore();
  const navigate = useNavigate();
  return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', paddingTop:100, paddingBottom:60 }}>
      <div className={styles.card} style={{ maxWidth:480 }}>
        <div className={styles.logo}><img src="/logo.png" alt="Rentix" /></div>
        <h2 className={styles.title}>Buat Akun Rentix</h2>
        <p className={styles.sub}>Sudah punya akun? <Link to="/login" className={styles.link}>Masuk di sini</Link></p>
        <div className={styles.kycBanner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, color:'#40A8C4' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <p><strong>Verifikasi E-KYC diperlukan.</strong> Setelah daftar, upload KTP/KTM untuk verifikasi identitas. Proses aman & hanya 5 menit.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-field"><label className="form-label">Nama Depan</label><input className="form-input" placeholder="Budi" /></div>
          <div className="form-field"><label className="form-label">Nama Belakang</label><input className="form-input" placeholder="Santoso" /></div>
        </div>
        <div className="form-field"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="email@contoh.com" /></div>
        <div className="form-field"><label className="form-label">Nomor HP</label><input type="tel" className="form-input" placeholder="08xxxxxxxxxx" /></div>
        <div className="form-field"><label className="form-label">Password</label><input type="password" className="form-input" placeholder="Min. 8 karakter" /></div>
        <div className="form-field"><label className="form-label">Konfirmasi Password</label><input type="password" className="form-input" placeholder="Ulangi password" /></div>
        <label style={{ display:'flex', alignItems:'flex-start', gap:10, margin:'6px 0 16px', cursor:'pointer' }}>
          <input type="checkbox" style={{ marginTop:3, accentColor:'#40A8C4' }} />
          <span style={{ fontSize:'.82rem', color:'#475569', lineHeight:1.5 }}>Saya menyetujui <a className={styles.link}>Syarat & Ketentuan</a> dan <a className={styles.link}>Kebijakan Privasi</a> Rentix.</span>
        </label>
        <button className={styles.authBtn} onClick={() => { showToast('Akun berhasil dibuat! Cek email untuk verifikasi.','🎉'); navigate('/'); }}>Buat Akun</button>
      </div>
    </div>
  );
}
