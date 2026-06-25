import ZeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';

/**
 * Extended zeebe moddle descriptor that adds credential-related attributes
 * to `zeebe:Input` and `zeebe:Property`.
 *
 * In production this would live in `zeebe-bpmn-moddle` upstream.
 * For the prototype we merge the additional type into the descriptor.
 *
 * NOTE: The upstream `bpmn-js-element-templates` connections-design branch still
 * writes `modelerCredentialsTemplate` / `modelerCredentialsName` (plural "Credentials").
 * The design spec targets singular: `modelerCredentialTemplate`, `modelerCredentialName`
 * with NO version attribute on BPMN. This moddle must match what upstream writes TODAY
 * to keep the prototype functional. Update once upstream renames.
 */
export default {
  ...ZeebeModdle,
  types: [
    ...ZeebeModdle.types,
    {
      name: 'CredentialSupported',
      isAbstract: true,
      extends: [ 'zeebe:Input', 'zeebe:Property' ],
      properties: [
        {
          name: 'modelerCredentialsTemplate',
          isAttr: true,
          type: 'String'
        },
        {
          name: 'modelerCredentialsName',
          isAttr: true,
          type: 'String'
        },
        {
          name: 'modelerCredentialsVersion',
          isAttr: true,
          type: 'Integer'
        }
      ]
    }
  ]
};
