import { useState } from 'react';

import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@camunda/design-system';

import { Lock } from 'lucide-react';

import { CONFIGURATION_TEMPLATES } from '../sample-credentials';

import { toUpperSnakeCase } from './util';
import { SecretField } from './SecretField';

const HINT_STYLE = { fontSize: 11, color: '#888' };
const SECTION_HINT_STYLE = { fontSize: 11, color: '#666', margin: '4px 0 8px' };

/**
 * Renders the credential-template property inputs shared by the create and edit
 * forms. Secret properties get the dedicated reference picker.
 */
function PropertyFields({ properties, values, setValue, showManageSecrets = true }) {
  return properties.map(p => (
    <div className="ci-form-row" key={p.key}>
      <Label className="ci-form-label">
        {p.label}{p.required ? ' *' : ''}
        {p.secret && <Lock size={12} aria-label="secret" style={{ verticalAlign: 'text-bottom' }} />}
      </Label>
      {p.secret ? (
        <SecretField
          propKey={p.key}
          value={values[p.key] || ''}
          onChange={(v) => setValue(p.key, v)}
          showManageSecrets={showManageSecrets}
        />
      ) : (
        <Input
          type="text"
          data-prop={p.key}
          placeholder={p.key}
          value={values[p.key] || ''}
          onChange={(e) => setValue(p.key, e.target.value)}
        />
      )}
    </div>
  ));
}

function collectStoredValue(properties, values) {
  const storedValue = {};
  properties.forEach(p => {
    const v = values[p.key];
    if (v != null && v.trim() !== '') {
      storedValue[p.key] = v;
    }
  });
  return storedValue;
}

/**
 * Credential creation form. `onSubmit` receives a summary of the created
 * credential (used by the chooser flow to auto-apply it to the element).
 */
export function CreateForm({ credentialInstances, onSubmit, onCancel, templateId, showManageSecrets = true }) {
  const initialTemplate =
    (templateId && CONFIGURATION_TEMPLATES.find(t => t.id === templateId)) ||
    CONFIGURATION_TEMPLATES[0];

  const [ selectedTemplateId, setSelectedTemplateId ] = useState(initialTemplate.id);
  const template = CONFIGURATION_TEMPLATES.find(t => t.id === selectedTemplateId);

  const [ displayName, setDisplayName ] = useState('');
  const [ name, setName ] = useState('');
  const [ nameManuallyEdited, setNameManuallyEdited ] = useState(false);
  const [ overrideVersion, setOverrideVersion ] = useState(false);
  const [ version, setVersion ] = useState(template.version);
  const [ values, setValues ] = useState({});
  const [ error, setError ] = useState('');

  const setValue = (key, v) => setValues(prev => ({ ...prev, [key]: v }));

  const handleTemplateChange = (nextId) => {
    const next = CONFIGURATION_TEMPLATES.find(t => t.id === nextId);
    setSelectedTemplateId(next.id);
    setValues({});
    setVersion(next.version);
    setOverrideVersion(false);
  };

  const handleDisplayNameChange = (e) => {
    const v = e.target.value;
    setDisplayName(v);
    if (!nameManuallyEdited || name.trim() === '') {
      setName(toUpperSnakeCase(v));
      setNameManuallyEdited(false);
    }
  };

  const handleNameChange = (e) => {
    const v = e.target.value;
    setName(v);
    setNameManuallyEdited(v.trim() !== '');
  };

  const effectiveVersion = overrideVersion ? version : template.version;

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedDisplay = displayName.trim();

    setError('');

    if (!trimmedName) {
      setError('Credential ID is required.');
      return;
    }
    if (!/^[A-Z][A-Z0-9_]*$/.test(trimmedName)) {
      setError('Must be UPPER_SNAKE_CASE (e.g. SLACK_PRODUCTION).');
      return;
    }

    const existing = credentialInstances.getAll();
    if (existing.some(inst => inst.name === trimmedName)) {
      setError('A credential with this ID already exists. Choose a different ID.');
      return;
    }

    const resolvedVersion = parseInt(effectiveVersion, 10) || 1;

    credentialInstances.setInstances([
      ...existing,
      {
        name: trimmedName,
        displayName: trimmedDisplay || trimmedName,
        kind: 'CREDENTIAL',
        configurationTemplate: template.id,
        configurationTemplateVersion: resolvedVersion,
        storedValue: collectStoredValue(template.properties, values),
        icon: template.icon
      }
    ]);

    onSubmit({
      name: trimmedName,
      displayName: trimmedDisplay || trimmedName,
      configurationTemplate: template.id,
      configurationTemplateVersion: resolvedVersion
    });
  };

  return (
    <div className="ci-form">
      <h5>Create new credential</h5>
      <div className="ci-form-row">
        <Label>Credential template</Label>
        <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
          <SelectTrigger data-field="template">
            <SelectValue placeholder="Choose a template…" />
          </SelectTrigger>
          <SelectContent>
            {CONFIGURATION_TEMPLATES.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="ci-form-row">
        <Label>Display name</Label>
        <Input
          type="text"
          data-field="displayName"
          placeholder="e.g. My Slack Workspace"
          value={displayName}
          onChange={handleDisplayNameChange}
        />
      </div>
      <div className="ci-form-row">
        <Label>Credential ID <span style={HINT_STYLE}>(auto-suggested, immutable after creation)</span></Label>
        <Input
          type="text"
          data-field="name"
          placeholder="e.g. MY_SLACK_WORKSPACE"
          value={name}
          onChange={handleNameChange}
        />
        {error && <span className="ci-field-error" data-error="name">{error}</span>}
      </div>
      <div className="ci-form-row">
        <Label>Version (stamped from template)</Label>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'normal', fontSize: 11, color: '#888', marginBottom: 6 }}>
          <Checkbox
            data-field="overrideVersion"
            checked={overrideVersion}
            onCheckedChange={(checked) => setOverrideVersion(checked === true)}
          />
          Override version (demo only — outdated instances)
        </Label>
        <Input
          type="number"
          data-field="version"
          min="1"
          disabled={!overrideVersion}
          value={effectiveVersion}
          onChange={(e) => setVersion(e.target.value)}
        />
      </div>
      <hr />
      <p style={SECTION_HINT_STYLE}>
        Credential template properties (stored as cluster variable value)
      </p>
      <PropertyFields properties={template.properties} values={values} setValue={setValue} showManageSecrets={showManageSecrets} />
      <div className="ci-form-actions">
        <Button data-action="submit" onClick={handleSubmit}>Create credential</Button>
        <Button variant="outline" data-action="cancel" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

/**
 * Edit / upgrade form for an existing credential. `onSaved` is called after the
 * instance list is updated.
 */
export function EditForm({ credential, idx, credentialInstances, onSaved, onCancel, isUpgrade, showManageSecrets = true }) {
  const matchingTemplate = CONFIGURATION_TEMPLATES.find(t => t.id === credential.configurationTemplate);

  const [ displayName, setDisplayName ] = useState(credential.displayName || '');
  const [ values, setValues ] = useState(() => ({ ...(credential.storedValue || {}) }));

  const setValue = (key, v) => setValues(prev => ({ ...prev, [key]: v }));

  if (!matchingTemplate) {
    return <p className="ci-empty">No matching credential template found for editing.</p>;
  }

  const floor = matchingTemplate.version;
  const heading = isUpgrade
    ? `Upgrade "${credential.displayName || credential.name}" — v${credential.configurationTemplateVersion} → v${floor}`
    : `Edit "${credential.displayName || credential.name}"`;

  const handleSave = () => {
    const trimmedDisplay = displayName.trim();
    const newVersion = isUpgrade ? floor : credential.configurationTemplateVersion;

    const all = credentialInstances.getAll();
    const updated = [ ...all ];
    updated[idx] = {
      ...credential,
      displayName: trimmedDisplay || credential.displayName || credential.name,
      configurationTemplateVersion: newVersion,
      storedValue: collectStoredValue(matchingTemplate.properties, values)
    };

    credentialInstances.setInstances(updated);
    onSaved();
  };

  return (
    <div className="ci-form">
      <h5>{heading}</h5>
      {isUpgrade && (
        <p className="ci-upgrade-reason">
          This credential is based on template v{credential.configurationTemplateVersion}; this
          connector requires v{floor} or later. Fill in the new fields below.
        </p>
      )}
      <div className="ci-form-row">
        <Label>Credential ID <span style={HINT_STYLE}>(immutable)</span></Label>
        <Input type="text" value={credential.name} disabled />
      </div>
      <div className="ci-form-row">
        <Label>Display name</Label>
        <Input
          type="text"
          data-field="displayName"
          placeholder="e.g. Slack Production"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <hr />
      <p style={SECTION_HINT_STYLE}>
        Credential template properties{isUpgrade ? ' (existing values pre-filled; fill in any new fields)' : ''}
      </p>
      <PropertyFields properties={matchingTemplate.properties} values={values} setValue={setValue} showManageSecrets={showManageSecrets} />
      <div className="ci-form-actions">
        <Button data-action="save" onClick={handleSave}>
          {isUpgrade ? 'Upgrade credential' : 'Save changes'}
        </Button>
        <Button variant="outline" data-action="cancel" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
