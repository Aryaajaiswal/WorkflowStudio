// nodeTypes.js
//
// Single source of truth mapping a node's `type` key to (a) the component
// React Flow renders and (b) the palette entry shown in the toolbar. Both
// ui.js and toolbar.js read from here, so adding a node to the palette
// and registering it for the canvas can never drift out of sync.

import { InputNode } from './inputNode';
import { OutputNode } from './outputNode';
import { LLMNode } from './llmNode';
import { TextNode } from './textNode';
import { FilterNode } from './filterNode';
import { MergeNode } from './mergeNode';
import { DelayNode } from './delayNode';
import { CodeNode } from './codeNode';
import { ApiRequestNode } from './apiRequestNode';
import { nodeConfigs, textNodeConfig } from './nodeConfigs';

export const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  filter: FilterNode,
  merge: MergeNode,
  delay: DelayNode,
  code: CodeNode,
  apiRequest: ApiRequestNode,
};

// Drives the draggable palette in the toolbar — type, label, icon, and
// category color all sourced from the same configs the canvas nodes use.
export const paletteEntries = [
  { type: 'customInput', ...pick(nodeConfigs.customInput) },
  { type: 'llm', ...pick(nodeConfigs.llm) },
  { type: 'customOutput', ...pick(nodeConfigs.customOutput) },
  { type: 'text', ...pick(textNodeConfig) },
  { type: 'filter', ...pick(nodeConfigs.filter) },
  { type: 'merge', ...pick(nodeConfigs.merge) },
  { type: 'delay', ...pick(nodeConfigs.delay) },
  { type: 'code', ...pick(nodeConfigs.code) },
  { type: 'apiRequest', ...pick(nodeConfigs.apiRequest) },
];

function pick(config) {
  return { label: config.title, icon: config.icon, category: config.category };
}
