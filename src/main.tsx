import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import { AuthProvider } from './auth/AuthContext';
import { assertAppEnv, getAppEnv } from './config/env';

try {
  assertAppEnv();
} catch (error) {
  const env = getAppEnv();
  if (env.mode === 'production') {
    throw error;
  }
  // Surface config issues during development without crashing local iteration.
  // eslint-disable-next-line no-console
  console.warn(error);
}

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
