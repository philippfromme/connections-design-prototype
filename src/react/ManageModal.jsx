import { useEffect, useState } from 'react';

import { Modal } from './Modal';
import { CredentialsPanel } from './CredentialsPanel';
import { SecretsPanel } from './SecretsPanel';

/**
 * The unified management modal ("Hub" simulation) with Credentials and Secrets
 * tabs. Both panels stay mounted (toggled via `hidden`) so in-progress form
 * state survives a tab switch. `registerSetTab` lets the controller jump to a
 * tab when the modal is reopened or deep-linked from a secret field.
 */
export function ManageModal({ credentialInstances, initialTab = 'credentials', onClose, registerSetTab }) {
  const [ activeTab, setActiveTab ] = useState(initialTab);

  useEffect(() => {
    registerSetTab?.(setActiveTab);
    return () => registerSetTab?.(null);
  }, [ registerSetTab ]);

  const tab = (id, label) => (
    <button
      type="button"
      className={'ci-tab' + (activeTab === id ? ' active' : '')}
      data-tab={id}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );

  return (
    <Modal onClose={onClose} title="Manage (Hub)">
      <div className="ci-tabs">
        {tab('credentials', 'Credentials')}
        {tab('secrets', 'Secrets')}
      </div>
      <div className="ci-modal-body">
        <div className="ci-tab-panel" data-panel="credentials" hidden={activeTab !== 'credentials'}>
          <CredentialsPanel credentialInstances={credentialInstances} />
        </div>
        <div className="ci-tab-panel" data-panel="secrets" hidden={activeTab !== 'secrets'}>
          <SecretsPanel />
        </div>
      </div>
    </Modal>
  );
}
