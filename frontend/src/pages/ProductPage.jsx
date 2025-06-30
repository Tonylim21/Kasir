import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct } from '../services/productService'; 
import Modal from '../components/Modal';
import styles from '../css/ProductPage.module.css';

const ProductPage = () => {
  // State untuk menyimpan daftar produk, status loading, dan error
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk menampung data dari form (bisa untuk produk baru atau yang diedit)
  const [formData, setFormData] = useState({ id: null, name: '', price: '', stock: '' });

  // State untuk menentukan mode: null untuk 'Create', id produk untuk 'Edit'
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Fungsi untuk mengambil data produk dari service
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data produk.");
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  // Jalankan fetchProducts saat komponen pertama kali dirender
  useEffect(() => {
    fetchProducts();
  }, []);


  // --- Fungsi-fungsi Handler untuk Modal dan Form ---

  // Membuka modal dalam mode 'Create' (form kosong)
  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormData({ id: null, name: '', price: '', stock: '' });
    setIsModalOpen(true);
  };

  // Membuka modal dalam mode 'Edit' (form terisi data produk)
  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    setFormData(product);
    setIsModalOpen(true);
  };
  
  // Menutup modal dan mereset semua state terkait
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setFormData({ id: null, name: '', price: '', stock: '' });
  };

  // Meng-handle perubahan pada setiap input di form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  // Meng-handle submit form (bisa untuk Create atau Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        price: parseInt(formData.price, 10),
        stock: parseInt(formData.stock, 10),
      };

      if (editingProductId) {
        // Jika sedang mode 'Edit', panggil fungsi update
        await updateProduct(editingProductId, productData);
      } else {
        // Jika mode 'Create', panggil fungsi tambah
        await addProduct(productData);
      }
      
      handleCloseModal();
      await fetchProducts(); // Ambil ulang data untuk memperbarui tabel
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
    }
  };

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
    const handleDelete = async (productId) => {
    // 2. Tampilkan dialog konfirmasi bawaan browser
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak bisa dibatalkan.')) {
      try {
        // 3. Panggil fungsi delete dari service
        await deleteProduct(productId);
        // 4. Ambil ulang data untuk memperbarui tabel
        await fetchProducts();
      } catch (err) {
        console.error("Gagal menghapus produk:", err);
        // Anda bisa menambahkan notifikasi error di sini
      }
    }
  };

  // Tampilan kondisional saat loading atau error
  if (loading) return <div className={styles.container}><h2>Memuat data produk...</h2></div>;
  if (error) return <div className={styles.container}><h2>{error}</h2></div>;

  // Tampilan utama halaman
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manajemen Produk</h1>
        <button className={styles.addButton} onClick={handleOpenCreateModal}>
          + Tambah Produk Baru
        </button>
      </div>

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Harga Satuan</th>
            <th>Stok</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{formatRupiah(product.price)}</td>
              <td>{product.stock}</td>
              <td>
                <button className={styles.editButton}onClick={() => handleOpenEditModal(product)}>Edit</button>
                <button className={styles.deleteButton}onClick={() => handleDelete(product.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Komponen Modal yang isinya dinamis */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nama Produk</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Harga Satuan</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stock">Stok Awal</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>Simpan</button>
            <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductPage;