import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';

import './index.css';
import App from './App';
import { FavoritesContextProvider } from './store/favorites-context';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <FavoritesContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FavoritesContextProvider>
  </AuthProvider>
);