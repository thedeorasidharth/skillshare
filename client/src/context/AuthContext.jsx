import { createContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (localStorage.getItem('token')) {
      inactivityTimer.current = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    }
  };

  useEffect(() => {
    const checkLoggedin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        // Expiry check
        if (decoded && decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          try {
            const res = await api.get('/api/profile');
            setUser(res.data.data);
            resetInactivityTimer();
          } catch (error) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    checkLoggedin();

    // Global activity listeners
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);

    // Tab close beacon
    const handleUnload = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5001/api/users/ping', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          keepalive: true
        });
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
      window.removeEventListener('beforeunload', handleUnload);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  // Heartbeat ping every 30 seconds
  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(() => {
        api.post('/api/users/ping').catch(() => {});
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    resetInactivityTimer();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
