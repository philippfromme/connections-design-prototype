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
      // bpmn-js-properties-panel, bpmn-js-element-templates AND @bpmn-io/
      // properties-panel itself all import preact via these subpaths. They
      // must collapse to ONE instance, otherwise the optimized panel renders
      // with one preact while the (excluded) element-templates reads hooks
      // from a second copy → `currentComponent` undefined → useLayoutState
      // "Cannot read properties of undefined (reading 'context')".
      '@bpmn-io/properties-panel/preact',
      '@bpmn-io/properties-panel/preact/hooks',
      '@bpmn-io/properties-panel/preact/jsx-runtime',
      '@bpmn-io/properties-panel/preact/compat',
      '@bpmn-io/properties-panel',
      'bpmn-js',
      'diagram-js'
    ]
  },
  optimizeDeps: {
    // bpmn-js-element-templates MUST be pre-bundled together with the panel.
    // If it is excluded (served raw), the raw @bpmn-io/properties-panel/dist it
    // pulls in imports preact via relative `../preact/hooks` paths, producing a
    // SECOND preact instance separate from the optimized renderer's copy. The
    // panel then renders with one preact while ElementTemplatesGroup's
    // useLayoutState reads hooks from the other → `currentComponent` undefined
    // → "Cannot read properties of undefined (reading 'context')". Pre-bundling
    // it keeps a single shared preact across the whole dependency graph.
    // (Local rebuilds of the linked dist are picked up via `rm -rf
    // node_modules/.vite` + dev-server restart.)
    include: [
      'classnames',
      'bpmnlint/lib/resolver/static-resolver',
      'semver',
      'semver-compare',
      'uuid',
      'ids',
      'min-dash',
      'bpmn-js-element-templates',
      // Pre-bundle the shared preact subpaths into single optimized chunks so
      // every consumer references the SAME preact/hooks instance.
      '@bpmn-io/properties-panel/preact',
      '@bpmn-io/properties-panel/preact/hooks',
      '@bpmn-io/properties-panel/preact/jsx-runtime',
      '@bpmn-io/properties-panel/preact/compat'
    ]
  }
});
