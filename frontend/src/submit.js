// submit.js

import { useState, useCallback } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { PipelineResultModal } from './PipelineResultModal';
import { Send, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Strip the onFieldChange callback out before serializing — it's a
      // function reference the nodes carry for local interactivity and
      // isn't meaningful (or JSON-serializable) on the wire.
      const cleanNodes = nodes.map(({ data, ...rest }) => {
        const { onFieldChange, ...serializableData } = data || {};
        return { ...rest, data: serializableData };
      });

      const payload = JSON.stringify({ nodes: cleanNodes, edges });
      const formData = new FormData();
      formData.append('pipeline', payload);

      const response = await fetch(`${BACKEND_URL}/pipelines/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      const data = await response.json();
      setResult({
        numNodes: data.num_nodes,
        numEdges: data.num_edges,
        isDag: data.is_dag,
      });
    } catch (err) {
      setResult({
        error: 'Make sure the backend is running at ' + BACKEND_URL + ' and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [nodes, edges]);

  const handleLoadTest = useCallback(() => {
    // Clear all existing nodes
    useStore.setState({ nodes: [], edges: [] });

    const testNodes = [
      {
        id: 'input-1',
        type: 'customInput',
        position: { x: 150, y: 150 },
        data: { id: 'input-1', nodeType: 'customInput', onFieldChange: (nodeId, fieldName, fieldValue) => {
          useStore.getState().updateNodeField(nodeId, fieldName, fieldValue);
        }}
      },
      {
        id: 'text-1',
        type: 'text',
        position: { x: 450, y: 150 },
        data: { id: 'text-1', nodeType: 'text', text: 'Hello {{input_var}}', onFieldChange: (nodeId, fieldName, fieldValue) => {
          useStore.getState().updateNodeField(nodeId, fieldName, fieldValue);
        }}
      },
      {
        id: 'output-1',
        type: 'customOutput',
        position: { x: 750, y: 150 },
        data: { id: 'output-1', nodeType: 'customOutput', onFieldChange: (nodeId, fieldName, fieldValue) => {
          useStore.getState().updateNodeField(nodeId, fieldName, fieldValue);
        }}
      }
    ];

    useStore.setState({ nodes: testNodes });

    // Wait a brief tick then connect them
    setTimeout(() => {
      useStore.getState().onConnect({
        source: 'input-1',
        sourceHandle: 'input-1-value',
        target: 'text-1',
        targetHandle: 'text-1-input_var'
      });
      useStore.getState().onConnect({
        source: 'text-1',
        sourceHandle: 'text-1-output',
        target: 'output-1',
        targetHandle: 'output-1-value'
      });
    }, 50);
  }, []);

  return (
    <>
      <div className="vs-submit-bar">
        <div className="vs-submit-info">
          <span className="vs-submit-summary">
            {nodes.length} node{nodes.length === 1 ? '' : 's'} · {edges.length} edge{edges.length === 1 ? '' : 's'}
          </span>
          {!result && !isSubmitting && (
            <span className="vs-submit-hint">
              No analysis yet — submit to see pipeline results
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="vs-button vs-button--secondary"
            onClick={handleLoadTest}
            disabled={isSubmitting}
          >
            Load Test Pipeline
          </button>
          <button
            type="button"
            className="vs-button vs-button--primary"
            onClick={handleSubmit}
            disabled={isSubmitting || nodes.length === 0}
          >
            {isSubmitting ? (
              <Loader2 size={16} strokeWidth={2.25} className="vs-spin" />
            ) : (
              <Send size={16} strokeWidth={2.25} />
            )}
            {isSubmitting ? 'Submitting…' : 'Submit pipeline'}
          </button>
        </div>
      </div>
      <PipelineResultModal result={result} onClose={() => setResult(null)} />
    </>
  );
};
