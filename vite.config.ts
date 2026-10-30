import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  ssr:
    command === 'build'
      ? {
          noExternal: true,
          external: ['react', 'react-dom', 'react-router', '@react-router/node'],
        }
      : undefined,
}));
