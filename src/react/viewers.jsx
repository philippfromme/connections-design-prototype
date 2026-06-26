import { DialogHeader, DialogTitle } from '@camunda/design-system';

import { Modal } from './Modal';

/**
 * Read-only viewer for the serialized BPMN XML.
 */
export function XmlViewer({ xml, onClose }) {
  return (
    <Modal
      onClose={onClose}
      width={900}
      header={(
        <DialogHeader>
          <DialogTitle>BPMN XML</DialogTitle>
        </DialogHeader>
      )}
    >
      <pre className="xml-modal-pre">{xml}</pre>
    </Modal>
  );
}

/**
 * Read-only viewer for the raw element template JSON.
 */
export function TemplateViewer({ json, subtitle, onClose }) {
  return (
    <Modal
      onClose={onClose}
      width={900}
      header={(
        <DialogHeader>
          <DialogTitle>Element Template JSON</DialogTitle>
          <span className="xml-modal-subtitle">{subtitle}</span>
        </DialogHeader>
      )}
    >
      <pre className="xml-modal-pre">{json}</pre>
    </Modal>
  );
}
