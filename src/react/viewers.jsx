import { Modal } from './Modal';

/**
 * Read-only viewer for the serialized BPMN XML.
 */
export function XmlViewer({ xml, onClose }) {
  return (
    <Modal
      onClose={onClose}
      className="xml-modal"
      backdropClassName="xml-modal-backdrop"
      header={(
        <div className="xml-modal-header">
          <h3>BPMN XML</h3>
          <button data-close onClick={onClose}>×</button>
        </div>
      )}
    >
      <pre>{xml}</pre>
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
      className="xml-modal"
      backdropClassName="xml-modal-backdrop"
      header={(
        <div className="xml-modal-header">
          <div className="xml-modal-title">
            <h3>Element Template JSON</h3>
            <span className="xml-modal-subtitle">{subtitle}</span>
          </div>
          <button data-close onClick={onClose}>×</button>
        </div>
      )}
    >
      <pre>{json}</pre>
    </Modal>
  );
}
