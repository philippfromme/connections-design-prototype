import { useState } from 'react';

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@camunda/design-system';

import {
  SECRET_PREFIX,
  listSecretNames,
  secretExists,
  openManageSecrets,
  useStoreVersion
} from './store';

/**
 * Controlled secret-reference picker for a `secret: true` property.
 *
 * The control holds a *reference* (`camunda.secrets.NAME`), never the secret
 * value. The parent form owns the value; this component renders the select /
 * manual-entry UI and a live, non-revealing existence hint. Secret *management*
 * lives in the dedicated Secrets modal, reached via "Manage secrets…".
 */
export function SecretField({ propKey, value, onChange, showManageSecrets = true }) {
  // re-render when secrets are added elsewhere (Secrets modal)
  useStoreVersion();

  const isRef = value.startsWith(SECRET_PREFIX);
  const refName = isRef ? value.slice(SECRET_PREFIX.length) : '';

  const [ manual, setManual ] = useState(value !== '' && !isRef);

  const names = listSecretNames();
  const known = refName && names.includes(refName);

  const handleSelect = (v) => {
    if (v === '__manual__') {
      setManual(true);
      onChange(isRef ? '' : value);
    } else {
      setManual(false);
      onChange(v ? SECRET_PREFIX + v : '');
    }
  };

  const selectValue = manual ? '__manual__' : refName;

  return (
    <div className="ci-secret-field" data-secret-field={propKey}>
      <div className="ci-secret-row">
        <Select value={selectValue || undefined} onValueChange={handleSelect}>
          <SelectTrigger className="ci-secret-select">
            <SelectValue placeholder="Choose a secret…" />
          </SelectTrigger>
          <SelectContent>
            {names.map(n => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
            {refName && !known && (
              <SelectItem value={refName}>{refName} (not in store)</SelectItem>
            )}
            <SelectItem value="__manual__">Enter reference manually…</SelectItem>
          </SelectContent>
        </Select>
        {showManageSecrets && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ci-secret-btn"
            onClick={() => openManageSecrets()}
          >
            Manage secrets…
          </Button>
        )}
      </div>
      {manual && (
        <div className="ci-secret-manual">
          <Input
            type="text"
            className="ci-secret-input"
            placeholder={`${SECRET_PREFIX}MY_SECRET`}
            value={value}
            onChange={(e) => onChange(e.target.value.trim())}
          />
        </div>
      )}
      <SecretIndicator value={value} />
    </div>
  );
}

function SecretIndicator({ value }) {
  if (value.startsWith(SECRET_PREFIX)) {
    const name = value.slice(SECRET_PREFIX.length);
    if (secretExists(name)) {
      return <span className="ci-field-ok">✓ Secret "{name}" exists on this cluster.</span>;
    }
    return (
      <span className="ci-field-warning">
        ⚠ Secret "{name}" was not found on this cluster. Add it before deploying (GAP-003).
      </span>
    );
  }

  if (value) {
    return (
      <span className="ci-field-warning">
        ⚠ Inline value — not a secret reference. Prefer {SECRET_PREFIX}&lt;NAME&gt;.
      </span>
    );
  }

  return <span className="ci-field-warning" />;
}
