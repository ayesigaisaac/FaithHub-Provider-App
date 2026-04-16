import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import { AuthProvider } from './auth/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeModeProvider>
  </React.StrictMode>,
);
