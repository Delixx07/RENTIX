import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Icon from './Icon';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { cart, user, profile, logout } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path;
  const initial = (profile?.full_name || user?.email || 'R')[0].toUpperCase();

  const handleLogout = () => { logout(); navigate('/'); };

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
            { to: '/promo', label: 'Promo' },
            { to: '/trust', label: 'Trust & Safety' },
            { to: '/how-it-works', label: 'Cara Kerja' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className={`${styles.link} ${isActive(to) ? styles.active : ''}`}>{label}</Link>
          ))}
          {/* Auth links inside the mobile dropdown */}
          {user ? (
            <>
              <Link to="/dashboard" className={`${styles.link} ${styles.mobileOnly} ${isActive('/dashboard') ? styles.active : ''}`}>Dashboard</Link>
              <button className={`${styles.link} ${styles.mobileOnly}`} style={{ textAlign: 'left', background: 'none', border: 'none' }} onClick={handleLogout}>Keluar</button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${styles.link} ${styles.mobileOnly}`}>Masuk</Link>
              <Link to="/register" className={`${styles.link} ${styles.mobileOnly}`}>Daftar</Link>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartBtn} aria-label="Keranjang">
            <Icon name="cart" size={21} />
            {total > 0 && <span className={styles.cartBadge}>{total}</span>}
          </Link>
          {user ? (
            <Link to="/dashboard" className={`${styles.authLinks} ${styles.profileBtn}`} title="Dashboard">
              <span className={styles.profileAvatar}>{initial}</span>
            </Link>
          ) : (
            <div className={styles.authLinks} style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn-outline" style={{ fontSize: '.88rem', fontWeight: 600, padding: '8px 18px' }}>Masuk</Link>
              <Link to="/register" className="btn-primary" style={{ fontSize: '.88rem', fontWeight: 700, padding: '8px 18px', borderRadius: 10 }}>Daftar</Link>
            </div>
          )}
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
