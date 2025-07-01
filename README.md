# Fullstack Sistem Kasir (Point of Sale)

> Backend API untuk aplikasi kasir sederhana yang dibangun menggunakan Laravel 10. Proyek ini dibuat sebagai Ujian Akhir Semester dan mencakup fungsionalitas dasar sistem kasir, termasuk manajemen produk, transaksi penjualan, serta sistem otentikasi dengan peran (role-based).

![Contoh Penggunaan API di Postman](https://i.imgur.com/c9ec67.png)

---
## Arsitektur Proyek 🏗️

Proyek ini menggunakan arsitektur terpisah (*decoupled*):

* **Backend (Folder `/`)**: Sebuah REST API yang dibuat dengan Laravel 10. Bertugas untuk mengelola semua logika bisnis, interaksi database, otentikasi, dan otorisasi.
* **Frontend (Folder `/frontend`)**: Sebuah *Single Page Application* (SPA) yang dibuat dengan React.js (menggunakan Vite). Bertugas untuk menampilkan antarmuka pengguna (UI) dan berinteraksi dengan Backend API.

---

---

## Fitur Utama ✨

### Peran Admin
* Manajemen Pengguna (Registrasi user baru dengan peran admin/kasir).
* Manajemen Produk (CRUD - Create, Read, Update, Delete) termasuk upload foto produk.
* Melihat seluruh riwayat transaksi penjualan.
* Melihat detail per transaksi.

### Peran Kasir
* Melakukan otentikasi (Login/Logout).
* Melihat daftar produk.
* Membuat transaksi penjualan baru.

---

## Teknologi yang Digunakan 💻

* **Backend**:
    * Framework: Laravel 10
    * PHP: Versi 8.1+
    * Database: MySQL / MariaDB
    * Otentikasi API: Laravel Sanctum
* **Frontend**:
    * Library: React.js
    * Build Tool: Vite
    * HTTP Client: Axios
    * Styling: (Contoh: Tailwind CSS, Material-UI, dll.)

---

## Langkah-langkah Instalasi 🚀

Pastikan Anda sudah memiliki prasyarat berikut terinstal di komputer Anda:
* PHP (versi 8.1 atau lebih baru)
* Composer
* Node.js (versi 18+) & NPM
* Database Server (cth: MySQL, MariaDB)

### 1. Instalasi Backend (Laravel API)

Langkah-langkah ini dilakukan di direktori utama proyek.

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/Tonylim21/Kasir.git](https://github.com/Tonylim21/Kasir.git)
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd Kasir
    ```

3.  **Install dependensi PHP via Composer:**
    ```bash
    composer install
    ```

4.  **Salin file `.env.example` menjadi `.env`:**
    ```bash
    cp .env.example .env
    ```

5.  **Generate application key baru:**
    ```bash
    php artisan key:generate
    ```

6.  **Konfigurasi Database:**
    Buka file `.env` dan sesuaikan pengaturan database Anda (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

7.  **Jalankan Migrasi Database:**
    ```bash
    php artisan migrate
    ```

8.  **Buat Symbolic Link untuk Storage:**
    ```bash
    php artisan storage:link
    ```

### 2. Instalasi Frontend (React App)

Langkah-langkah ini juga dilakukan dari direktori utama proyek (`/Kasir`).

1.  **Buat proyek React baru di dalam folder `frontend` menggunakan Vite:**
    ```bash
    npm create vite@latest frontend -- --template react
    ```

2.  **Masuk ke direktori frontend:**
    ```bash
    cd frontend
    ```

3.  **Install dependensi Node.js:**
    ```bash
    npm install
    ```

4.  **Install Axios** untuk melakukan panggilan API:
    ```bash
    npm install axios
    ```

5.  **Konfigurasi Environment Frontend:**
    Buat file baru bernama `.env.local` di dalam folder `/frontend`. File ini akan berisi alamat URL dari backend API Anda.
    ```
    VITE_API_BASE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
    ```
    Dengan ini, Anda bisa memanggil API di dalam kode React Anda tanpa menulis URL lengkap berulang kali.

---

## Menjalankan Proyek Secara Penuh 🏃‍♂️

Untuk menjalankan proyek ini, Anda perlu membuka **dua terminal terpisah** di dalam direktori utama proyek (`/Kasir`).

* **Terminal 1 (Untuk Backend Laravel):**
    ```bash
    php artisan serve
    ```
    Backend akan berjalan di `http://127.0.0.1:8000`.

* **Terminal 2 (Untuk Frontend React):**
    ```bash
    cd frontend
    npm run dev
    ```
    Frontend akan berjalan di alamat lain (biasanya `http://localhost:5173`). Buka URL ini di browser Anda untuk melihat aplikasinya.

---

## Dokumentasi API Endpoint 📖

Berikut adalah daftar endpoint API yang disediakan oleh backend. Gunakan ini sebagai panduan saat membangun frontend.

*(Bagian dokumentasi API dari README sebelumnya tetap sama dan diletakkan di sini)*

### Otentikasi
* **Register User Baru**: `POST /api/auth/register`
* **Login User**: `POST /api/auth/login`
* **Logout User**: `POST /api/auth/logout` (Butuh otentikasi)

### Manajemen Produk
* **Melihat Semua Produk**: `GET /api/products` (Butuh otentikasi)
* **Menambah Produk Baru**: `POST /api/products` (Admin, `form-data`)
* **Melihat Detail Produk**: `GET /api/products/{id}` (Butuh otentikasi)
* **Update Produk**: `POST /api/products/{id}` (Admin, `form-data` dengan `_method: PUT`)
* **Hapus Produk**: `DELETE /api/products/{id}` (Admin)

### Transaksi
* **Membuat Transaksi Baru**: `POST /api/sales` (Butuh otentikasi)
* **Melihat Semua Riwayat Transaksi**: `GET /api/transactions` (Admin)
* **Melihat Detail Satu Transaksi**: `GET /api/transactions/{id}` (Admin)

---

### Otentikasi

* **Register User Baru**
    * `Method`: `POST`
    * `URL`: `/api/auth/register`
    * `Body` (raw/json):
        ```json
        {
            "name": "Nama User",
            "username": "usernameunik",
            "password": "passwordrahasia",
            "password_confirmation": "passwordrahasia",
            "role": "admin" // atau "kasir"
        }
        ```

* **Login User**
    * `Method`: `POST`
    * `URL`: `/api/auth/login`
    * `Body` (raw/json):
        ```json
        {
            "username": "usernameunik",
            "password": "passwordrahasia"
        }
        ```

* **Logout User**
    * `Method`: `POST`
    * `URL`: `/api/auth/logout`
    * `Authorization`: **Wajib**

### Manajemen Produk

* **Melihat Semua Produk**
    * `Method`: `GET`
    * `URL`: `/api/products`
    * `Authorization`: **Wajib** (Admin/Kasir)

* **Menambah Produk Baru**
    * `Method`: `POST`
    * `URL`: `/api/products`
    * `Authorization`: **Wajib** (Admin)
    * `Body` (**form-data**):
        * `product_name` (text)
        * `product_price` (text)
        * `stock` (text)
        * `product_image` (**file**)

* **Melihat Detail Produk**
    * `Method`: `GET`
    * `URL`: `/api/products/{id}`
    * `Authorization`: **Wajib** (Admin/Kasir)

* **Update Produk**
    * `Method`: `POST` (dengan `_method` spoofing)
    * `URL`: `/api/products/{id}`
    * `Authorization`: **Wajib** (Admin)
    * `Body` (**form-data**):
        * `_method` (text) -> `PUT`
        * `product_name` (text) -> (opsional)
        * `product_image` (**file**) -> (opsional)

* **Hapus Produk**
    * `Method`: `DELETE`
    * `URL`: `/api/products/{id}`
    * `Authorization`: **Wajib** (Admin)

### Transaksi

* **Membuat Transaksi Baru**
    * `Method`: `POST`
    * `URL`: `/api/sales`
    * `Authorization`: **Wajib** (Admin/Kasir)
    * `Body` (raw/json):
        ```json
        {
            "products": [
                { "product_id": 1, "quantity": 2 },
                { "product_id": 3, "quantity": 1 }
            ]
        }
        ```

* **Melihat Semua Riwayat Transaksi**
    * `Method`: `GET`
    * `URL`: `/api/transactions`
    * `Authorization`: **Wajib** (Admin)

* **Melihat Detail Satu Transaksi**
    * `Method`: `GET`
    * `URL`: `/api/transactions/{id}`
    * `Authorization`: **Wajib** (Admin)

---
## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).