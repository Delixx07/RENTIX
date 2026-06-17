import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { fmt, BADGE_MAP } from '../data/products';
import { fallbackImage } from '../lib/api';
import Icon from './Icon';
import Stars from './Stars';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const liked = wishlist.includes(product.id);

  const openDetail = () => navigate(`/product/${product.id}`);
  const handleWishlist = (e) => { e.stopPropagation(); toggleWishlist(product.id); };
  const handleAdd = (e) => { e.stopPropagation(); addToCart(product); };

  // Bila gambar (mis. dari URL online) gagal dimuat, ganti ke gambar kategori lokal.
  const handleImgError = (e) => {
    const fb = fallbackImage(product.cat);
    if (e.currentTarget.src.indexOf(fb) === -1) e.currentTarget.src = fb;
  };

  return (
    <div className={styles.card} onClick={openDetail}>
      <div className={styles.imgWrap}>
        <img src={product.img} alt={product.name} className={styles.img} loading="lazy" onError={handleImgError} />

        <div className={styles.badges}>
          {product.isPremium && (
            <span className="badge badge-premium"><Icon name="star" size={11} /> Premium</span>
          )}
          {product.badges.map((key) => {
            const badge = BADGE_MAP[key];
            if (!badge) return null;
            return (
              <span key={key} className={`badge ${badge.cls}`}>
                <Icon name={badge.icon} size={11} /> {badge.label}
              </span>
            );
          })}
        </div>

        <button
          className={`${styles.wishlistBtn} ${liked ? styles.liked : ''}`}
          onClick={handleWishlist}
          aria-label="Tambah ke wishlist"
        >
          <Icon name="heart" size={16} style={{ fill: liked ? 'currentColor' : 'none' }} />
        </button>
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{product.name}</div>

        <div className={styles.meta}>
          <div className={styles.rating}>
            <Stars value={product.rating} size={13} />
            <span className={styles.ratingNum}>{product.rating}</span>
          </div>
          <span className={styles.reviews}>({product.reviews})</span>
          {product.ownerVerified && (
            <span className={styles.verified}><Icon name="checkCircle" size={12} /> Terverifikasi</span>
          )}
        </div>

        <div className={styles.owner}>
          <span className={styles.ownerAvatar}>{product.owner[0]}</span>
          {product.owner}
        </div>

        <div className={styles.priceRow}>
          <div className={styles.price}>{fmt(product.price)} <span>/ hari</span></div>
          <button className={styles.addBtn} onClick={handleAdd} aria-label="Tambah ke keranjang">
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
