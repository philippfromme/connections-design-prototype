import { defineConfig } from 'vite';

export default defineConfig({
  // relative base so the build works under the GitHub Pages project subpath
  base: './',
  server: {
    open: true
  }
});
