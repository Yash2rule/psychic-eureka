import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  build: {
    outDir: 'dist',      // Output directory for the build
    emptyOutDir: true,   // Clean the output directory before building
    manifest: true,      // Generate manifest.json in the build directory
    rollupOptions: {
      input: './src/main.tsx',  // Specify your main.tsx file here
    },
  },
})
