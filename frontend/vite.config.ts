import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load .env file based on current mode (development or production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: './', // required for relative static assets on Render
    define: {
      // Makes environment variables available in app code
      'process.env': env
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});
