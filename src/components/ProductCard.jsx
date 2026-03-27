import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { fmt, BADGE_MAP } from '../data/products';
import styles from './ProductCard.module.css';

export default function ProductCard({ product: p }) {
  const { cart, addToCart, toggleWishlist, wishlist } = useStore();
  const liked = wishlist.includes(p.id);
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/product/${p.id}`)}>
      <div className={styles.imgWrap}>
        <img src={p.img} alt={p.name} className={styles.img} loading="lazy" />
        <div className={styles.badges}>
          {p.badges.map(b => (
            <span key={b} className={`badge ${BADGE_MAP[b]?.cls}`}>{BADGE_MAP[b]?.label}</span>
          ))}
        </div>
        <button
          className={`${styles.wishlistBtn} ${liked ? styles.liked : ''}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }}
          aria-label="Wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'currentColor'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{p.name}</div>
        <div className={styles.meta}>
          <div className={styles.rating}>
            {'★'.repeat(Math.round(p.rating))}{'★'.repeat(5 - Math.round(p.rating)).replace(/★/g, '☆')}
            <span className={styles.ratingNum}>{p.rating}</span>
          </div>
          <span className={styles.reviews}>({p.reviews})</span>
          {p.ownerVerified && <span className={styles.verified}>✓ Terverifikasi</span>}
        </div>
        <div className={styles.owner}>
          <span className={styles.ownerAvatar}>{p.owner[0]}</span>
          {p.owner}
        </div>
        <div className={styles.priceRow}>
          <div className={styles.price}>{fmt(p.price)} <span>/ hari</span></div>
          <button
            className={styles.addBtn}
            onClick={e => { e.stopPropagation(); addToCart(p); }}
            aria-label="Tambah ke keranjang"
          >+</button>
        </div>
      </div>
    </div>
  );
}
