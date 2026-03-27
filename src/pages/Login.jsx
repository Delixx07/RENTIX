import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import styles from './Auth.module.css';

export default function Login() {
  const { showToast } = useStore();
  const navigate = useNavigate();
  return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div className={styles.card}>
        <div className={styles.logo}><img src="/logo.png" alt="Rentix" /></div>
        <h2 className={styles.title}>Masuk ke Rentix</h2>
        <p className={styles.sub}>Belum punya akun? <Link to="/register" className={styles.link}>Daftar gratis</Link></p>
        <div className="form-field"><label className="form-label">Email / Nomor HP</label><input type="email" className="form-input" placeholder="email@contoh.com" /></div>
        <div className="form-field"><label className="form-label">Password</label><input type="password" className="form-input" placeholder="••••••••" /></div>
        <div style={{ textAlign:'right', margin:'-8px 0 14px' }}><a className={styles.link} style={{ fontSize:'.82rem' }}>Lupa password?</a></div>
        <button className={styles.authBtn} onClick={() => { showToast('Login berhasil! Selamat datang 👋','✅'); navigate('/'); }}>Masuk</button>
        <div className={styles.divider}><span>atau masuk dengan</span></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button className={styles.socialBtn} onClick={() => showToast('Google Sign In coming soon','ℹ️')}>🔵 Google</button>
          <button className={styles.socialBtn} onClick={() => showToast('Facebook Sign In coming soon','ℹ️')}>🔷 Facebook</button>
        </div>
        <p className={styles.footer}>Dengan masuk, kamu menyetujui <a className={styles.link}>Syarat & Ketentuan</a> Rentix.</p>
      </div>
    </div>
  );
}
