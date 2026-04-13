import { LogOut, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border-2 border-border-secondary bg-card-bg p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onCancel}
          className="absolute right-6 top-6 text-text-muted hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner">
            <LogOut size={32} />
          </div>
          
          <h3 className="text-2xl font-black tracking-tight text-text-dark sm:text-3xl">
            {title || "Confirm Action"}
          </h3>
          <p className="mt-4 text-lg font-bold text-text-muted">
            {message || "Are you sure you want to proceed with this operation?"}
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={onCancel}
              className="flex-1 rounded-2xl border-2 border-border-secondary bg-card-bg px-6 py-3.5 text-sm font-black text-text-dark transition-all hover:bg-secondary/10"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-black active:scale-[0.98]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
