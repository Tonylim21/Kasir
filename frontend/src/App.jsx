// src/App.jsx - VERSI FINAL YANG BENAR

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Impor Komponen dan Halaman
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import TransactionPage from './pages/TransactionPage';
import HistoryPage from './pages/HistoryPage';
import ReportPage from './pages/ReportPage';

// Komponen Layout Utama (HANYA UNTUK HALAMAN SETELAH LOGIN)
const AppLayout = () => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <main style={{ flexGrow: 0, padding: '20px', height: '100vh', overflowY: 'auto' }}>
      <Outlet />
    </main>
  </div>
);

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* RUTE PUBLIK - TIDAK MENGGUNAKAN AppLayout */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />

      {/* GRUP RUTE DILINDUNGI - MENGGUNAKAN AppLayout */}
      <Route element={<AppLayout />}>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'kasir']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['kasir']} />}>
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

      </Route>

      {/* RUTE FALLBACK */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;