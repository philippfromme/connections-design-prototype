import { useState } from 'react';

import {
  Button,
  Checkbox,
  Input,
  Label
} from '@camunda/design-system';

import {
  SECRET_PREFIX,
  getSecretStore,
  setSecretWritable,
  listSecretNames,
  secretExists,
  createSecret,
  useStoreVersion
} from './store';

/**
 * Secrets tab of the Manage modal: the cluster secret store (names only,
 * non-revealing), a writable-capability toggle (GAP-004), and an add-secret
 * form gated on that capability.
 */
export function SecretsPanel() {
  useStoreVersion();

  const secretStore = getSecretStore();
  const names = listSecretNames();

  const [ newName, setNewName ] = useState('');
  const [ newValue, setNewValue ] = useState('');
  const [ error, setError ] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    setError('');

    if (!/^[A-Z][A-Z0-9_]*$/.test(name)) {
      setError('Use UPPER_SNAKE_CASE (e.g. SLACK_TOKEN_PROD).');
      return;
    }
    if (secretExists(name)) {
      setError('A secret with this name already exists.');
      return;
    }

    createSecret(name);
    setNewName('');
    setNewValue('');
  };

  return (
    <>
      <div className="ci-section">
        <h4>Secret store capability</h4>
        <div className="ci-permissions">
          <Label className="ci-checkbox-label">
            <Checkbox
              data-secret-cap="writable"
              checked={secretStore.writable}
              onCheckedChange={(checked) => setSecretWritable(checked === true)}
            /> writable (GAP-004)
          </Label>
        </div>
        <p className="ci-secret-modal-hint">
          References (<code>{SECRET_PREFIX}NAME</code>) point at secrets in the connected
          cluster's store. The store is non-revealing — values are never read back (GAP-003).
        </p>
      </div>

      <div className="ci-section">
        <h4>Secrets on this cluster</h4>
        <div className="ci-secret-list-container">
          {names.length === 0 ? (
            <p className="ci-empty">No secrets on this cluster yet.</p>
          ) : (
            <ul className="ci-secret-list">
              {names.map(n => (
                <li key={n}><span className="ci-secret-name">{n}</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {secretStore.writable ? (
        <div className="ci-section">
          <h4>Add a secret</h4>
          <div className="ci-secret-create-row">
            <Input
              type="text"
              className="ci-secret-input"
              data-new-name
              placeholder="SECRET_NAME"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              type="text"
              className="ci-secret-input"
              data-new-value
              placeholder="value (write-only)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <Button type="button" className="ci-secret-btn" data-add onClick={handleAdd}>Add secret</Button>
          </div>
          {error && <span className="ci-field-error" data-new-error>{error}</span>}
        </div>
      ) : (
        <div className="ci-section">
          <p className="ci-empty">This cluster's secret store is read-only (GAP-004) — secrets are managed externally and cannot be created here.</p>
        </div>
      )}
    </>
  );
}
