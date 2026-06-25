import { Modal } from './Modal';
import { CreateForm, EditForm } from './CredentialForm';

/**
 * Standalone "Create credential" overlay used by the chooser's "Create
 * connection" action. On save, `onCreated` receives the new credential so the
 * caller can auto-apply it to the element.
 */
export function CreateOverlay({ credentialInstances, templateId, onCreated, onClose }) {
  return (
    <Modal onClose={onClose} title="Create credential">
      <div className="ci-modal-body">
        <div className="ci-form-container">
          <CreateForm
            credentialInstances={credentialInstances}
            templateId={templateId}
            onSubmit={(created) => {
              onClose();
              if (created) onCreated?.(created);
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </Modal>
  );
}

/**
 * Standalone "Update credential" overlay used by the chooser's context-menu
 * update action, pre-filled with the applied credential's values.
 */
export function EditOverlay({ credentialInstances, credential, idx, onClose }) {
  return (
    <Modal onClose={onClose} title="Update credential">
      <div className="ci-modal-body">
        <div className="ci-form-container">
          <EditForm
            credential={credential}
            idx={idx}
            credentialInstances={credentialInstances}
            isUpgrade={false}
            onSaved={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </Modal>
  );
}
