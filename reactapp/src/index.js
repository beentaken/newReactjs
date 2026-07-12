import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Use the React 18 root API
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
