import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('swapskill_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('swapskill_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((message, type = 'info') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type, // 'success' | 'info' | 'error'
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      clearAll,
      unreadCount 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
