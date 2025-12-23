
import React from 'react';
import { createRoot } from 'https://esm.sh/react-dom@^19.2.3/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  
  // Render aplikasi
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Logika untuk menghilangkan splash screen setelah aplikasi dimuat
  window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(() => {
        splash.style.opacity = '0';
        splash.style.visibility = 'hidden';
        // Hapus dari DOM setelah animasi transisi selesai (0.5s di CSS)
        setTimeout(() => {
          splash.remove();
        }, 500);
      }, 1000); // Memberikan waktu 1 detik agar splash screen terlihat elegan
    }
  });
} else {
  console.error("Gagal menemukan elemen root. Pastikan index.html memiliki <div id='root'></div>");
}
