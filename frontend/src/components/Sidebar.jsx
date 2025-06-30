// Kode Sidebar yang sudah terintegrasi penuh

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook untuk mengambil konteks
import styles from '../css/Sidebar.module.css';

const Sidebar = () => {
  // Ambil 'user' untuk menampilkan data, dan 'logout' untuk aksi logout
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Jika tidak ada user (seharusnya tidak terjadi di layout ini, tapi untuk keamanan)
  if (!user) return null;

  // Fungsi yang akan dipanggil saat tombol logout diklik
  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari context
    navigate('/login'); // Arahkan pengguna kembali ke halaman login
  };

  const adminMenu = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Produk', path: '/products' },
    { label: 'Laporan', path: '/reports' },
  ];
  const kasirMenu = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Transaksi', path: '/transaction' },
    { label: 'Riwayat', path: '/history' },
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
      {/* Tombol Logout yang memanggil handleLogout */}
      <div>
         <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;