import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import 'primereact/resources/themes/lara-light-indigo/theme.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
