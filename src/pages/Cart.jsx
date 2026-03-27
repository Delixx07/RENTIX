import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { fmt } from '../data/products';
import Footer from '../components/Footer';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, showToast } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const insurance = Math.round(subtotal * 0.05);
  const total = subtotal + insurance;

  const handleCheckout = () => {
    showToast('Checkout berhasil! Menuju pembayaran...', '🎉');
    clearCart();
    navigate('/');
  };

  return (
    <div className="page">
      <div className={`container ${styles.cartPage}`}>
        <h1 className={styles.title}>🛒 Keranjang Sewa</h1>
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="es-icon">🛒</div>
            <h3>Keranjangmu masih kosong</h3>
            <p>Mulai tambahkan produk untuk disewa</p>
            <button className="btn-lg amber" style={{ marginTop: 20 }} onClick={() => navigate('/browse')}>Jelajahi Produk</button>
          </div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.items}>
              {cart.map(item => (
                <div key={item.id} className={styles.item}>
                  <img src={item.img} alt={item.name} className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemMeta}>🛡️ Rentix Protected · ✅ Pemilik Terverifikasi</div>
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
                  <span>{item.name} ×{item.qty}</span>
                  <span>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
              <div className={styles.orderRow}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className={styles.orderRow}><span>🛡️ Rentix Protection</span><span>{fmt(insurance)}</span></div>
              <div className={`${styles.orderRow} ${styles.orderTotal}`}><span>Total</span><span>{fmt(total)}</span></div>
              <div className={styles.notice}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <p>Semua item terlindungi <strong>Rentix Protection</strong>. Biaya asuransi 5% sudah termasuk.</p>
              </div>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>Lanjut ke Pembayaran →</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
