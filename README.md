# Credentials Design Prototype

Standalone, shareable prototype of the **credential chooser** for
[bpmn-js element templates](https://github.com/bpmn-io/bpmn-js-element-templates).

It boots a [bpmn-js](https://github.com/bpmn-io/bpmn-js) modeler with the
properties panel, loads a Slack outbound connector element template that embeds
**credential templates**, and lets you create, update and select credential
instances on a service task — simulating how the Hub would surface
cluster-scoped credentials.

## What you can do

- Apply the **Slack Outbound Connector** template to the task (via the template chooser).
- **Create a credential directly from a chooser** ("Create connection"): opens a
  Hub-style form scoped to that chooser's credential template. On save the new
  credential is **automatically applied** to the element (the FEEL reference and
  cached metadata are written to the binding).
- **Update an applied credential** from the chooser's context menu. The upstream
  "Go to connection" item is relabeled **"Update connection"** and opens an edit
  form pre-filled with the credential's stored values.
- Use the **Credentials** modal to simulate the Hub / cluster:
  - load sample credential instances, or start from an empty (disconnected) cluster,
  - create a credential from a credential template (Hub-rendered form),
  - edit or **upgrade** an instance (upgrade bumps an outdated instance to the
    template's version floor),
  - override the stamped version (demo only) to simulate outdated instances,
  - toggle simulated **`create` / `update` permissions**.
- **Permission-aware actions:** when the matching permission is missing, the
  "Create connection" and "Update connection" chooser actions are visually
  disabled (greyed out, non-interactive, with an explanatory tooltip).
- Pick a credential in the properties panel. Incompatible (outdated) instances are
  shown as blocked with a `Requires vN+` hint, driven by the template's version floor.
- The element declares **two** credential choosers (Slack + HTTP proxy) to show
  that an element template can require multiple credentials, each with its own
  `credentialTemplate` and author-controlled placement.
- When **no Slack credential is chosen**, an inline fallback token field appears
  (interim `equals: ""` condition; see [Known gaps](#known-gaps-vs-the-design)).
- Inspect the resulting BPMN XML with the **`</>` XML** button — note that the
  modeler only writes a single FEEL reference plus cached template metadata.

## Running

```bash
npm install
npm run dev
```

> **Prerequisite:** the `bpmn-js-element-templates` dependency points at the
> `connections-design` feature branch
> (`github:bpmn-io/bpmn-js-element-templates#connections-design`). That branch
> must be pushed to a remote you can access for `npm install` to resolve it.
> Installing runs the package's `prepare` script, which builds its `dist/` bundle.

## Deploying to GitHub Pages

```bash
npm run deploy
```

This builds the app and publishes `dist/` to the `gh-pages` branch via
[`gh-pages`](https://github.com/tschaub/gh-pages). Enable Pages for the repo
(Settings → Pages → branch `gh-pages`). The Vite `base` is set to `./` so the
app works under the project subpath.

## How it works

- One credential = one cluster variable = one JSON object whose **shape** is defined
  by a credential template (`credentialTemplates` in the element template).
- A credential chooser is a property with `type: "Credential"` and a
  `credentialTemplate` (+ `credentialTemplateVersion`) pointing at the compatible
  credential template. A chooser only offers instances at or above the declared
  **version floor**.
- The Modeler writes only a single FEEL reference (`=camunda.vars.env.<NAME>`) into
  the `zeebe:input`, plus cached `modelerCredentialsTemplate` /
  `modelerCredentialsName` / `modelerCredentialsVersion` attributes for offline
  display and filtering.
- The connector receives the full JSON object at runtime and destructures it.

The "Create connection" / "Update connection" chooser actions are upstream stubs.
The prototype intercepts them in the capture phase (resolving the chooser via its
generated `data-entry-id`) to drive its own create / edit forms, and replicates
the upstream binding write through bpmn-js core services so created credentials
are applied immediately.

See the design docs in the `connections-design` workspace for the full rationale.

## Project layout

| File | Purpose |
| --- | --- |
| `src/app.js` | Boots the modeler, registers modules, loads the template and diagram. |
| `src/credentials-ui.js` | The "Credentials" modal (Hub simulation), the create/update/upgrade flows, chooser action wiring, and XML viewer. |
| `src/sample-credentials.js` | Mock credential instances and credential template definitions. |
| `src/moddle/zeebe-credentials.js` | Zeebe moddle extension adding the cached credential attributes. |
| `resources/slack-connector.json` | Slack element template embedding the credential templates. |
| `resources/diagram.bpmn` | Starting diagram with a single task. |

## Known gaps vs. the design

The chooser rendering, the `connectionInstances` service, and the cached BPMN
attributes are provided by the upstream `bpmn-js-element-templates`
`connections-design` branch, which has **not** been renamed to the design's
credential terminology yet. To stay functional, the prototype carries **both**
the design field names and the upstream legacy names:

- **Cached BPMN attributes** are still plural `modelerCredentialsTemplate` /
  `modelerCredentialsName` / `modelerCredentialsVersion`. The design targets
  singular `modelerCredentialTemplate` / `modelerCredentialName` with **no**
  version attribute on BPMN.
- **Element-template properties** carry both the design's `credentialTemplate` /
  `credentialTemplateVersion` and the upstream `schemaRef` / `templateVersion`;
  instance matching and the version floor still run on the upstream
  `templateRef` / `version`. A `kind: "CREDENTIAL"` discriminator is added to each
  mock instance to anticipate the design.
- **Library-internal chooser strings** ("Select connection", "Available
  connections", "Create connection") are not translated; "Update connection" is
  relabeled at runtime from the upstream "Go to connection".
- **Conditions** use the interim `equals: ""` workaround. The design's `isEmpty`
  and `configuresCredential` conditions require new condition types in the
  library and are not yet available.
- **Permissions** are simulated by the modal's toggles (see GAP-002); production
  reads them from a cluster-variable permissions endpoint.
- **Secret verification** is simulated — the non-revealing secrets API is
  unavailable (GAP-003), so secret references are surfaced as unverifiable warnings.
- **Design-time presence validation** is simulated by the modal's
  loaded / not-loaded state and the chooser's empty / "needs upgrade" states.
  Run-time correctness (the design's Test tab) is out of scope.