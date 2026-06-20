// createNodeComponent.js
//
// Turns a plain config object (see nodeConfigs.js) into a component that
// React Flow can register in its nodeTypes map. This is the one function
// that makes the abstraction pay off: every node — old or new — is
// `createNodeComponent(config)`, not a hand-written component.

import { BaseNode } from './BaseNode';

export function createNodeComponent(config) {
  function GeneratedNode({ id, data, selected }) {
    return <BaseNode id={id} data={data} selected={selected} config={config} />;
  }
  GeneratedNode.displayName = `Node(${config.title})`;
  return GeneratedNode;
}
