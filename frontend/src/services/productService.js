// src/services/productService.js

// --- DATABASE DUMMY ---
// Kita mulai dengan beberapa data produk awal.
let products = [
  { id: 1, name: 'Kopi Susu Gula Aren', price: 18000, stock: 50 },
  { id: 2, name: 'Americano', price: 15000, stock: 30 },
  { id: 3, name: 'Croissant Coklat', price: 22000, stock: 25 },
  { id: 4, name: 'Teh Melati', price: 12000, stock: 40 },
];

// Gunakan ini untuk membuat ID unik untuk produk baru
let nextId = 5;

// --- FUNGSI-FUNGSI DUMMY API ---

// Menyimulasikan penundaan jaringan (network delay)
const simulateNetworkDelay = (ms) => new Promise(res => setTimeout(res, ms));

// READ: Mengambil semua produk
export const getProducts = async () => {
  await simulateNetworkDelay(500); // Delay 0.5 detik
  console.log("Mengambil semua produk:", products);
  return [...products]; // Kembalikan salinan array agar data asli tidak termutasi
};

// CREATE: Menambah produk baru
export const addProduct = async (productData) => {
  await simulateNetworkDelay(500);
  const newProduct = { id: nextId++, ...productData };
  products.push(newProduct);
  console.log("Menambah produk baru:", newProduct);
  return newProduct;
};

// UPDATE: Mengedit produk berdasarkan ID
export const updateProduct = async (id, updatedData) => {
  await simulateNetworkDelay(500);
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedData };
    console.log("Mengupdate produk:", products[productIndex]);
    return products[productIndex];
  }
  throw new Error("Produk tidak ditemukan");
};

// DELETE: Menghapus produk berdasarkan ID
export const deleteProduct = async (id) => {
  await simulateNetworkDelay(500);
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex !== -1) {
    const deletedProduct = products[productIndex];
    products = products.filter(p => p.id !== id);
    console.log("Menghapus produk:", deletedProduct);
    return { message: "Produk berhasil dihapus" };
  }
  throw new Error("Produk tidak ditemukan");
};