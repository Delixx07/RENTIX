import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { fmt, priceBreakdown, INSURANCE_RATE, VAT_RATE } from '../data/products';
import { createRentals, fallbackImage } from '../lib/api';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, showToast, user, profile } = useStore();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const lineTotal = (i) => i.price * i.qty * (i.days || 1);
  const subtotal = cart.reduce((s, i) => s + lineTotal(i), 0);
  const { insurance, vat, total } = priceBreakdown(subtotal);

  const handleCheckout = async () => {
    if (!user) { showToast('Masuk dulu untuk checkout', '🔒'); navigate('/login'); return; }
    if (profile && profile.kyc_status !== 'verified') {
      showToast('Selesaikan verifikasi E-KYC dulu sebelum menyewa', '🪪');
      navigate('/dashboard');
      return;
    }
    setProcessing(true);
    const res = await createRentals(cart, user.id);
    setProcessing(false);
    if (res.ok) {
      showToast('Checkout berhasil! Dana ditahan di escrow Rentix.', '🎉');
      clearCart();
      navigate('/dashboard');
    } else if (res.reason === 'db-offline') {
      showToast('Backend belum aktif — checkout disimulasikan', 'ℹ️');
      clearCart();
      navigate('/');
    } else {
      showToast(res.reason || 'Checkout gagal', '❌');
    }
  };

  return (
    <div className="page">
      <div className={`container ${styles.cartPage}`}>
        <h1 className={styles.title}>Keranjang Sewa</h1>
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="es-icon"><Icon name="cart" size={40} /></div>
            <h3>Keranjangmu masih kosong</h3>
            <p>Mulai tambahkan produk untuk disewa</p>
            <button className="btn-lg amber" style={{ marginTop: 20 }} onClick={() => navigate('/browse')}>Jelajahi Produk</button>
          </div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.items}>
              {cart.map(item => (
                <div key={item.id} className={styles.item}>
                  <img src={item.img} alt={item.name} className={styles.itemImg} onError={(e) => { e.currentTarget.src = fallbackImage(item.cat); }} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemMeta}>
                      <Icon name="shield" size={13} /> Rentix Protected
                      <span className={styles.metaDot}>·</span>
                      <Icon name="checkCircle" size={13} /> Pemilik Terverifikasi
                      {item.days ? <><span className={styles.metaDot}>·</span> {item.days} hari</> : null}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className={styles.itemPrice}>{fmt(item.price)} / hari</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button className={styles.qBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                        <span style={{ fontWeight: 700, color: 'var(--navy)', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                        <button className={styles.qBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Hapus</button>
                </div>
              ))}
            </div>
            <div className={styles.orderCard}>
              <div className={styles.orderTitle}>Ringkasan Pesanan</div>
              {cart.map(item => (
                <div key={item.id} className={styles.orderRow}>
                  <span>{item.name} ×{item.qty}{item.days ? ` ×${item.days}h` : ''}</span>
                  <span>{fmt(lineTotal(item))}</span>
                </div>
              ))}
              <div className={styles.orderRow}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className={styles.orderRow}><span className={styles.rowIcon}><Icon name="shield" size={14} /> Asuransi ({Math.round(INSURANCE_RATE * 100)}%)</span><span>{fmt(insurance)}</span></div>
              <div className={styles.orderRow}><span>PPN ({Math.round(VAT_RATE * 100)}%)</span><span>{fmt(vat)}</span></div>
              <div className={`${styles.orderRow} ${styles.orderTotal}`}><span>Total</span><span>{fmt(total)}</span></div>
              <div className={styles.notice}>
                <Icon name="shield" size={20} style={{ flexShrink: 0 }} />
                <p>Semua item terlindungi <strong>Rentix Protection</strong>. Biaya asuransi {Math.round(INSURANCE_RATE * 100)}% & PPN {Math.round(VAT_RATE * 100)}% sudah termasuk.</p>
              </div>
              {user && profile && profile.kyc_status !== 'verified' && (
                <div className={styles.kycWarn}>
                  <Icon name="alert" size={18} style={{ flexShrink: 0 }} />
                  <p>Verifikasi E-KYC diperlukan sebelum checkout. <Link to="/dashboard">Verifikasi sekarang</Link></p>
                </div>
              )}
              <button className={styles.checkoutBtn} onClick={handleCheckout} disabled={processing}>
                {processing ? 'Memproses…' : <>Lanjut ke Pembayaran <Icon name="arrowRight" size={18} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
