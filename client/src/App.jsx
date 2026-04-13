import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import SessionList from './pages/Session';
import Landing from './pages/Landing';
import Footer from './components/Footer';

import ChatbotAssistant from './components/ChatbotAssistant';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
import { NotificationProvider } from './context/NotificationContext';
import NotificationPage from './pages/NotificationPage';
import SavedUsers from './pages/SavedUsers';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-primary p-8 font-black uppercase tracking-widest text-xs animate-pulse text-center">Identifying Mastery...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col transition-all duration-500">
      <Navbar />
      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            
            <Route path="/" element={user ? <Dashboard /> : <Landing />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationPage /></PrivateRoute>} />
            <Route path="/saved" element={<PrivateRoute><SavedUsers /></PrivateRoute>} />
            <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
            <Route path="/chat/:userId" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/sessions" element={<PrivateRoute><SessionList /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ChatbotAssistant />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
          <ToastContainer />
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
