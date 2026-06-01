import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { isSupabaseConfigured } from '../lib/supabase';
import styles from './Auth.module.css';

export default function Register() {
  const { showToast, register } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ first: '', last: '', email: '', phone: '', pw: '', pw2: '' });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const handleRegister = async () => {
    if (!f.email || !f.pw) { showToast('Email dan password wajib diisi', '⚠️'); return; }
    if (f.pw.length < 6) { showToast('Password minimal 6 karakter', '⚠️'); return; }
    if (f.pw !== f.pw2) { showToast('Konfirmasi password tidak cocok', '⚠️'); return; }
    if (!agree) { showToast('Setujui Syarat & Ketentuan dulu', '⚠️'); return; }
    setLoading(true);
    const res = await register({
      email: f.email, password: f.pw,
      fullName: `${f.first} ${f.last}`.trim(), phone: f.phone,
    });
    setLoading(false);
    if (res.ok) {
      showToast(res.needsConfirm ? 'Akun dibuat! Cek email untuk konfirmasi.' : 'Akun berhasil dibuat! 🎉', '🎉');
      navigate(res.needsConfirm ? '/login' : '/');
    } else {
      showToast(res.reason || 'Pendaftaran gagal', '❌');
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: 100, paddingBottom: 60 }}>
      <div className={styles.card} style={{ maxWidth: 480 }}>
        <div className={styles.logo}><img src="/logo.png" alt="Rentix" /></div>
        <h2 className={styles.title}>Buat Akun Rentix</h2>
        <p className={styles.sub}>Sudah punya akun? <Link to="/login" className={styles.link}>Masuk di sini</Link></p>
        <div className={styles.kycBanner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: '#40A8C4' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <p><strong>Verifikasi E-KYC diperlukan.</strong> Setelah daftar, upload KTP/KTM dari Dashboard untuk verifikasi identitas. Proses aman & hanya 5 menit.</p>
        </div>
        {!isSupabaseConfigured && (
          <div className={styles.kycBanner} style={{ background: 'rgba(247,170,0,.1)', borderColor: 'rgba(247,170,0,.3)' }}>
            <p style={{ fontSize: '.82rem' }}>⚠️ Backend belum dikonfigurasi. Jalankan SQL & isi <code>.env</code> untuk pendaftaran nyata.</p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-field"><label className="form-label">Nama Depan</label><input className="form-input" placeholder="Budi" value={f.first} onChange={set('first')} /></div>
          <div className="form-field"><label className="form-label">Nama Belakang</label><input className="form-input" placeholder="Santoso" value={f.last} onChange={set('last')} /></div>
        </div>
        <div className="form-field"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="email@contoh.com" value={f.email} onChange={set('email')} /></div>
        <div className="form-field"><label className="form-label">Nomor HP</label><input type="tel" className="form-input" placeholder="08xxxxxxxxxx" value={f.phone} onChange={set('phone')} /></div>
        <div className="form-field"><label className="form-label">Password</label><input type="password" className="form-input" placeholder="Min. 6 karakter" value={f.pw} onChange={set('pw')} /></div>
        <div className="form-field"><label className="form-label">Konfirmasi Password</label><input type="password" className="form-input" placeholder="Ulangi password" value={f.pw2} onChange={set('pw2')} /></div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, margin: '6px 0 16px', cursor: 'pointer' }}>
          <input type="checkbox" style={{ marginTop: 3, accentColor: '#40A8C4' }} checked={agree} onChange={e => setAgree(e.target.checked)} />
          <span style={{ fontSize: '.82rem', color: '#475569', lineHeight: 1.5 }}>Saya menyetujui <a className={styles.link}>Syarat & Ketentuan</a> dan <a className={styles.link}>Kebijakan Privasi</a> Rentix.</span>
        </label>
        <button className={styles.authBtn} onClick={handleRegister} disabled={loading}>{loading ? 'Memproses…' : 'Buat Akun'}</button>
      </div>
    </div>
  );
}
