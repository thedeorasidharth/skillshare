import { useContext } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { ThemeContext } from '../context/ThemeContext';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={18} className="text-green-500" />;
    case 'error':
      return <XCircle size={18} className="text-red-500" />;
    default:
      return <Info size={18} className="text-[#800020]" />;
  }
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  const { theme } = useContext(ThemeContext);

  // Inverse theme logic: Light UI -> Dark Toast, Dark UI -> Light Toast
  const toastBgClass = theme === 'light' ? 'bg-[#2B2B2B] text-white' : 'bg-[#FFF5F5] text-[#2B2B2B]';
  const shadowClass = theme === 'light' ? 'shadow-2xl shadow-black/40' : 'shadow-xl shadow-secondary/20';

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 max-w-[320px] w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            group pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border-l-[6px] 
            ${toastBgClass} ${shadowClass} 
            transition-all duration-300 animate-in fade-in slide-in-from-right-8
            ${toast.type === 'success' ? 'border-green-500' : 
              toast.type === 'error' ? 'border-red-500' : 
              'border-[#800020]'}
          `}
        >
          <div className="mt-0.5 shrink-0">
            <ToastIcon type={toast.type} />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
