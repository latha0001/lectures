import { useContext } from 'react';
import { ToastContext, Toast } from '../components/ui/Toaster';

export function useToast() {
  const { addToast, removeToast, toasts } = useContext(ToastContext);
  
  return {
    toast: (props: Omit<Toast, 'id'>) => addToast(props),
    dismiss: (id: string) => removeToast(id),
    toasts,
  };
}