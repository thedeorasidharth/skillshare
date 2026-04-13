import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle, Info, AlertCircle, Trash2, Check, Clock, Calendar } from 'lucide-react';

const NotificationPage = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Info className="text-primary" size={20} />;
    }
  };

  const formatFullDate = (ts) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
            <Bell size={12} /> Activity Ledger
          </div>
          <h1 className="text-4xl font-black tracking-tight text-text-dark sm:text-6xl">
            Notifications
          </h1>
          <p className="mt-4 text-lg font-bold text-text-muted">
            Track your journey through the Mastery Circle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 rounded-2xl border-2 border-border-secondary bg-card-bg px-5 py-3 text-xs font-black text-text-dark transition-all hover:bg-secondary/10 disabled:opacity-50"
          >
            <Check size={16} /> Mark all read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 rounded-2xl bg-primary/10 px-5 py-3 text-xs font-black text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-50"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-border-secondary bg-primary/[0.02] py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-card-bg shadow-xl">
              <Bell size={40} className="text-text-muted/20" />
            </div>
            <h3 className="text-xl font-black text-text-dark">Silent Waters</h3>
            <p className="mt-2 text-sm font-bold text-text-muted">No activities have been recorded in your ledger yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`group relative overflow-hidden rounded-[32px] border-2 transition-all duration-300 p-6 sm:p-8 cursor-pointer ${
                !n.read 
                  ? 'border-primary/20 bg-primary/[0.03] shadow-lg shadow-primary/5' 
                  : 'border-border-secondary bg-card-bg hover:border-primary/10'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner ${
                  !n.read ? 'bg-primary/10' : 'bg-primary/5'
                }`}>
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/60">
                      {n.type || 'Activity'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted/40">
                      <Calendar size={10} />
                      {formatFullDate(n.timestamp)}
                    </div>
                  </div>
                  <h4 className={`mt-2 text-lg leading-snug sm:text-xl ${
                    !n.read ? 'font-black text-text-dark' : 'font-bold text-text-muted'
                  }`}>
                    {n.message}
                  </h4>
                  
                  {!n.read && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white animate-pulse">
                     New Entry
                    </div>
                  )}
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-6 -right-6 text-primary/5 opacity-0 transition-opacity group-hover:opacity-100">
                <Bell size={80} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
