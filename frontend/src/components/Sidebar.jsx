import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../css/Sidebar.module.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenu = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Produk', path: '/products' },
    { label: 'Laporan', path: '/reports' },
  ];

  const kasirMenu = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Transaksi', path: '/transaction' },
  ];

  const menuItems = user.role === 'admin' ? adminMenu : kasirMenu;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Aplikasi Kasir</h3>
        <p>Welcome, {user.username} ({user.role})</p>
      </div>
      <nav>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.logoutContainer}>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;