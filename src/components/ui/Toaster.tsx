import React, { useState, useEffect, createContext, useCallback } from 'react';
import { AlertCircle, CheckCircle, X, Info } from 'lucide-react';

export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const Toaster: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="fixed top-0 right-0 flex flex-col gap-2 p-4 sm:top-4 sm:right-4 max-w-sm w-full z-50 pointer-events-none"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (toast.variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'destructive':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getToastClassName = () => {
    const baseClasses = 
      "pointer-events-auto flex items-start w-full rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";
    
    const variantClasses = {
      default: "bg-white",
      success: "bg-white border-l-4 border-green-500",
      destructive: "bg-white border-l-4 border-red-500",
      warning: "bg-white border-l-4 border-amber-500",
    };
    
    const visibilityClasses = isVisible
      ? "translate-y-0 opacity-100"
      : "translate-y-2 opacity-0";
    
    return `${baseClasses} ${variantClasses[toast.variant || 'default']} ${visibilityClasses}`;
  };

  return (
    <div className={getToastClassName()}>
      <div className="p-4 w-full flex">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-900">{toast.title}</p>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {toast.description && (
            <p className="mt-1 text-sm text-gray-500">{toast.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};