/**
 * Generic modal frame: backdrop + panel + header with a close button.
 *
 * Clicking the backdrop (but not the panel) calls `onClose`, matching the
 * original vanilla overlays. `className` selects the panel style
 * (`ci-modal` for credential modals, `xml-modal` for the viewers).
 */
export function Modal({
  onClose,
  className = 'ci-modal',
  backdropClassName = 'ci-modal-backdrop',
  header,
  title,
  children
}) {
  return (
    <div
      className={backdropClassName}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={className}>
        {header || (
          <div className="ci-modal-header">
            <h3>{title}</h3>
            <button data-close onClick={onClose}>×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
