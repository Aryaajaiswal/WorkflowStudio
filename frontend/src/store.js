// store.js

import { create } from "zustand";
import { persist } from 'zustand/middleware';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';
import { getLayoutedElements } from './layout';

export const useStore = create(
  persist(
    (set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    setNodes: (nodes) => set({ nodes }),
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, [fieldName]: fieldValue } };
          }

          return node;
        }),
      });
    },
    removeNode: (nodeId) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
      });
    },
    removeNodes: (nodeIds) => {
      const idSet = new Set(nodeIds);
      set({
        nodes: get().nodes.filter((node) => !idSet.has(node.id)),
        edges: get().edges.filter(
          (edge) => !idSet.has(edge.source) && !idSet.has(edge.target)
        ),
      });
    },
    autoLayout: () => {
      const { nodes, edges } = get();
      const layouted = getLayoutedElements(nodes, edges);
      set({ nodes: layouted });
    },
  }),
  { name: 'workflow-studio' }
));
