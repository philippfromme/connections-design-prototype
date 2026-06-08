import ZeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';

/**
 * Extended zeebe moddle descriptor that adds credential-related attributes
 * to `zeebe:Input` and `zeebe:Property`.
 *
 * In production this would live in `zeebe-bpmn-moddle` upstream.
 * For the prototype we merge the additional type into the descriptor.
 *
 * NOTE: the attribute names (`modelerConnectionTemplate`, `modelerConnectionName`)
 * are intentionally kept as-is. They are written by the upstream
 * `bpmn-js-element-templates` `connections-design` branch, which has not been
 * renamed to credentials yet. Renaming them here would break the chooser's
 * metadata stamping. Rename upstream first, then align this descriptor.
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
          name: 'modelerConnectionTemplate',
          isAttr: true,
          type: 'String'
        },
        {
          name: 'modelerConnectionName',
          isAttr: true,
          type: 'String'
        }
      ]
    }
  ]
};
