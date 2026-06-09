import ZeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';

/**
 * Extended zeebe moddle descriptor that adds credential-related attributes
 * to `zeebe:Input` and `zeebe:Property`.
 *
 * In production this would live in `zeebe-bpmn-moddle` upstream.
 * For the prototype we merge the additional type into the descriptor.
 *
 * The attribute names (`modelerCredentialsTemplate`, `modelerCredentialsName`,
 * `modelerCredentialsVersion`) mirror the upstream `bpmn-js-element-templates`
 * descriptor that writes them during metadata stamping.
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
