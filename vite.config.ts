import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // us-atlas ships ESM with JSON imports — resolve them from node_modules
  resolve: {
    alias: {},
  },
});
