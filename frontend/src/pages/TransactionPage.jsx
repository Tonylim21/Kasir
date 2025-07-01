import React, { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/productService';
import { createTransaction } from '../services/transactionService';
import styles from '../css/TransactionPage.module.css';

const TransactionPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response || []);
        
        if (response && response.length > 0) {
          setSelectedProductId(response[0].product_id);
        }
        setError(null);
      } catch (err) {
        setError("Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!selectedProductId || quantity <= 0) {
      alert("Pilih produk dan masukkan jumlah yang valid.");
      return;
    }
    const productToAdd = products.find(p => p.product_id === parseInt(selectedProductId, 10));
    if (!productToAdd) return;
    if (quantity > productToAdd.product_stock) {
      alert(`Stok tidak mencukupi. Sisa stok ${productToAdd.product_name}: ${productToAdd.product_stock}`);
      return;
    }
    const existingCartItem = cart.find(item => item.product_id === productToAdd.product_id);
    if (existingCartItem) {
      setCart(cart.map(item =>
        item.product_id === productToAdd.product_id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...productToAdd, quantity }]);
    }
    setQuantity(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const handleSubmitTransaction = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    try {
      const payload = {
        products: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };
      
      const response = await createTransaction(payload);
      alert(response.message || 'Transaksi Berhasil!');
      setCart([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Gagal menyelesaikan transaksi.";
      alert(errorMessage);
      console.error(err);
    }
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  }, [cart]);

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

  if (loading) return <div className={styles.pageContainer}><h2>Memuat data...</h2></div>;
  if (error) return <div className={styles.pageContainer}><h2>{error}</h2></div>;

  return (
    <div className={styles.pageContainer}>
      <h1>Halaman Transaksi</h1>
      <div className={styles.transactionLayout}>
        <div className={styles.formSection}>
          <h3>Pilih Produk</h3>
          <div className={styles.formGroup}>
            <label htmlFor="product-select">Produk</label>
            <select
              id="product-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map(p => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name} - ({formatRupiah(p.product_price)})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Jumlah</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </div>
          <button onClick={handleAddToCart} className={styles.primaryButton} disabled={!selectedProductId}>
            Tambah ke Keranjang
          </button>
        </div>
        <div className={styles.cartSection}>
          <h3>Keranjang</h3>
          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <p>Keranjang masih kosong.</p>
            ) : (
              cart.map(item => (
                <div key={item.product_id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.product_name}</span>
                    <span className={styles.itemDetails}>
                      {item.quantity} x {formatRupiah(item.product_price)}
                    </span>
                  </div>
                  <div className={styles.itemActions}>
                    <span className={styles.itemSubtotal}>
                      {formatRupiah(item.quantity * item.product_price)}
                    </span>
                    <button onClick={() => handleRemoveFromCart(item.product_id)} className={styles.removeButton}>
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.cartSummary}>
            <div className={styles.total}>
              <span>Total</span>
              <span>{formatRupiah(totalPrice)}</span>
            </div>
            <button onClick={handleSubmitTransaction} className={styles.primaryButton} disabled={cart.length === 0}>
              Selesaikan Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;