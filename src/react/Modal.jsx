import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@camunda/design-system';

/**
 * Generic modal frame built on the Camunda design system `Dialog`.
 *
 * `DialogContent` already provides the overlay, portal, `.c4-ui` scope and a
 * close button, so callers only supply a `title` (or a fully custom `header`)
 * and the body. Dismissing via the close button, the backdrop or `Escape`
 * routes through `onClose`.
 *
 * `width` overrides the default (narrow) dialog width via an inline style,
 * since the prebuilt design-system stylesheet only ships the utility classes
 * its own components use.
 */
export function Modal({
  onClose,
  title,
  header,
  width = 560,
  children
}) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        aria-describedby={undefined}
        style={{
          maxWidth: width,
          width: 'calc(100% - 2rem)',
          maxHeight: 'calc(100vh - 2rem)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {header || (title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        ))}
        <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
