# TODO — Align prototype with current "Credentials" design

Prototype implements the older **Connections** model. The design moved to the
**Credentials** model in commit `15abfce` (rename) plus later refinements
(metadata bag, `schemaVersion` floor, `type: "Credential"`, new conditions).
This plan brings the prototype back in sync.

Design sources (in `connections-design` workspace):
- `design/CREDENTIALS.md`
- `design/CREDENTIALS_ELEMENT_TEMPLATE.md`
- `design/CREDENTIAL_RUN_TIME_BINDING.md`
- `design/CREDENTIAL_VERSIONING.md`

---

## 1. Terminology rename: Connection → Credential

Rename across the whole codebase (identifiers, classes, files, UI strings).

- [ ] `src/connections-ui.js` → `src/credentials-ui.js`
  - `mountConnectionsUI` → `mountCredentialsUI`
  - `connectionInstances` service → `credentialInstances`
  - Modal title/labels: "Connection Instances" → "Credential Instances", etc.
  - CSS prefixes `ci-` (connection instance) can stay or → keep consistent
- [ ] `src/sample-connections.js` → `src/sample-credentials.js`
  - `SAMPLE_CONNECTIONS` → `SAMPLE_CREDENTIALS`
  - `CONNECTION_TEMPLATES` → `CREDENTIAL_SCHEMAS`
- [ ] `src/moddle/zeebe-connections.js` → `src/moddle/zeebe-credentials.js`
- [ ] `src/app.js` — update imports and `mountConnectionsUI` call
- [ ] `resources/slack-connector.json` — rename group/property labels
- [ ] `README.md` — replace "connection" wording with "credential"
- [ ] `package.json` `name` field if it references connections

## 2. Element template schema changes

Target shape per `CREDENTIALS_ELEMENT_TEMPLATE.md`.

- [ ] Property type `"String"` → `"Credential"` for the credential chooser
- [ ] Replace `templateRef` / `templateVersion` → `schemaRef`
      (e.g. `"schemaRef": "io.camunda:slack-credential:1"`)
- [ ] Rename embed key `configurationTemplates` → `credentialSchemas`
- [ ] Update schema ids `io.camunda:slack-connection:1` → `io.camunda:slack-credential:1`
- [ ] Keep binding `zeebe:input` (outbound) — value stays `=camunda.vars.env.<name>`

## 3. Moddle extension changes

Per `CREDENTIALS_ELEMENT_TEMPLATE.md` (full approach attribute).

- [ ] Rename cached attrs:
  - `modelerConnectionTemplate` → `modelerCredentialTemplate`
  - `modelerConnectionName` → keep as cache (`modelerCredentialName`) or drop
- [ ] Update abstract type name `ConnectionTemplateSupported` → `CredentialSupported`

## 4. Data model: metadata bag + schemaVersion

Per `CREDENTIAL_RUN_TIME_BINDING.md` (engine representation) and
`CREDENTIAL_VERSIONING.md` (floor semantics).

- [ ] Replace flat mock fields with envelope + value split:
  - envelope: `name` (native), `metadata: { kind, schemaRef, schemaVersion, displayName }`
  - value: schema-defined fields only (e.g. `slackOauthToken`)
- [ ] Add `kind: "CREDENTIAL"` discriminator to every instance
- [ ] Rename `version` / `templateVersion` → `schemaVersion`
- [ ] Drive chooser filtering by `schemaRef` + `schemaVersion >= floor` ($gte)
- [ ] Decide fate of demo-only fields (`authType`, `status`) — keep as UI-only
      preview or move under value; document as non-design demo extras

## 5. New `type: "Credential"` property component (chooser)

Currently faked as a plain `String` chooser. Design requires a dedicated type.

- [ ] If using the `connections-design` feature branch of
      `bpmn-js-element-templates`, confirm it already renders `type: "Credential"`;
      otherwise keep the `String` fake but document the gap
- [ ] Chooser reads envelope fields only (`displayName`, `name`, `schemaRef`,
      `schemaVersion`) — never the full value
- [ ] Selection writes `=camunda.vars.env.<name>` to the binding

## 6. Conditions: isEmpty + configuresCredential

Per `CREDENTIALS_ELEMENT_TEMPLATE.md` (conditional rendering).

- [ ] Add fallback inline credential fields shown when no credential chosen
  - interim: `{ "property": "<id>", "equals": "" }`
  - target: `{ "property": "<id>", "isEmpty": true }` (needs condition impl)
- [ ] Add `configuresCredential` type-based show/hide example
      (e.g. `"io.camunda:aws-credential:1@^3"`)

## 7. Multiple credentials per element (optional, demo)

Per `CREDENTIALS_ELEMENT_TEMPLATE.md` (multiple credentials).

- [ ] Add a second `Credential` property with its own `schemaRef` + binding
      to demonstrate author-controlled placement (e.g. LLM + IDP scenario)

## 8. Design-time presence validation (optional, demo)

Per `CREDENTIALS_ELEMENT_TEMPLATE.md` (design-time validation).

- [ ] Simulate "compatible credential exists in cluster" presence indicator
- [ ] Keep correctness (Test tab) explicitly out of scope — note it

## 9. Docs + cleanup

- [ ] Update `README.md` "How it works" + "Project layout" tables to new names
- [ ] Update inline code comments referencing connections
- [ ] Verify `npm run dev` still boots and chooser works end to end
- [ ] Inspect XML output — confirm single FEEL ref + renamed cached attrs

---

## Out of scope (design, not prototype-relevant)

- Metadata-bag Elasticsearch `nested` index mapping (server concern)
- REST API endpoints (`POST /v2/cluster-variables/search`) — mocked by modal
- Hub storage + cross-cluster sync model
- Secret resolution at SDK ↔ gateway boundary
