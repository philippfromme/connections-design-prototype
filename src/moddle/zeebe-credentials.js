import ZeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';

/**
 * Extended zeebe moddle descriptor that adds configuration-related attributes
 * to `zeebe:Input` and `zeebe:Property`.
 *
 * In production this would live in `zeebe-bpmn-moddle` upstream.
 * For the prototype we merge the additional type into the descriptor.
 *
 * Matches the cached attributes written by the upstream
 * `bpmn-js-element-templates` connections-design branch: singular
 * `modelerConfigurationTemplate` / `modelerConfigurationName`, with NO version
 * attribute on the BPMN element (per the design spec).
 */
export default {
  ...ZeebeModdle,
  types: [
    ...ZeebeModdle.types,
    {
      name: 'ConfigurationSupported',
      isAbstract: true,
      extends: [ 'zeebe:Input', 'zeebe:Property' ],
      properties: [
        {
          name: 'modelerConfigurationTemplate',
          isAttr: true,
          type: 'String'
        },
        {
          name: 'modelerConfigurationName',
          isAttr: true,
          type: 'String'
        }
      ]
    }
  ]
};
