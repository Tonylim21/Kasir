import React, { useState, useEffect } from 'react';
import { getTransactionHistory } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import styles from '../css/DashboardPage.module.css';

const DashboardPage = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    transactionsToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      const calculateDashboardData = async () => {
        try {
          setLoading(true);
          const responseData = await getTransactionHistory();
          
          const history = Array.isArray(responseData.data) ? responseData.data : (responseData || []);

          const totalRevenue = history.reduce((sum, trx) => sum + trx.sale_total_amount, 0);

          const today = new Date().toISOString().slice(0, 10);
          const transactionsToday = history.filter(trx => trx.sale_date.slice(0, 10) === today).length;
          
          setDashboardData({ totalRevenue, transactionsToday });
          setError(null);
        } catch (err) {
          setError("Gagal memuat data dashboard.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      calculateDashboardData();
    } else {
      setLoading(false);
    }
  }, [user?.role]);

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

  if (loading) return <div className={styles.pageContainer}><h2>Memuat data dashboard...</h2></div>;
  
  return (
    <div className={styles.pageContainer}>
      <h1>Dashboard</h1>
      <p className={styles.welcomeMessage}>Selamat datang kembali, {user?.username}!</p>

      {user?.role === 'admin' ? (
        error ? (
          <h2 className={styles.error}>{error}</h2>
        ) : (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Pendapatan</h3>
              <p className={styles.statValue}>{formatRupiah(dashboardData.totalRevenue)}</p>
              <p className={styles.statDescription}>Dari semua transaksi yang tercatat.</p>
            </div>
            <div className={styles.statCard}>
              <h3>Transaksi Hari Ini</h3>
              <p className={styles.statValue}>{dashboardData.transactionsToday}</p>
              <p className={styles.statDescription}>Jumlah transaksi yang terjadi hari ini.</p>
            </div>
          </div>
        )
      ) : (
        <p className={styles.info}>Gunakan menu di samping untuk memulai transaksi baru.</p>
      )}
    </div>
  );
};

export default DashboardPage;