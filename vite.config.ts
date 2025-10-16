import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        open: true,
        allowedHosts: true,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            configure: (proxy, options) => {
              // Fallback to mock response if Vercel API is not running
              proxy.on('error', (err, req, res) => {
                console.warn('API proxy error - Vercel API might not be running');
                res.writeHead(503, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'API server not available. Run with vercel dev or start the API server on port 3001'
                }));
              });
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
