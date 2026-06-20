// llmNode.js
import { createNodeComponent } from './createNodeComponent';
import { nodeConfigs } from './nodeConfigs';

export const LLMNode = createNodeComponent(nodeConfigs.llm);
