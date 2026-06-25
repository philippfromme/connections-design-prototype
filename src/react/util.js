/**
 * Derive UPPER_SNAKE_CASE credential ID from a display name.
 * e.g. "My Slack workspace" → "MY_SLACK_WORKSPACE"
 */
export function toUpperSnakeCase(displayName) {
  return displayName
    .trim()
    .replace(/[^a-zA-Z0-9\s_]/g, '')
    .replace(/\s+/g, '_')
    .toUpperCase();
}
