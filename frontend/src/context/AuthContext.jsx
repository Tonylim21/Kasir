import React, { createContext, useState, useContext } from 'react';
import api, { csrfCookie } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async (username, password) => {
    await csrfCookie();
    const response = await api.post('/login', { username, password });
    
    const { user: loggedInUser, token: authToken } = response.data;
    setUser(loggedInUser);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', authToken);
  };


    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Gagal logout di server:", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);