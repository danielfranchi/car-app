import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
    },
  },
  server: {
    port: 80, // Porta privilegiada
    strictPort: true, // Garante que o Vite use exatamente a porta especificada
    host: true, // Permite acesso externo (necessário no Docker)
  },
});
