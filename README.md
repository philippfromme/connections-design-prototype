# Connections Design Prototype

Standalone, shareable prototype of the **connection chooser** for
[bpmn-js element templates](https://github.com/bpmn-io/bpmn-js-element-templates).

It boots a [bpmn-js](https://github.com/bpmn-io/bpmn-js) modeler with the
properties panel, loads a Slack outbound connector element template that embeds
a **connection template**, and lets you select connection instances on a service
task — simulating how the Hub would surface cluster-scoped connections.

## What you can do

- Apply the **Slack Outbound Connector** template to the task (via the template chooser).
- Use the **⚙ Connections** modal to simulate the Hub:
  - load sample connection instances, or start from an empty (disconnected) cluster,
  - create a connection from the connection template (Hub-rendered form),
  - create random Slack instances,
  - override the stamped version (demo only) to simulate outdated instances.
- Pick a connection in the properties panel. Incompatible (outdated) instances are
  shown as blocked with a `Requires vN+` hint.
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

- One connection = one cluster variable = one JSON object whose **shape** is defined
  by the connection template (`configurationTemplates` in the element template).
- The Modeler writes only a single FEEL reference (`=camunda.vars.env.<name>`) into
  the `zeebe:input`, plus cached `modelerConnectionTemplate` / `modelerConnectionName`
  attributes for offline display and filtering.
- The connector receives the full JSON object at runtime and destructures it.

See the design docs in the `connections-design` workspace for the full rationale.

## Project layout

| File | Purpose |
| --- | --- |
| `src/app.js` | Boots the modeler, registers modules, loads the template and diagram. |
| `src/connections-ui.js` | The demo "Connections" modal (Hub simulation) and XML viewer. |
| `src/sample-connections.js` | Mock connection instances and connection templates. |
| `src/moddle/zeebe-connections.js` | Zeebe moddle extension adding the cached connection attributes. |
| `resources/slack-connector.json` | Slack element template embedding the connection template. |
| `resources/diagram.bpmn` | Starting diagram with a single task. |