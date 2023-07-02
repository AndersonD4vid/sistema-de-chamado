import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes';
// import { FaBeer } from "react-icons/fa";
import AuthProvider from './contexts/auth';
import { ToastContainer } from 'react-toastify'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer autoClose={3000}  />
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  );
}