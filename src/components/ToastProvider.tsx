'use client';

import { ToastContainer } from 'react-toastify';
import { ToastCloseButton } from '@/components/ToastCloseButton';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/toast.css';

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={1}
      closeButton={ToastCloseButton}
    />
  );
}
