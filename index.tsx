
import React from 'react';
import { createRoot } from 'https://esm.sh/react-dom@^19.2.3/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Gagal menemukan elemen root. Pastikan index.html memiliki <div id='root'></div>");
}
