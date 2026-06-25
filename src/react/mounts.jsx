import { mountModal } from './mountModal';
import { ManageModal } from './ManageModal';
import { CreateOverlay, EditOverlay } from './overlays';
import { XmlViewer, TemplateViewer } from './viewers';

/**
 * Imperative entry points for the React modal layer. These keep the vanilla
 * glue in `credentials-ui.js` free of JSX while delegating all rendering to
 * React.
 */

export function openCreateOverlay(credentialInstances, templateId, onCreated) {
  mountModal((close) => (
    <CreateOverlay
      credentialInstances={credentialInstances}
      templateId={templateId}
      onCreated={onCreated}
      onClose={close}
    />
  ));
}

export function openEditOverlay(credentialInstances, credential, idx) {
  mountModal((close) => (
    <EditOverlay
      credentialInstances={credentialInstances}
      credential={credential}
      idx={idx}
      onClose={close}
    />
  ));
}

export function openXmlViewer(xml) {
  mountModal((close) => <XmlViewer xml={xml} onClose={close} />);
}

export function openTemplateViewer(json, subtitle) {
  mountModal((close) => <TemplateViewer json={json} subtitle={subtitle} onClose={close} />);
}

/**
 * Creates a controller for the singleton Manage modal. `open(tab)` mounts it (or
 * switches tab if already open).
 */
export function createManageController(credentialInstances) {
  let close = null;
  let setTab = null;

  return {
    open(tab = 'credentials') {
      if (close) {
        setTab?.(tab);
        return;
      }

      close = mountModal((dismiss) => (
        <ManageModal
          credentialInstances={credentialInstances}
          initialTab={tab}
          registerSetTab={(fn) => { setTab = fn; }}
          onClose={() => {
            dismiss();
            close = null;
            setTab = null;
          }}
        />
      ));
    }
  };
}
