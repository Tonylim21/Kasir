import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService'; 
import Modal from '../components/Modal';
import styles from '../css/ProductPage.module.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ product_name: '', product_price: '', product_stock: '', product_image: null });
  const [editingProductId, setEditingProductId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response); 
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data produk.");
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormData({ product_name: '', product_price: '', product_stock: '', product_image: null });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product.product_id);
    setFormData({
      product_name: product.product_name,
      product_price: product.product_price,
      product_stock: product.product_stock,
      product_image: null,
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setFormData({ product_name: '', product_price: '', product_stock: '', product_image: null });
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, product_image: e.target.files[0] }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    const formDataObject = new FormData();
    formDataObject.append('product_name', formData.product_name);
    formDataObject.append('product_price', formData.product_price);
    formDataObject.append('product_stock', formData.product_stock);

    if (formData.product_image) {
      formDataObject.append('product_image', formData.product_image);
    }

    try {
      if (editingProductId) {
        formDataObject.append('_method', 'PUT');
        await updateProduct(editingProductId, formDataObject);
      } else {
        await addProduct(formDataObject);
      }
      handleCloseModal();
      await fetchProducts();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setValidationErrors(err.response.data);
      } else {
        console.error("Gagal menyimpan produk:", err);
      }
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteProduct(productId);
        await fetchProducts();
      } catch (err) {
        console.error("Gagal menghapus produk:", err);
      }
    }
  };

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);
  
  if (loading) return <div className={styles.container}><h2>Memuat data produk...</h2></div>;
  if (error) return <div className={styles.container}><h2>{error}</h2></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manajemen Produk</h1>
        <button className={styles.addButton} onClick={handleOpenCreateModal}>+ Tambah Produk Baru</button>
      </div>

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama Produk</th>
            <th>Harga Satuan</th>
            <th>Stok</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>
                <img src={product.product_image_url} alt={product.product_name} className={styles.productImage} />
              </td>
              <td>{product.product_name}</td>
              <td>{formatRupiah(product.product_price)}</td>
              <td>{product.product_stock}</td>
              <td>
                <button className={styles.editButton} onClick={() => handleOpenEditModal(product)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => handleDelete(product.product_id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label htmlFor="product_name">Nama Produk</label>
            <input type="text" id="product_name" name="product_name" value={formData.product_name} onChange={handleInputChange} />
            {validationErrors.product_name && <span className={styles.validationError}>{validationErrors.product_name[0]}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="product_price">Harga Satuan</label>
            <input type="number" id="product_price" name="product_price" value={formData.product_price} onChange={handleInputChange} />
            {validationErrors.product_price && <span className={styles.validationError}>{validationErrors.product_price[0]}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="product_stock">Stok Awal</label>
            <input type="number" id="product_stock" name="product_stock" value={formData.product_stock} onChange={handleInputChange} />
            {validationErrors.product_stock && <span className={styles.validationError}>{validationErrors.product_stock[0]}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="product_image">Gambar Produk (Opsional)</label>
            <input type="file" id="product_image" name="product_image" onChange={handleFileChange} />
            {validationErrors.product_image && <span className={styles.validationError}>{validationErrors.product_image[0]}</span>}
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