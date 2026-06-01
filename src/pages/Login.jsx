import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { isSupabaseConfigured } from '../lib/supabase';
import styles from './Auth.module.css';

export default function Login() {
  const { showToast, login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { showToast('Isi email dan password', '⚠️'); return; }
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.ok) {
      showToast('Login berhasil! Selamat datang 👋', '✅');
      navigate('/');
    } else {
      showToast(res.reason || 'Login gagal', '❌');
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className={styles.card}>
        <div className={styles.logo}><img src="/logo.png" alt="Rentix" /></div>
        <h2 className={styles.title}>Masuk ke Rentix</h2>
        <p className={styles.sub}>Belum punya akun? <Link to="/register" className={styles.link}>Daftar gratis</Link></p>
        {!isSupabaseConfigured && (
          <div className={styles.kycBanner} style={{ background: 'rgba(247,170,0,.1)', borderColor: 'rgba(247,170,0,.3)' }}>
            <p style={{ fontSize: '.82rem' }}>⚠️ Backend belum dikonfigurasi. Jalankan SQL & isi <code>.env</code> untuk login nyata.</p>
          </div>
        )}
        <div className="form-field"><label className="form-label">Email</label>
          <input type="email" className="form-input" placeholder="email@contoh.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="form-field"><label className="form-label">Password</label>
          <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
        <div style={{ textAlign: 'right', margin: '-8px 0 14px' }}><a className={styles.link} style={{ fontSize: '.82rem' }}>Lupa password?</a></div>
        <button className={styles.authBtn} onClick={handleLogin} disabled={loading}>{loading ? 'Memproses…' : 'Masuk'}</button>
        <div className={styles.divider}><span>atau masuk dengan</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className={styles.socialBtn} onClick={() => showToast('Google Sign In segera hadir', 'ℹ️')}>Google</button>
          <button className={styles.socialBtn} onClick={() => showToast('Facebook Sign In segera hadir', 'ℹ️')}>Facebook</button>
        </div>
        <p className={styles.footer}>Dengan masuk, kamu menyetujui <a className={styles.link}>Syarat & Ketentuan</a> Rentix.</p>
      </div>
    </div>
  );
}
