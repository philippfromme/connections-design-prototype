import { useSyncExternalStore } from 'react';

import { INITIAL_SECRETS } from '../sample-credentials';

/**
 * Shared, framework-agnostic state for the credentials prototype.
 *
 * Both the React modal layer and the vanilla chooser glue
 * (`credentials-ui.js`) read and mutate this store. Mutations bump a version
 * counter and notify subscribers; React components subscribe via
 * `useStoreVersion`, the vanilla glue via `subscribe`.
 */

export const SECRET_PREFIX = 'camunda.secrets.';

/**
 * Simulated permission state. In production this comes from
 * GET /v2/user/cluster-variable-permissions (see GAP-002).
 */
const permissions = {
  create: true,
  update: true
};

/**
 * Simulated cluster secret store. Modelled as names only — it is non-revealing,
 * so secret *values* are never read back (see GAP-003). `writable` mirrors a
 * cluster capability: read-only backends (Vault, AWS, GCP, Azure) cannot create
 * secrets from the Modeler regardless of permissions (see GAP-004).
 */
const secretStore = {
  writable: true,
  names: [ ...INITIAL_SECRETS ]
};

let version = 0;
const listeners = new Set();

function emit() {
  version++;
  listeners.forEach(fn => fn());
}

/**
 * Subscribe to any store change. Returns an unsubscribe function.
 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * React hook: re-renders the calling component whenever the store changes.
 */
export function useStoreVersion() {
  return useSyncExternalStore(subscribe, () => version);
}

// --- permissions -----------------------------------------------------------

export function getPermissions() {
  return permissions;
}

export function setPermission(perm, value) {
  permissions[perm] = value;
  emit();
}

// --- secrets ---------------------------------------------------------------

export function getSecretStore() {
  return secretStore;
}

export function setSecretWritable(value) {
  secretStore.writable = value;
  emit();
}

export function listSecretNames() {
  return [ ...secretStore.names ].sort();
}

export function secretExists(name) {
  return secretStore.names.includes(name);
}

export function createSecret(name) {
  // The value is intentionally not stored: the store is non-revealing.
  if (!secretExists(name)) {
    secretStore.names.push(name);
    emit();
  }
}

// --- "Manage secrets…" deep link ------------------------------------------

/**
 * Lets a secret field (rendered anywhere) open the Manage modal on the Secrets
 * tab. Registered once by `mountCredentialsUI`; mirrors the original
 * module-level `openManageModal` indirection.
 */
let manageSecretsHandler = () => {};

export function setManageSecretsHandler(fn) {
  manageSecretsHandler = fn;
}

export function openManageSecrets() {
  manageSecretsHandler('secrets');
}
