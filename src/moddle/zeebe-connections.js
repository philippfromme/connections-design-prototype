import ZeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';

/**
 * Extended zeebe moddle descriptor that adds connection-related attributes
 * to `zeebe:Input` and `zeebe:Property`.
 *
 * In production this would live in `zeebe-bpmn-moddle` upstream.
 * For the prototype we merge the additional type into the descriptor.
 */
export default {
  ...ZeebeModdle,
  types: [
    ...ZeebeModdle.types,
    {
      name: 'ConnectionTemplateSupported',
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
