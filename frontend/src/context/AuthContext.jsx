// src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';
// Kita nonaktifkan sementara import api karena tidak dipakai di login dummy
// import api from '../services/api';

const AuthContext = createContext(null);

// --- DATA DUMMY KITA ---
// Kita siapkan dua user, satu untuk admin, satu untuk kasir.
const dummyUsers = {
  admin: { 
    password: 'admin123', 
    user: { id: 1, username: 'admin', role: 'admin' } 
  },
  kasir: { 
    password: 'kasir123', 
    user: { id: 2, username: 'kasir', role: 'kasir' } 
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async (username, password) => {
    console.log(`Mencoba login dengan username: ${username}`); // Log untuk debugging
    
    // --- LOGIKA LOGIN DUMMY DIMULAI DI SINI ---

    // 1. Cek apakah username ada di data dummy kita
    const dummyData = dummyUsers[username];
    if (dummyData && dummyData.password === password) {
      // 2. Jika username ada DAN password cocok
      const loggedInUser = dummyData.user;
      const fakeToken = `dummy-token-for-${loggedInUser.role}`;

      console.log('Login dummy berhasil!', loggedInUser);

      // 3. Simpan data user dan token palsu ke state dan localStorage
      setUser(loggedInUser);
      setToken(fakeToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', fakeToken);
      
      // Kita tidak melempar error karena berhasil
      return; 
    }

    // 4. Jika username tidak ditemukan atau password salah
    console.log('Login dummy gagal: username atau password salah.');
    throw new Error('Username atau password salah');

    // --- LOGIKA LOGIN DUMMY SELESAI ---


    // ===== LOGIKA API ASLI (KITA NONAKTIFKAN SEMENTARA) =====
    // const response = await api.post('/login', { username, password });
    // const { user, token } = response.data;
    // setUser(user);
    // setToken(token);
    // localStorage.setItem('user', JSON.stringify(user));
    // localStorage.setItem('token', token);
    // =======================================================
  };

  const logout = () => {
    console.log("Logout dijalankan...");
    // 1. Hapus state user dan token dari aplikasi
    setUser(null);
    setToken(null);
    // 2. Hapus data dari localStorage agar tidak otomatis login lagi
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};