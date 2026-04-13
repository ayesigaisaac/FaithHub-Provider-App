import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showNotification = useCallback((msg: string, sev: AlertColor = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const showSuccess = useCallback((msg: string) => showNotification(msg, 'success'), [showNotification]);
  const showError = useCallback((msg: string) => showNotification(msg, 'error'), [showNotification]);
  const showWarning = useCallback((msg: string) => showNotification(msg, 'warning'), [showNotification]);
  const showInfo = useCallback((msg: string) => showNotification(msg, 'info'), [showNotification]);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Snackbar open={open} autoHideDuration={4200} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%', borderRadius: '16px', fontWeight: 600 }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
