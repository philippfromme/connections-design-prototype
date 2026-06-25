export const SLACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI3IiBoZWlnaHQ9IjEyNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMjcuMiA4MGMwIDcuMy01LjkgMTMuMi0xMy4yIDEzLjJDNi43IDkzLjIuOCA4Ny4zLjggODBjMC03LjMgNS45LTEzLjIgMTMuMi0xMy4yaDEzLjJWODB6bTYuNiAwYzAtNy4zIDUuOS0xMy4yIDEzLjItMTMuMiA3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjJ2MzNjMCA3LjMtNS45IDEzLjItMTMuMiAxMy4yLTcuMyAwLTEzLjItNS45LTEzLjItMTMuMlY4MHoiIGZpbGw9IiNFMDFFNUEiLz4KICA8cGF0aCBkPSJNNDcgMjdjLTcuMyAwLTEzLjItNS45LTEzLjItMTMuMkMzMy44IDYuNSAzOS43LjYgNDcgLjZjNy4zIDAgMTMuMiA1LjkgMTMuMiAxMy4yVjI3SDQ3em0wIDYuN2M3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjIgMCA3LjMtNS45IDEzLjItMTMuMiAxMy4ySDEzLjlDNi42IDYwLjEuNyA1NC4yLjcgNDYuOWMwLTcuMyA1LjktMTMuMiAxMy4yLTEzLjJINDd6IiBmaWxsPSIjMzZDNUYwIi8+CiAgPHBhdGggZD0iTTk5LjkgNDYuOWMwLTcuMyA1LjktMTMuMiAxMy4yLTEzLjIgNy4zIDAgMTMuMiA1LjkgMTMuMiAxMy4yIDAgNy4zLTUuOSAxMy4yLTEzLjIgMTMuMkg5OS45VjQ2Ljl6bS02LjYgMGMwIDcuMy01LjkgMTMuMi0xMy4yIDEzLjItNy4zIDAtMTMuMi01LjktMTMuMi0xMy4yVjEzLjhDNjYuOSA2LjUgNzIuOC42IDgwLjEuNmM3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjJ2MzMuMXoiIGZpbGw9IiMyRUI2N0QiLz4KICA8cGF0aCBkPSJNODAuMSA5OS44YzcuMyAwIDEzLjIgNS45IDEzLjIgMTMuMiAwIDcuMy01LjkgMTMuMi0xMy4yIDEzLjItNy4zIDAtMTMuMi01LjktMTMuMi0xMy4yVjk5LjhoMTMuMnptMC02LjZjLTcuMyAwLTEzLjItNS45LTEzLjItMTMuMiAwLTcuMyA1LjktMTMuMiAxMy4yLTEzLjJoMzMuMWM3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjIgMCA3LjMtNS45IDEzLjItMTMuMiAxMy4ySDgwLjF6IiBmaWxsPSIjRUNCMjJFIi8+Cjwvc3ZnPgo=';

/**
 * Mock credential instances, as the cluster-variable search API would return them.
 * Each instance maps to one cluster variable holding a JSON configuration object.
 *
 * Data model per design spec (metadata bag):
 *   kind, configurationTemplate, configurationTemplateVersion, displayName
 */
export const SAMPLE_CREDENTIALS = [
  {
    name: 'SLACK_PRODUCTION',
    displayName: 'Slack Production',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:slack-credential:1',
    configurationTemplateVersion: 3,
    storedValue: {
      slackOauthToken: 'camunda.secrets.SLACK_TOKEN_PROD'
    },
    icon: SLACK_ICON
  },
  {
    name: 'SLACK_DEVELOPMENT',
    displayName: 'Slack Development',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:slack-credential:1',
    configurationTemplateVersion: 2,
    storedValue: {
      slackOauthToken: 'camunda.secrets.SLACK_TOKEN_DEV'
    },
    icon: SLACK_ICON
  },
  {
    name: 'SLACK_LEGACY',
    displayName: 'Slack Legacy (v1)',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:slack-credential:1',
    configurationTemplateVersion: 1,
    storedValue: {
      slackOauthToken: 'xoxb-legacy-plain-token'
    },
    icon: SLACK_ICON
  },
  {
    name: 'SLACK_STAGING',
    displayName: 'Slack Staging',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:slack-credential:1',
    configurationTemplateVersion: 2,
    storedValue: {
      slackOauthToken: 'camunda.secrets.SLACK_TOKEN_STAGING'
    },
    icon: SLACK_ICON
  },
  {
    name: 'AWS_MAIN_ACCOUNT',
    displayName: 'AWS Main Account',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:aws-credential:1',
    configurationTemplateVersion: 1
  },
  {
    name: 'GCP_PROJECT_ALPHA',
    displayName: 'GCP Project Alpha',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:gcp-credential:1',
    configurationTemplateVersion: 1
  },
  {
    name: 'SENDGRID_MARKETING',
    displayName: 'SendGrid Marketing',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:sendgrid-credential:1',
    configurationTemplateVersion: 2
  },
  {
    name: 'CORPORATE_PROXY',
    displayName: 'Corporate HTTP Proxy',
    kind: 'CREDENTIAL',
    configurationTemplate: 'io.camunda:proxy-credential:1',
    configurationTemplateVersion: 1,
    storedValue: {
      proxyUrl: 'https://proxy.acme.internal:8080'
    }
  }
];

/**
 * Names of secrets known to the connected cluster's secret store.
 * Modelled as names only — the store is non-revealing (values are never read
 * back). Seeds the `camunda.secrets.*` references used by the sample credentials.
 */
export const INITIAL_SECRETS = [
  'SLACK_TOKEN_PROD',
  'SLACK_TOKEN_DEV',
  'SLACK_TOKEN_STAGING'
];

/**
 * Known configuration templates (embedded in element templates, used to render editor forms).
 * In production these come from the element template's `configurationTemplates` array.
 *
 * Each template carries a `kind` (the domain class it produces — `CREDENTIAL` here);
 * "configuration" is the generic mechanism, "credential" is the domain concept.
 */
export const CONFIGURATION_TEMPLATES = [
  {
    id: 'io.camunda:slack-credential:1',
    name: 'Slack Credential',
    kind: 'CREDENTIAL',
    version: 2,
    icon: SLACK_ICON,
    properties: [
      { key: 'slackOauthToken', label: 'Slack API Token', type: 'String', secret: true, required: true }
    ]
  },
  {
    id: 'io.camunda:proxy-credential:1',
    name: 'HTTP Proxy Credential',
    kind: 'CREDENTIAL',
    version: 1,
    properties: [
      { key: 'proxyUrl', label: 'Proxy URL', type: 'String', required: true }
    ]
  }
];
