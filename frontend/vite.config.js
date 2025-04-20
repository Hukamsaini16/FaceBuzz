// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows access from external devices
    port: 5173,
    allowedHosts: [
      '8b5d-223-184-242-170.ngrok-free.app', // your ngrok domain
    ],
  },
});

