import { useReducer } from 'react';

import {
  CONFIGURATION_TEMPLATES,
  SAMPLE_CREDENTIALS,
  SLACK_ICON
} from '../sample-credentials';

import {
  getPermissions,
  setPermission,
  useStoreVersion
} from './store';

import { CreateForm, EditForm } from './CredentialForm';

/**
 * Credentials tab of the Manage modal: permission toggles, the existing
 * instance list with edit/upgrade/remove actions, creation actions, and the
 * inline create/edit form.
 */
export function CredentialsPanel({ credentialInstances }) {
  useStoreVersion();
  const [ , refresh ] = useReducer(x => x + 1, 0);

  // form: null | { mode: 'create' } | { mode: 'edit', credential, idx, isUpgrade }
  const [ form, dispatchForm ] = useReducer((_, next) => next, null);

  const permissions = getPermissions();
  const all = credentialInstances.getAll();
  const loaded = credentialInstances.isLoaded();

  const setInstances = (next) => {
    credentialInstances.setInstances(next);
    refresh();
  };

  const closeForm = () => dispatchForm(null);

  const addRandom = () => {
    const id = Math.random().toString(36).slice(2, 7).toUpperCase();
    setInstances([
      ...credentialInstances.getAll(),
      {
        name: 'SLACK_' + id,
        displayName: 'Slack ' + id.charAt(0) + id.slice(1).toLowerCase(),
        kind: 'CREDENTIAL',
        configurationTemplate: 'io.camunda:slack-credential:1',
        configurationTemplateVersion: 2,
        icon: SLACK_ICON
      }
    ]);
  };

  return (
    <>
      <div className="ci-section">
        <h4>Permissions</h4>
        <div className="ci-permissions">
          <label>
            <input
              type="checkbox"
              data-perm="create"
              checked={permissions.create}
              onChange={(e) => setPermission('create', e.target.checked)}
            /> create
          </label>
          <label>
            <input
              type="checkbox"
              data-perm="update"
              checked={permissions.update}
              onChange={(e) => setPermission('update', e.target.checked)}
            /> update
          </label>
        </div>
      </div>

      <div className="ci-section">
        <h4>Existing instances{loaded ? '' : ' (not loaded — cluster disconnected)'}</h4>
        <div className="ci-list-container">
          {all.length === 0 ? (
            <p className="ci-empty">No credential instances available.</p>
          ) : (
            <ul className="ci-instance-list">
              {all.map((inst, idx) => {
                const matchingTemplate = CONFIGURATION_TEMPLATES.find(t => t.id === inst.configurationTemplate);
                const floor = matchingTemplate ? matchingTemplate.version : null;
                const isIncompatible =
                  floor != null &&
                  inst.configurationTemplateVersion != null &&
                  inst.configurationTemplateVersion < floor;

                return (
                  <li key={inst.name + ':' + idx} className={isIncompatible ? 'ci-incompatible' : ''}>
                    <div className="ci-inst-info">
                      <span className="ci-inst-name">{inst.displayName || inst.name}</span>
                      <span className="ci-inst-meta">
                        {inst.configurationTemplate} v{inst.configurationTemplateVersion || '?'}
                        {isIncompatible && <span className="ci-warning">⚠ Requires v{floor}+</span>}
                      </span>
                    </div>
                    <div className="ci-inst-actions">
                      {permissions.update && isIncompatible && (
                        <button onClick={() => dispatchForm({ mode: 'edit', credential: inst, idx, isUpgrade: true })}>
                          Upgrade
                        </button>
                      )}
                      {permissions.update && !isIncompatible && (
                        <button onClick={() => dispatchForm({ mode: 'edit', credential: inst, idx, isUpgrade: false })}>
                          Edit
                        </button>
                      )}
                      <button onClick={() => setInstances(credentialInstances.getAll().filter((_, i) => i !== idx))}>
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {permissions.create ? (
        <div className="ci-section">
          <h4>Create new credential</h4>
          <div className="ci-create-actions">
            <button data-action="random" onClick={addRandom}>Create random (Slack)</button>
            <button data-action="explicit" onClick={() => dispatchForm({ mode: 'create' })}>Create from template…</button>
          </div>
          <div className="ci-form-container">
            {form && form.mode === 'create' && (
              <CreateForm
                credentialInstances={credentialInstances}
                onSubmit={() => { closeForm(); refresh(); }}
                onCancel={closeForm}
                showManageSecrets={false}
              />
            )}
            {form && form.mode === 'edit' && (
              <EditForm
                credential={form.credential}
                idx={form.idx}
                isUpgrade={form.isUpgrade}
                credentialInstances={credentialInstances}
                onSaved={() => { closeForm(); refresh(); }}
                onCancel={closeForm}
                showManageSecrets={false}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="ci-section">
          <p className="ci-empty">Creation disabled — user lacks <code>create</code> permission on this cluster.</p>
        </div>
      )}

      <div className="ci-section">
        <h4>Bulk actions</h4>
        <div className="ci-create-actions">
          <button data-action="load-samples" onClick={() => setInstances([ ...SAMPLE_CREDENTIALS ])}>Load samples</button>
          <button data-action="mark-loaded" onClick={() => setInstances([])}>Mark loaded (empty)</button>
        </div>
      </div>
    </>
  );
}
