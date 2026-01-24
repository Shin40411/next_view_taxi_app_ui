import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import sitemap from 'vite-plugin-sitemap';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      // eslint: {
      //   lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      // },
    }),
    sitemap({
      hostname: 'https://goxu.vn',
      dynamicRoutes: [
        '/',
        '/auth/jwt/login',
        '/auth/jwt/register',
        '/auth/jwt/forgot-password',
        '/auth/jwt/reset-password',
        '/auth/jwt/verify-otp',
        '/auth/jwt/request-login-otp',
      ],
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: 8081,
  },
  preview: {
    port: 8081,
  },
});
