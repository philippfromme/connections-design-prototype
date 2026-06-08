export const SLACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI3IiBoZWlnaHQ9IjEyNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMjcuMiA4MGMwIDcuMy01LjkgMTMuMi0xMy4yIDEzLjJDNi43IDkzLjIuOCA4Ny4zLjggODBjMC03LjMgNS45LTEzLjIgMTMuMi0xMy4yaDEzLjJWODB6bTYuNiAwYzAtNy4zIDUuOS0xMy4yIDEzLjItMTMuMiA3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjJ2MzNjMCA3LjMtNS45IDEzLjItMTMuMiAxMy4yLTcuMyAwLTEzLjItNS45LTEzLjItMTMuMlY4MHoiIGZpbGw9IiNFMDFFNUEiLz4KICA8cGF0aCBkPSJNNDcgMjdjLTcuMyAwLTEzLjItNS45LTEzLjItMTMuMkMzMy44IDYuNSAzOS43LjYgNDcgLjZjNy4zIDAgMTMuMiA1LjkgMTMuMiAxMy4yVjI3SDQ3em0wIDYuN2M3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjIgMCA3LjMtNS45IDEzLjItMTMuMiAxMy4ySDEzLjlDNi42IDYwLjEuNyA1NC4yLjcgNDYuOWMwLTcuMyA1LjktMTMuMiAxMy4yLTEzLjJINDd6IiBmaWxsPSIjMzZDNUYwIi8+CiAgPHBhdGggZD0iTTk5LjkgNDYuOWMwLTcuMyA1LjktMTMuMiAxMy4yLTEzLjIgNy4zIDAgMTMuMiA1LjkgMTMuMiAxMy4yIDAgNy4zLTUuOSAxMy4yLTEzLjIgMTMuMkg5OS45VjQ2Ljl6bS02LjYgMGMwIDcuMy01LjkgMTMuMi0xMy4yIDEzLjItNy4zIDAtMTMuMi01LjktMTMuMi0xMy4yVjEzLjhDNjYuOSA2LjUgNzIuOC42IDgwLjEuNmM3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjJ2MzMuMXoiIGZpbGw9IiMyRUI2N0QiLz4KICA8cGF0aCBkPSJNODAuMSA5OS44YzcuMyAwIDEzLjIgNS45IDEzLjIgMTMuMiAwIDcuMy01LjkgMTMuMi0xMy4yIDEzLjItNy4zIDAtMTMuMi01LjktMTMuMi0xMy4yVjk5LjhoMTMuMnptMC02LjZjLTcuMyAwLTEzLjItNS45LTEzLjItMTMuMiAwLTcuMyA1LjktMTMuMiAxMy4yLTEzLjJoMzMuMWM3LjMgMCAxMy4yIDUuOSAxMy4yIDEzLjIgMCA3LjMtNS45IDEzLjItMTMuMiAxMy4ySDgwLjF6IiBmaWxsPSIjRUNCMjJFIi8+Cjwvc3ZnPgo=';

/**
 * Mock credential instances, as the Hub would return them for a cluster.
 * Each instance maps to one cluster variable holding a JSON configuration object.
 */
export const SAMPLE_CREDENTIALS = [
  {
    name: 'slackProduction',
    displayName: 'Slack Production',
    templateRef: 'io.camunda:slack-connection:1',
    version: 3,
    type: 'Slack',
    authType: 'Bearer token',
    status: 'active',
    icon: SLACK_ICON
  },
  {
    name: 'slackDevelopment',
    displayName: 'Slack Development',
    templateRef: 'io.camunda:slack-connection:1',
    version: 2,
    type: 'Slack',
    authType: 'Bearer token',
    status: 'inactive',
    icon: SLACK_ICON
  },
  {
    name: 'slackLegacy',
    displayName: 'Slack Legacy (v1)',
    templateRef: 'io.camunda:slack-connection:1',
    version: 1,
    type: 'Slack',
    authType: 'Bot token',
    status: 'active',
    icon: SLACK_ICON
  },
  {
    name: 'slackStaging',
    displayName: 'Slack Staging',
    templateRef: 'io.camunda:slack-connection:1',
    version: 2,
    type: 'Slack',
    authType: 'OAuth2',
    status: 'active',
    icon: SLACK_ICON
  },
  {
    name: 'awsMainAccount',
    displayName: 'AWS Main Account',
    templateRef: 'io.camunda:aws-connection:1',
    version: 1,
    type: 'AWS',
    authType: 'Access Key',
    status: 'active'
  },
  {
    name: 'gcpProjectAlpha',
    displayName: 'GCP Project Alpha',
    templateRef: 'io.camunda:gcp-connection:1',
    version: 1,
    type: 'GCP',
    authType: 'Service Account',
    status: 'active'
  },
  {
    name: 'sendgridMarketing',
    displayName: 'SendGrid Marketing',
    templateRef: 'io.camunda:sendgrid-connection:1',
    version: 2,
    type: 'SendGrid',
    authType: 'API key',
    status: 'inactive'
  }
];

/**
 * Known credential schemas (the shapes Hub would render as editor forms).
 */
export const CREDENTIAL_SCHEMAS = [
  {
    id: 'io.camunda:slack-connection:1',
    name: 'Slack Connection',
    version: 2,
    icon: SLACK_ICON,
    properties: [
      { key: 'slackOauthToken', label: 'Slack API Token', type: 'String', required: true }
    ]
  }
];
