import { Link, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, User, Users, Video, Home, Sun, Moon, Bell, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import ConfirmModal from './ConfirmModal';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { showToast } = useToast();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    showToast('Successfully logged out. Experience excellence again soon!', 'info');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border-secondary bg-nav-bg backdrop-blur-md transition-colors duration-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-serif text-2xl font-bold text-white shadow-lg shadow-primary/20 transition-all group-hover:scale-105 group-hover:rotate-3">
                  S
                </div>
                <span className="text-2xl font-black tracking-tighter text-primary">
                  Swap<span className="text-text-dark transition-colors duration-500">Skill</span>
                </span>
              </Link>
            </div>

            <div className="hidden flex-1 justify-center space-x-1 md:flex">
              {user && (
                <>
                  <NavLink to="/" icon={<Home size={18} />} label="Dashboard" active={location.pathname === '/'} />
                  <NavLink to="/matches" icon={<Users size={18} />} label="Matches" active={location.pathname === '/matches'} />
                  <NavLink to="/saved" icon={<Heart size={18} />} label="Saved" active={location.pathname === '/saved'} />
                  <NavLink to="/sessions" icon={<Video size={18} />} label="Sessions" active={location.pathname === '/sessions'} />
                  <NavLink to="/profile" icon={<User size={18} />} label="Profile" active={location.pathname === '/profile'} />
                </>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-secondary bg-card-bg text-text-muted hover:text-primary shadow-sm transition-all active:scale-95"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/20 border-2 border-card-bg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {isNotifOpen && (
                      <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-secondary bg-card-bg text-primary shadow-sm transition-all hover:bg-secondary/20 active:scale-90"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              {user ? (
                <div className="hidden items-center gap-4 sm:flex">
                  <button 
                    onClick={handleLogoutClick} 
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all text-text-muted hover:bg-primary/5 hover:text-primary"
                  >
                    <LogOut size={16} />
                    <span className="font-bold">Log out</span>
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-3 sm:flex">
                  <Link to="/login" className="text-sm font-bold transition-colors text-text-muted hover:text-primary">Login</Link>
                  <Link 
                    to="/register" 
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-black active:scale-95"
                  >
                    Join Now
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-secondary bg-card-bg text-text-dark shadow-sm transition-all md:hidden active:scale-90"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-0 w-full border-b border-border-secondary bg-nav-bg/95 backdrop-blur-xl md:hidden z-50 overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                {user ? (
                  <>
                    <MobileNavLink to="/" icon={<Home size={20} />} label="Dashboard" onClick={() => setIsMenuOpen(false)} active={location.pathname === '/'} />
                    <MobileNavLink to="/matches" icon={<Users size={20} />} label="Matches" onClick={() => setIsMenuOpen(false)} active={location.pathname === '/matches'} />
                    <MobileNavLink to="/saved" icon={<Heart size={20} />} label="Saved Masters" onClick={() => setIsMenuOpen(false)} active={location.pathname === '/saved'} />
                    <MobileNavLink to="/sessions" icon={<Video size={20} />} label="Sessions" onClick={() => setIsMenuOpen(false)} active={location.pathname === '/sessions'} />
                    <MobileNavLink to="/profile" icon={<User size={20} />} label="Profile" onClick={() => setIsMenuOpen(false)} active={location.pathname === '/profile'} />
                    <div className="my-2 border-t border-border-secondary pt-2">
                      <button 
                        onClick={handleLogoutClick}
                        className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black text-primary transition-all hover:bg-primary/5 active:scale-95"
                      >
                        <LogOut size={20} />
                        Log out of Circle
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 p-2 text-center">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-2xl border-2 border-border-secondary bg-card-bg py-4 text-sm font-black text-text-dark">Login</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="rounded-2xl bg-primary py-4 text-sm font-black text-white shadow-lg shadow-primary/20">Join the Circle</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        message="Are you sure you want to exit the Circle? You'll need to sign back in to continue your mastery exchange."
        confirmText="Yes, Logout"
        cancelText="Stay Logged In"
      />
    </>
  );
};

const NavLink = ({ to, icon, label, active }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
        active 
          ? 'bg-secondary/40 text-primary shadow-sm' 
          : 'text-text-muted hover:bg-secondary/20 hover:text-primary'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, icon, label, active, onClick }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-black transition-all ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-text-muted hover:bg-primary/5 hover:text-primary'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

export default Navbar;
