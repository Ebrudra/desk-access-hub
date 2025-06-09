
import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ToastContextType {
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastNotifications = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastNotifications must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const showError = (message: string, title = 'Error') => {
    toast({
      title,
      description: message,
      variant: 'destructive',
    });
  };

  const showSuccess = (message: string, title = 'Success') => {
    toast({
      title,
      description: message,
    });
  };

  const showWarning = (message: string, title = 'Warning') => {
    toast({
      title,
      description: message,
    });
  };

  const showInfo = (message: string, title = 'Info') => {
    toast({
      title,
      description: message,
    });
  };

  return (
    <ToastContext.Provider value={{ showError, showSuccess, showWarning, showInfo }}>
      {children}
    </ToastContext.Provider>
  );
};
