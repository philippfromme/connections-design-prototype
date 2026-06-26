import { createRoot } from 'react-dom/client';

import { C4Provider } from '@camunda/design-system';

/**
 * Mounts a React modal into its own root portaled onto document.body, isolated
 * from the (Preact) bpmn-js properties panel. `render` receives a `close`
 * callback that unmounts the tree and removes the container.
 *
 * The tree is wrapped in `<C4Provider>` to establish the `.c4-ui` design-token
 * scope that the Camunda design system components require.
 *
 * Returns the same `close` function so callers can dismiss the modal
 * programmatically.
 */
export function mountModal(render) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);

  const close = () => {
    root.unmount();
    container.remove();
  };

  root.render(<C4Provider>{render(close)}</C4Provider>);

  return close;
}
