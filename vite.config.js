import { defineConfig } from 'vite';

export default defineConfig({
  // relative base so the build works under the GitHub Pages project subpath
  base: './',
  server: {
    open: true
  },
  resolve: {
    // linked package ships its own copies of these — force a single instance
    // to avoid duplicate preact/hooks context errors
    dedupe: [
      'preact',
      'preact/hooks',
      '@bpmn-io/properties-panel',
      'bpmn-js',
      'diagram-js'
    ]
  },
  optimizeDeps: {
    // linked package — don't pre-bundle so local edits/rebuilds are picked up
    exclude: [ 'bpmn-js-element-templates' ]
  }
});
