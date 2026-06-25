import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // relative base so the build works under the GitHub Pages project subpath
  base: './',
  // React powers the modal layer (src/react/*). The bpmn-js properties panel
  // remains Preact; the two never share a render tree (modals are portaled to
  // document.body), so the runtimes coexist safely.
  plugins: [ react() ],
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
    exclude: [ 'bpmn-js-element-templates' ],
    // ...but its CommonJS transitive deps must still be pre-bundled so Vite
    // provides an ESM-interop default export (the excluded package isn't
    // crawled, so these would otherwise be served raw and fail with
    // "does not provide an export named 'default'").
    include: [
      'classnames',
      'bpmnlint/lib/resolver/static-resolver',
      'semver',
      'semver-compare',
      'uuid',
      'ids',
      'min-dash'
    ]
  }
});
