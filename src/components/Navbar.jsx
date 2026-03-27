import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { cart } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const total = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src="/logo.png" alt="Rentix" className={styles.logoImg} />
          <span className={styles.logoText}>Rentix</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {[
            { to: '/', label: 'Beranda' },
            { to: '/browse', label: 'Jelajahi' },
            { to: '/list-item', label: 'Sewakan Barangku' },
            { to: '/how-it-works', label: 'Cara Kerja' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className={`${styles.link} ${isActive(to) ? styles.active : ''}`}>{label}</Link>
          ))}
        </div>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {total > 0 && <span className={styles.cartBadge}>{total}</span>}
          </Link>
          <Link to="/login" className="btn-outline" style={{ fontSize: '.88rem', fontWeight: 600, padding: '8px 18px' }}>Masuk</Link>
          <Link to="/register" className="btn-primary" style={{ fontSize: '.88rem', fontWeight: 700, padding: '8px 18px', borderRadius: 10 }}>Daftar</Link>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? styles.hOpen : ''} />
          <span className={menuOpen ? styles.hOpen : ''} />
          <span className={menuOpen ? styles.hOpen : ''} />
        </button>
      </div>
    </nav>
  );
}
