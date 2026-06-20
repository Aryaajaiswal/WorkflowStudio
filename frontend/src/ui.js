// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeTypes } from './nodes/nodeTypes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  updateNodeField: state.updateNodeField,
  removeNodes: state.removeNodes,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      updateNodeField,
      removeNodes,
    } = useStore(selector, shallow);

    const onNodesDelete = useCallback(
      (deletedNodes) => removeNodes(deletedNodes.map((n) => n.id)),
      [removeNodes]
    );

    const getInitNodeData = useCallback(
      (nodeID, type) => ({ id: nodeID, nodeType: `${type}`, onFieldChange: updateNodeField }),
      [updateNodeField]
    );

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode, getInitNodeData]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Ensure all nodes are selectable for keyboard deletion
    const selectableNodes = nodes.map((n) => ({ ...n, selectable: true }));

    return (
        <div className="vs-board" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={selectableNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                defaultEdgeOptions={{ className: 'vs-edge' }}
                onNodesDelete={onNodesDelete}
                deleteKeyCode={["Backspace", "Delete"]}
                fitView
            >
                <Background color="var(--board-grid-dot)" gap={gridSize} size={2} />
                <MiniMap
                  className="vs-minimap"
                  maskColor="rgba(14, 17, 23, 0.75)"
                  nodeColor="#2a3245"
                  nodeStrokeWidth={0}
                  pannable
                  zoomable
                />
            </ReactFlow>
        </div>
    )
}
