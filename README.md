# Credentials Design Prototype

Standalone, shareable prototype of the **credential chooser** for
[bpmn-js element templates](https://github.com/bpmn-io/bpmn-js-element-templates).

It boots a [bpmn-js](https://github.com/bpmn-io/bpmn-js) modeler with the
properties panel, loads a Slack outbound connector element template that embeds
a **credential schema**, and lets you select credential instances on a service
task — simulating how the Hub would surface cluster-scoped credentials.

## What you can do

- Apply the **Slack Outbound Connector** template to the task (via the template chooser).
- Use the **⚙ Credentials** modal to simulate the Hub:
  - load sample credential instances, or start from an empty (disconnected) cluster,
  - create a credential from the credential schema (Hub-rendered form),
  - create random Slack instances,
  - override the stamped version (demo only) to simulate outdated instances.
- Pick a credential in the properties panel. Incompatible (outdated) instances are
  shown as blocked with a `Requires vN+` hint.
- The element declares **two** credential choosers (Slack + HTTP proxy) to show
  that an element template can require multiple credentials, each with its own
  `schemaRef` and author-controlled placement.
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
  by the credential schema (`credentialSchemas` in the element template).
- A credential chooser is a property with `type: "Credential"` and a `schemaRef`
  pointing at the compatible credential schema.
- The Modeler writes only a single FEEL reference (`=camunda.vars.env.<name>`) into
  the `zeebe:input`, plus cached `modelerConnectionTemplate` / `modelerConnectionName`
  attributes for offline display and filtering.
- The connector receives the full JSON object at runtime and destructures it.

See the design docs in the `connections-design` workspace for the full rationale.

## Project layout

| File | Purpose |
| --- | --- |
| `src/app.js` | Boots the modeler, registers modules, loads the template and diagram. |
| `src/credentials-ui.js` | The demo "Credentials" modal (Hub simulation) and XML viewer. |
| `src/sample-credentials.js` | Mock credential instances and credential schemas. |
| `src/moddle/zeebe-credentials.js` | Zeebe moddle extension adding the cached credential attributes. |
| `resources/slack-connector.json` | Slack element template embedding the credential schema. |
| `resources/diagram.bpmn` | Starting diagram with a single task. |

## Known gaps vs. the design

The chooser rendering, the `connectionInstances` service, and the cached BPMN
attributes are provided by the upstream `bpmn-js-element-templates`
`connections-design` branch, which has **not** been renamed to credentials yet.
The following design points are therefore still on the old "connection" naming
and cannot be changed in this prototype without first updating that branch:

- **Cached BPMN attributes** are still `modelerConnectionTemplate` /
  `modelerConnectionName` (design: `modelerCredentialTemplate`).
- **Instance fields** are still matched on `templateRef` / `version`
  (design: metadata bag with `kind`, `schemaRef`, `schemaVersion`, `displayName`
  and a separate `value` payload). A `kind: "CREDENTIAL"` discriminator is added
  to each mock instance to anticipate the design, but matching / version-floor
  still use `templateRef` / `version`.
- **Library-internal chooser strings** ("Select connection", "Available
  connections", "Create connection") are not translated.
- **Conditions** use the interim `equals: ""` workaround. The design's `isEmpty`
  and `configuresCredential` conditions require new condition types in the
  library and are not yet available.
- **Design-time presence validation** is simulated by the modal's
  loaded / not-loaded state and the chooser's empty / "needs upgrade" states.
  Run-time correctness (the design's Test tab) is out of scope.