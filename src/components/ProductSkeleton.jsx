import styles from './ProductSkeleton.module.css';

// Placeholder kartu produk saat data sedang dimuat.
export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.img} />
          <div className={styles.body}>
            <div className={styles.line} style={{ width: '90%' }} />
            <div className={styles.line} style={{ width: '55%' }} />
            <div className={styles.line} style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
