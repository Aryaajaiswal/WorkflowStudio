import { DraggableNode } from './draggableNode';
import { paletteEntries } from './nodes/nodeTypes';
import { Workflow, Layout, Keyboard } from 'lucide-react';
import { useStore } from './store';

export const PipelineToolbar = ({ onAutoLayout, onToggleShortcuts }) => {
  const nodes = useStore((s) => s.nodes);

  return (
    <header className="vs-toolbar">
      <div className="vs-toolbar-brand">
        <span className="vs-toolbar-brand-icon">
          <Workflow size={18} strokeWidth={2.25} />
        </span>
        <div className="vs-toolbar-brand-text">
          <span className="vs-toolbar-title">WorkflowStudio</span>
          <span className="vs-toolbar-subtitle">visual pipeline builder</span>
        </div>
      </div>
      <div className="vs-toolbar-palette">
        {paletteEntries.map((entry) => (
          <DraggableNode
            key={entry.type}
            type={entry.type}
            label={entry.label}
            icon={entry.icon}
            category={entry.category}
          />
        ))}
      </div>
      <div className="vs-toolbar-actions">
        <button
          className="vs-toolbar-btn"
          onClick={onAutoLayout}
          disabled={nodes.length < 2}
          title="Auto-layout nodes"
        >
          <Layout size={14} strokeWidth={2.25} />
          Layout
        </button>
        <button
          className="vs-toolbar-btn vs-toolbar-btn--icon"
          onClick={onToggleShortcuts}
          title="Keyboard shortcuts"
        >
          <Keyboard size={14} strokeWidth={2.25} />
        </button>
      </div>
    </header>
  );
};
