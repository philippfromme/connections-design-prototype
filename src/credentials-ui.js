import { domify } from 'min-dom';

import {
  SLACK_ICON,
  SAMPLE_CREDENTIALS,
  CREDENTIAL_SCHEMAS
} from './sample-credentials';

function escapeHTML(unsafe) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * Mounts the demo toolbar: the "Credentials" modal (Hub simulation) and the
 * XML viewer. Mirrors the prototype UI from bpmn-js-element-templates.
 *
 * Note: the underlying modeler service is still named `connectionInstances`
 * because it is provided by the upstream `bpmn-js-element-templates`
 * `connections-design` branch, which has not been renamed yet.
 */
export function mountCredentialsUI(modeler, container) {
  const credentialInstances = modeler.get('connectionInstances', false);
  const bpmnjs = modeler.get('bpmnjs');

  if (credentialInstances) {
    mountCredentialsModal(credentialInstances, container);
  }

  mountXmlViewer(bpmnjs, container);
}

function mountCredentialsModal(credentialInstances, container) {
  const toggleBtn = domify('<button class="ci-toggle-btn">Credentials</button>');
  container.appendChild(toggleBtn);

  let backdrop = null;

  const closeModal = () => {
    if (backdrop) {
      backdrop.remove();
      backdrop = null;
    }
  };

  const openModal = () => {
    if (backdrop) return;

    backdrop = domify('<div class="ci-modal-backdrop"></div>');
    const modal = domify('<div class="ci-modal"></div>');
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    renderModal(modal);
  };

  const renderModal = (modal) => {
    const all = credentialInstances.getAll();
    const loaded = credentialInstances.isLoaded();

    modal.innerHTML = `
      <div class="ci-modal-header">
        <h3>Credential Instances (Hub simulation)</h3>
        <button data-close>&times;</button>
      </div>
      <div class="ci-modal-body">
        <div class="ci-section">
          <h4>Existing instances${ loaded ? '' : ' (not loaded — cluster disconnected)' }</h4>
          <div class="ci-list-container"></div>
        </div>
        <div class="ci-section">
          <h4>Create new credential</h4>
          <div class="ci-create-actions">
            <button data-action="random">Create random (Slack)</button>
            <button data-action="explicit">Create from schema…</button>
          </div>
          <div class="ci-form-container"></div>
        </div>
        <div class="ci-section">
          <h4>Bulk actions</h4>
          <div class="ci-create-actions">
            <button data-action="load-samples">Load samples</button>
            <button data-action="mark-loaded">Mark loaded (empty)</button>
          </div>
        </div>
      </div>
    `;

    modal.querySelector('[data-close]').addEventListener('click', closeModal);

    // Render instance list
    const listContainer = modal.querySelector('.ci-list-container');

    if (all.length === 0) {
      listContainer.innerHTML = '<p class="ci-empty">No credential instances available.</p>';
    } else {
      const list = domify('<ul class="ci-instance-list"></ul>');

      all.forEach((inst, idx) => {
        const li = domify(
          `<li>
            <div class="ci-inst-info">
              <span class="ci-inst-name">${ escapeHTML(inst.displayName || inst.name) }</span>
              <span class="ci-inst-meta">${ escapeHTML(inst.templateRef) } v${ inst.version || '?' } · ${ escapeHTML(inst.authType || '-') } · ${ escapeHTML(inst.status || '-') }</span>
            </div>
            <button data-remove="${ idx }">Remove</button>
          </li>`
        );

        li.querySelector('button').addEventListener('click', () => {
          const updated = credentialInstances.getAll().filter((_, i) => i !== idx);
          credentialInstances.setInstances(updated);
          renderModal(modal);
        });

        list.appendChild(li);
      });

      listContainer.appendChild(list);
    }

    // Random creation
    modal.querySelector('[data-action="random"]').addEventListener('click', () => {
      const id = Math.random().toString(36).slice(2, 7);
      const current = credentialInstances.getAll();
      const authTypes = [ 'Bearer token', 'OAuth2', 'Bot token' ];

      credentialInstances.setInstances([
        ...current,
        {
          name: 'slack_' + id,
          displayName: 'Slack ' + id.charAt(0).toUpperCase() + id.slice(1),
          kind: 'CREDENTIAL',
          templateRef: 'io.camunda:slack-credential:1',
          version: Math.ceil(Math.random() * 3),
          type: 'Slack',
          authType: authTypes[Math.floor(Math.random() * authTypes.length)],
          status: Math.random() > 0.3 ? 'active' : 'inactive',
          icon: SLACK_ICON
        }
      ]);

      renderModal(modal);
    });

    // Explicit creation — render credential schema form
    const formContainer = modal.querySelector('.ci-form-container');

    modal.querySelector('[data-action="explicit"]').addEventListener('click', () => {
      const schema = CREDENTIAL_SCHEMAS[0]; // only Slack for now

      formContainer.innerHTML = '';

      const form = domify(
        `<div class="ci-form">
          <h5>New "${ escapeHTML(schema.name) }" — fill in fields as Hub would render them</h5>
          <div class="ci-form-row">
            <label>Instance name (cluster variable key)</label>
            <input type="text" data-field="name" placeholder="e.g. slackProduction" />
          </div>
          <div class="ci-form-row">
            <label>Display name</label>
            <input type="text" data-field="displayName" placeholder="e.g. Slack Production" />
          </div>
          <div class="ci-form-row">
            <label>Version (stamped from schema)</label>
            <label style="display:inline-flex;align-items:center;gap:4px;font-weight:normal;font-size:11px;color:#888;margin-bottom:4px;">
              <input type="checkbox" data-field="overrideVersion" />
              Override version (demo only — simulate outdated instances)
            </label>
            <input type="number" data-field="version" value="${ schema.version }" min="1" disabled />
          </div>
          <hr/>
          <p style="font-size:11px;color:#666;margin:4px 0 8px;">
            Below: credential schema properties (the JSON object stored as cluster variable)
          </p>
          ${ schema.properties.map(p =>
            `<div class="ci-form-row">
              <label>${ escapeHTML(p.label) }${ p.required ? ' *' : '' }</label>
              <input type="text" data-prop="${ escapeHTML(p.key) }" placeholder="${ escapeHTML(p.key) }" />
            </div>`
          ).join('') }
          <div class="ci-form-actions">
            <button data-primary data-action="submit">Create credential</button>
            <button data-action="cancel">Cancel</button>
          </div>
        </div>`
      );

      // Toggle version override
      form.querySelector('[data-field="overrideVersion"]').addEventListener('change', (e) => {
        form.querySelector('[data-field="version"]').disabled = !e.target.checked;
      });

      form.querySelector('[data-action="cancel"]').addEventListener('click', () => {
        formContainer.innerHTML = '';
      });

      form.querySelector('[data-action="submit"]').addEventListener('click', () => {
        const name = form.querySelector('[data-field="name"]').value.trim();
        const displayName = form.querySelector('[data-field="displayName"]').value.trim();
        const version = parseInt(form.querySelector('[data-field="version"]').value, 10) || 1;

        if (!name) {
          alert('Instance name is required');
          return;
        }

        const current = credentialInstances.getAll();

        credentialInstances.setInstances([
          ...current,
          {
            name,
            displayName: displayName || name,
            kind: 'CREDENTIAL',
            templateRef: schema.id,
            version,
            type: 'Slack',
            authType: 'Bearer token',
            status: 'active',
            icon: schema.icon
          }
        ]);

        formContainer.innerHTML = '';
        renderModal(modal);
      });

      formContainer.appendChild(form);
    });

    // Bulk actions
    modal.querySelector('[data-action="load-samples"]').addEventListener('click', () => {
      credentialInstances.setInstances([ ...SAMPLE_CREDENTIALS ]);
      renderModal(modal);
    });

    modal.querySelector('[data-action="mark-loaded"]').addEventListener('click', () => {
      credentialInstances.setInstances([]);
      renderModal(modal);
    });
  };

  toggleBtn.addEventListener('click', openModal);
}

function mountXmlViewer(bpmnjs, container) {
  const xmlBtn = domify('<button class="ci-toggle-btn" style="left: 120px;">&#60;/&#62; XML</button>');
  container.appendChild(xmlBtn);

  xmlBtn.addEventListener('click', async () => {
    const { xml } = await bpmnjs.saveXML({ format: true });

    const backdrop = domify('<div class="xml-modal-backdrop"></div>');
    const modal = domify(
      `<div class="xml-modal">
        <div class="xml-modal-header">
          <h3>BPMN XML</h3>
          <button data-close>&times;</button>
        </div>
        <pre></pre>
      </div>`
    );

    modal.querySelector('pre').textContent = xml;
    modal.querySelector('[data-close]').addEventListener('click', () => backdrop.remove());
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
  });
}
