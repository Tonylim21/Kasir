import React, { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/productService';
import styles from '../css/TransactionPage.module.css';

const TransactionPage = () => {
  // State untuk daftar produk dari API/service
  const [products, setProducts] = useState([]);
  // State untuk keranjang belanja
  const [cart, setCart] = useState([]);
  
  // State untuk input form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        // Otomatis pilih produk pertama jika ada
        if (data.length > 0) {
          setSelectedProductId(data[0].id); 
        }
        setError(null);
      } catch (err) {
        setError("Gagal mengambil data produk.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  // --- Fungsi-fungsi Logika ---

  const handleAddToCart = () => {
    // Validasi dasar
    if (!selectedProductId || quantity <= 0) {
      alert("Pilih produk dan masukkan jumlah yang valid.");
      return;
    }

    const productToAdd = products.find(p => p.id === parseInt(selectedProductId, 10));
    if (!productToAdd) return;
    
    // Validasi stok
    if(quantity > productToAdd.stock) {
      alert(`Stok tidak mencukupi. Sisa stok ${productToAdd.name}: ${productToAdd.stock}`);
      return;
    }

    const existingCartItemIndex = cart.findIndex(item => item.id === productToAdd.id);

    if (existingCartItemIndex !== -1) {
      // Jika produk sudah ada di keranjang, update jumlahnya
      const updatedCart = [...cart];
      updatedCart[existingCartItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Jika produk belum ada, tambahkan ke keranjang
      setCart([...cart, { ...productToAdd, quantity }]);
    }
    // Reset input quantity
    setQuantity(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  const handleSubmitTransaction = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    // Di aplikasi nyata, data `cart` ini akan dikirim ke API
    console.log("Transaksi yang disubmit:", {
      items: cart,
      total: totalPrice
    });
    alert(`Transaksi berhasil dengan total ${formatRupiah(totalPrice)}!`);
    setCart([]); // Kosongkan keranjang setelah transaksi berhasil
  };

  // Menghitung total harga menggunakan useMemo agar lebih efisien,
  // hanya akan dihitung ulang jika `cart` berubah.
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);


  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
  
  // Tampilan kondisional
  if (loading) return <div className={styles.pageContainer}><h2>Memuat data...</h2></div>;
  if (error) return <div className={styles.pageContainer}><h2>{error}</h2></div>;

  // Tampilan utama
  return (
    <div className={styles.pageContainer}>
      <h1>Halaman Transaksi</h1>
      <div className={styles.transactionLayout}>
        
        {/* Kolom Kiri: Form untuk menambah produk */}
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
                <option key={p.id} value={p.id}>{p.name} - ({formatRupiah(p.price)})</option>
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
          <button onClick={handleAddToCart} className={styles.primaryButton}>
            Tambah ke Keranjang
          </button>
        </div>

        {/* Kolom Kanan: Keranjang Belanja */}
        <div className={styles.cartSection}>
          <h3>Keranjang</h3>
          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <p>Keranjang masih kosong.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemDetails}>
                      {item.quantity} x {formatRupiah(item.price)}
                    </span>
                  </div>
                  <div className={styles.itemActions}>
                    <span className={styles.itemSubtotal}>
                      {formatRupiah(item.quantity * item.price)}
                    </span>
                    <button onClick={() => handleRemoveFromCart(item.id)} className={styles.removeButton}>
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