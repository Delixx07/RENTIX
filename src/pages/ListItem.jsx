import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import useStore from '../store/useStore';
import Footer from '../components/Footer';
import styles from './ListItem.module.css';

export default function ListItem() {
  const { showToast } = useStore();

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
                <Field label="Nama Produk"><input className="form-input" placeholder="Contoh: Sony A7 III + Kit Lens" /></Field>
                <Field label="Kategori">
                  <select className="form-select">
                    <option>Pilih kategori...</option>
                    {CATEGORIES.filter(c=>c.id!=='all').map(c=><option key={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </Field>
              </div>
              <div className={styles.row}>
                <Field label="Merek / Brand"><input className="form-input" placeholder="Contoh: Sony, Canon, DJI..." /></Field>
                <Field label="Kondisi Barang">
                  <select className="form-select">
                    {['Pilih kondisi...','Baru (Segel)','Seperti Baru (95%+)','Sangat Baik (85-95%)','Baik (70-85%)'].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Deskripsi Produk"><textarea className="form-textarea" placeholder="Jelaskan spesifikasi, kelengkapan, dan kondisi barang secara detail..." /></Field>
            </Section>

            <Section label="Harga & Ketersediaan">
              <div className={styles.row3}>
                <Field label="Harga per Hari (Rp)"><input className="form-input" type="number" placeholder="350000" /></Field>
                <Field label="Harga per Minggu (Rp)"><input className="form-input" type="number" placeholder="2000000" /></Field>
                <Field label="Harga per Bulan (Rp)"><input className="form-input" type="number" placeholder="7000000" /></Field>
              </div>
              <div className={styles.row}>
                <Field label="Jumlah Unit"><input className="form-input" type="number" min={1} defaultValue={1} /></Field>
                <Field label="Minimum Durasi Sewa">
                  <select className="form-select">{['1 hari','2 hari','3 hari','1 minggu'].map(v=><option key={v}>{v}</option>)}</select>
                </Field>
              </div>
            </Section>

            <Section label="Foto Produk">
              <div className="upload-zone"><div style={{ fontSize:'2rem', marginBottom:10 }}>📸</div><p><strong>Klik atau drag foto di sini</strong><br />JPG, PNG, WebP · Maks. 5 foto · Maks. 5MB/foto</p></div>
            </Section>

            <Section label="Lokasi & Pengiriman">
              <div className={styles.row}>
                <Field label="Kota / Kabupaten"><input className="form-input" placeholder="Contoh: Surabaya" /></Field>
                <Field label="Metode Serah Terima">
                  <select className="form-select">{['Ambil Sendiri (COD)','Pengiriman (Ongkir Penyewa)','Keduanya'].map(v=><option key={v}>{v}</option>)}</select>
                </Field>
              </div>
            </Section>

            <div className={styles.notice}>
              <div style={{ fontWeight:700, color:'var(--navy)', marginBottom:8 }}>🛡️ Barangmu dilindungi Rentix Protection</div>
              <p>Setiap produk terdaftar di Rentix otomatis terlindungi dari kerusakan dan kehilangan. Kamu hanya menerima penyewa yang sudah terverifikasi E-KYC.</p>
            </div>

            <button className={styles.submitBtn} onClick={() => showToast('Produkmu berhasil didaftarkan! Review dalam 1×24 jam.', '🎉')}>
              🚀 Daftarkan Produk
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
      <div style={{ fontSize:'.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--sky)', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
        {label}<span style={{ flex:1, height:1, background:'var(--gray-100)' }}/>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return <div className="form-field"><label className="form-label">{label}</label>{children}</div>;
}
