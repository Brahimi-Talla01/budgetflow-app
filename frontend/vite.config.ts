import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    // Le pool `forks` ne démarre pas dans certains environnements conteneurisés.
    pool: 'threads',
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
})
