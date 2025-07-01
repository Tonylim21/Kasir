import React, { useState, useEffect } from 'react';
import { getTransactionHistory } from '../services/transactionService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from '../css/ReportPage.module.css';

const ReportPage = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const responseData = await getTransactionHistory();

        const transactionsArray = Array.isArray(responseData.data) ? responseData.data : (responseData || []);

        setAllTransactions(transactionsArray);
        setFilteredTransactions(transactionsArray);
        setError(null);
      } catch (err) {
        setError("Gagal mengambil riwayat laporan.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = allTransactions;
    if (startDate) {
      filtered = filtered.filter(trx => new Date(trx.sale_date) >= new Date(startDate));
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      filtered = filtered.filter(trx => new Date(trx.sale_date) < endOfDay);
    }
    setFilteredTransactions(filtered);
  }, [startDate, endDate, allTransactions]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Penjualan", 14, 15);
    doc.text(`Periode: ${startDate || 'Awal'} - ${endDate || 'Akhir'}`, 14, 22);

    const tableColumn = ["ID Transaksi", "Tanggal", "Kasir", "Total Transaksi"];
    const tableRows = [];

    filteredTransactions.forEach(trx => {
      const trxData = [
        trx.sale_id,
        formatDate(trx.sale_date),
        trx.user.username,
        formatRupiah(trx.sale_total_amount),
      ];
      tableRows.push(trxData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save(`laporan-penjualan.pdf`);
  };

  const toggleDetails = (id) => setExpandedId(expandedId === id ? null : id);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const formatDate = (iso) => new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  if (loading) return <div className={styles.pageContainer}><h2>Memuat laporan...</h2></div>;
  if (error) return <div className={styles.pageContainer}><h2>{error}</h2></div>;

  return (
    <div className={styles.pageContainer}>
      <h1>Riwayat & Laporan Penjualan</h1>
      <div className={styles.filterSection}>
        <div className={styles.datePicker}>
          <label htmlFor="start-date">Dari Tanggal</label>
          <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className={styles.datePicker}>
          <label htmlFor="end-date">Sampai Tanggal</label>
          <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button onClick={handleExportPDF} className={styles.exportButton} disabled={filteredTransactions.length === 0}>
          Export Laporan (PDF)
        </button>
      </div>
      <div className={styles.historyList}>
        {filteredTransactions.length === 0 ? (
          <p>Tidak ada riwayat transaksi pada rentang tanggal ini.</p>
        ) : (
          filteredTransactions.map(trx => (
            <div key={trx.sale_id} className={styles.transactionCard}>
              <div className={styles.cardHeader} onClick={() => toggleDetails(trx.sale_id)}>
                <div className={styles.headerInfo}>
                  <span className={styles.trxId}>ID: {trx.sale_id}</span>
                  <span className={styles.trxDate}>{formatDate(trx.sale_date)}</span>
                  <span className={styles.trxUser}>Kasir: {trx.user.username}</span>
                </div>
                <div className={styles.headerSummary}>
                  <span className={styles.trxTotal}>{formatRupiah(trx.sale_total_amount)}</span>
                  <span className={`${styles.arrow} ${expandedId === trx.sale_id ? styles.expanded : ''}`}>▼</span>
                </div>
              </div>
              {expandedId === trx.sale_id && (
                <div className={styles.cardDetails}>
                  <h4>Detail Item:</h4>
                  <table className={styles.detailsTable}>
                    <thead>
                      <tr>
                        <th>Nama Produk</th>
                        <th>Jumlah</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trx.details.map(item => (
                        <tr key={item.sale_detail_id}>
                          <td>{item.product.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatRupiah(item.sub_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportPage;