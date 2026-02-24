import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes.jsx';
import AuthProvider from './providers/AuthProvider.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
       <HelmetProvider>
       <AuthProvider>
 <RouterProvider router={router}/>
 <ToastContainer />  
 </AuthProvider>
 </HelmetProvider>
  </React.StrictMode>
);


reportWebVitals();
