import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import TransactionPage from './pages/TransactionPage';
import ReportPage from './pages/ReportPage';

const AppLayout = () => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <main style={{ flexGrow: 1, padding: '20px', height: '100vh', overflowY: 'auto' }}>
      <Outlet />
    </main>
  </div>
);

function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />

      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['admin', 'kasir']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin', 'kasir']} />}>
          <Route path="/transaction" element={<TransactionPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}
export default App;