import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import '@bpmn-io/element-template-chooser/dist/element-template-chooser.css';
import 'bpmn-js-element-templates/dist/assets/element-templates.css';

import '@camunda/design-system/styles.css';

import './app.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule
} from 'bpmn-js-properties-panel';

import { CloudElementTemplatesPropertiesProviderModule } from 'bpmn-js-element-templates';

import ElementTemplateChooserModule from '@bpmn-io/element-template-chooser';
import ElementTemplatesIconsRenderer from '@bpmn-io/element-template-icon-renderer';

import ZeebeBehaviorsModule from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';

import {
  CreateAppendAnythingModule,
  CreateAppendElementTemplatesModule
} from 'bpmn-js-create-append-anything';

import ZeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';
import ModelerModdle from 'modeler-moddle/resources/modeler.json';

import diagramXML from '../resources/diagram.bpmn?raw';
import elementTemplates from '../resources/slack-connector.json';

import { mountCredentialsUI } from './credentials-ui';

const canvas = document.querySelector('#canvas');
const propertiesPanel = document.querySelector('#properties');

const modeler = new BpmnModeler({
  container: canvas,
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    ZeebePropertiesProviderModule,
    CloudElementTemplatesPropertiesProviderModule,
    ElementTemplateChooserModule,
    ElementTemplatesIconsRenderer,
    ZeebeBehaviorsModule,
    CreateAppendAnythingModule,
    CreateAppendElementTemplatesModule
  ],
  moddleExtensions: {
    zeebe: ZeebeModdle,
    modeler: ModelerModdle
  },
  propertiesPanel: {
    parent: propertiesPanel
  },
  elementTemplates
});

async function run() {
  try {
    await modeler.importXML(diagramXML);

    modeler.get('canvas').zoom('fit-viewport');
  } catch (err) {
    console.error('failed to import diagram', err);
  }

  mountCredentialsUI(modeler, canvas, elementTemplates);
}

modeler.on('elements.changed', async () => {
  try {
    const { xml } = await modeler.saveXML({ format: true });

    console.log(xml);
  } catch (err) {
    console.error('failed to save XML', err);
  }
});

run();

// expose for debugging
window.modeler = modeler;
