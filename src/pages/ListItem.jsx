import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import { createProduct } from '../lib/api';
import useStore from '../store/useStore';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import styles from './ListItem.module.css';

const PICKABLE_CATS = CATEGORIES.filter((c) => c.id !== 'all');
const CAT_BY_NAME = Object.fromEntries(PICKABLE_CATS.map((c) => [c.name, c.id]));

export default function ListItem() {
  const { showToast, user, profile } = useStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [f, setF] = useState({
    name: '', catLabel: '', brand: '', condition: '', desc: '',
    price: '', priceWeek: '', priceMonth: '', stock: 1, city: 'Surabaya',
  });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!user) { showToast('Masuk dulu untuk mendaftarkan produk', '🔒'); navigate('/login'); return; }
    if (!f.name || !f.catLabel || !f.price) { showToast('Lengkapi nama, kategori, dan harga harian', '⚠️'); return; }
    setSubmitting(true);
    const res = await createProduct(
      {
        name: f.name,
        cat: CAT_BY_NAME[f.catLabel] || 'camera',
        price: +f.price,
        priceWeek: f.priceWeek ? +f.priceWeek : Math.round(+f.price * 6),
        priceMonth: f.priceMonth ? +f.priceMonth : Math.round(+f.price * 22),
        desc: f.desc || `${f.brand} — ${f.condition}`,
        specs: { Merek: f.brand || '-', Kondisi: f.condition || '-' },
        stock: +f.stock || 1,
        city: f.city || 'Surabaya',
      },
      user.id,
      profile?.full_name || user.email,
    );
    setSubmitting(false);
    if (res.ok) {
      showToast('Produkmu berhasil didaftarkan! 🎉', '🎉');
      navigate('/browse');
    } else if (res.reason === 'db-offline') {
      showToast('Backend belum aktif — jalankan SQL & isi .env dulu', '⚠️');
    } else {
      showToast(res.reason || 'Gagal mendaftarkan produk', '❌');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className={styles.wrap}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="section-tag">Sewakan Barangmu</span>
            <h1 className={styles.title}>Mulai Hasilkan Passive Income</h1>
            <p className={styles.sub}>Daftarkan gadgetmu dan mulai terima penyewa. Barang terlindungi 100% oleh Rentix Protection.</p>
          </div>

          <div className={styles.card}>
            <Section label="Informasi Produk">
              <div className={styles.row}>
                <Field label="Nama Produk"><input className="form-input" placeholder="Contoh: Sony A7 III + Kit Lens" value={f.name} onChange={set('name')} /></Field>
                <Field label="Kategori">
                  <select className="form-select" value={f.catLabel} onChange={set('catLabel')}>
                    <option value="">Pilih kategori...</option>
                    {PICKABLE_CATS.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              </div>
              <div className={styles.row}>
                <Field label="Merek / Brand"><input className="form-input" placeholder="Contoh: Sony, Canon, DJI..." value={f.brand} onChange={set('brand')} /></Field>
                <Field label="Kondisi Barang">
                  <select className="form-select" value={f.condition} onChange={set('condition')}>
                    {['Pilih kondisi...', 'Baru (Segel)', 'Seperti Baru (95%+)', 'Sangat Baik (85-95%)', 'Baik (70-85%)'].map(v => <option key={v} value={v === 'Pilih kondisi...' ? '' : v}>{v}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Deskripsi Produk"><textarea className="form-textarea" placeholder="Jelaskan spesifikasi, kelengkapan, dan kondisi barang secara detail..." value={f.desc} onChange={set('desc')} /></Field>
            </Section>

            <Section label="Harga & Ketersediaan">
              <div className={styles.row3}>
                <Field label="Harga per Hari (Rp)"><input className="form-input" type="number" placeholder="350000" value={f.price} onChange={set('price')} /></Field>
                <Field label="Harga per Minggu (Rp)"><input className="form-input" type="number" placeholder="2000000" value={f.priceWeek} onChange={set('priceWeek')} /></Field>
                <Field label="Harga per Bulan (Rp)"><input className="form-input" type="number" placeholder="7000000" value={f.priceMonth} onChange={set('priceMonth')} /></Field>
              </div>
              <div className={styles.row}>
                <Field label="Jumlah Unit"><input className="form-input" type="number" min={1} value={f.stock} onChange={set('stock')} /></Field>
                <Field label="Minimum Durasi Sewa">
                  <select className="form-select">{['1 hari', '2 hari', '3 hari', '1 minggu'].map(v => <option key={v}>{v}</option>)}</select>
                </Field>
              </div>
            </Section>

            <Section label="Foto Produk">
              <div className="upload-zone">
                <Icon name="camera" size={28} />
                <p><strong>Klik atau drag foto di sini</strong><br />JPG, PNG, WebP · Maks. 5 foto · Maks. 5MB/foto</p>
              </div>
            </Section>

            <Section label="Lokasi & Pengiriman">
              <div className={styles.row}>
                <Field label="Kota / Kabupaten"><input className="form-input" placeholder="Contoh: Surabaya" value={f.city} onChange={set('city')} /></Field>
                <Field label="Metode Serah Terima">
                  <select className="form-select">{['Ambil Sendiri (COD)', 'Pengiriman (Ongkir Penyewa)', 'Keduanya'].map(v => <option key={v}>{v}</option>)}</select>
                </Field>
              </div>
            </Section>

            <div className={styles.notice}>
              <div className={styles.noticeTitle}><Icon name="shield" size={16} /> Barangmu dilindungi Rentix Protection</div>
              <p>Setiap produk terdaftar di Rentix otomatis terlindungi dari kerusakan dan kehilangan. Kamu hanya menerima penyewa yang sudah terverifikasi E-KYC.</p>
            </div>

            <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Mendaftarkan…' : 'Daftarkan Produk'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--sky)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        {label}<span style={{ flex: 1, height: 1, background: 'var(--gray-100)' }} />
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return <div className="form-field"><label className="form-label">{label}</label>{children}</div>;
}
