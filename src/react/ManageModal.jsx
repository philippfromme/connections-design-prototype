import { useEffect, useState } from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@camunda/design-system';

import { Modal } from './Modal';
import { CredentialsPanel } from './CredentialsPanel';
import { SecretsPanel } from './SecretsPanel';

/**
 * The unified management modal ("Hub" simulation) with Credentials and Secrets
 * tabs. Both panels stay mounted (`forceMount` keeps inactive `TabsContent` in
 * the tree, hidden) so in-progress form state survives a tab switch.
 * `registerSetTab` lets the controller jump to a tab when the modal is
 * reopened or deep-linked from a secret field.
 */
export function ManageModal({ credentialInstances, initialTab = 'credentials', onClose, registerSetTab }) {
  const [ activeTab, setActiveTab ] = useState(initialTab);

  useEffect(() => {
    registerSetTab?.(setActiveTab);
    return () => registerSetTab?.(null);
  }, [ registerSetTab ]);

  return (
    <Modal onClose={onClose} title="Manage Credentials and Secrets" width={720}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="ci-modal-body">
        <TabsList variant="line">
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
        </TabsList>
        <TabsContent value="credentials" forceMount hidden={activeTab !== 'credentials'}>
          <CredentialsPanel credentialInstances={credentialInstances} />
        </TabsContent>
        <TabsContent value="secrets" forceMount hidden={activeTab !== 'secrets'}>
          <SecretsPanel />
        </TabsContent>
      </Tabs>
    </Modal>
  );
}
