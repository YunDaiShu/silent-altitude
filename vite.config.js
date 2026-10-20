import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps the built assets relocatable, so dist/ works both at a domain
// root and under a sub-path (GitHub Pages project site, CloudBase, EdgeOne Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5180 },
  preview: { host: '0.0.0.0', port: 5180 },
});
