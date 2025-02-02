import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/dashboard",  // Ensuring the app is served from the '/dashboard' route
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',  // This defines '@' as the 'src' directory
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,  // Increase the chunk size limit to suppress the warning (e.g., 2MB)

  },
});
