import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { notifications, markAsRead, clearAll } = useNotifications();

  const formatTime = (ts) => {
    const diff = (Date.now() - ts) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  const latestNotifications = notifications.slice(0, 5);
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
      className="absolute right-0 top-full mt-4 w-80 overflow-hidden rounded-[24px] border-2 border-border-secondary bg-card-bg shadow-2xl z-[100] origin-top-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-secondary bg-primary/5 px-6 py-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-text-dark">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={clearAll}
            className="text-text-muted hover:text-primary transition-colors"
            title="Clear all"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell size={32} className="text-text-muted/20 mb-3" />
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No activities yet</p>
          </div>
        ) : (
          latestNotifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => { markAsRead(n.id); navigate('/notifications'); onClose(); }}
              className={`group flex items-start gap-3 border-b border-border-secondary/50 px-6 py-4 cursor-pointer transition-colors hover:bg-primary/5 ${!n.read ? 'bg-primary/[0.02]' : ''}`}
            >
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1">
                <p className={`text-sm leading-tight ${!n.read ? 'font-black text-text-dark' : 'font-bold text-text-muted'}`}>
                  {n.message}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted/60">
                  <Clock size={10} />
                  {formatTime(n.timestamp)}
                </div>
              </div>
              <ChevronRight size={14} className="mt-1 text-text-muted/20 group-hover:text-primary transition-colors" />
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <button 
          onClick={() => { navigate('/notifications'); onClose(); }}
          className="w-full border-t border-border-secondary bg-primary/5 py-3.5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-all"
        >
          View All History
        </button>
      )}
    </motion.div>
  );
};

export default NotificationDropdown;
