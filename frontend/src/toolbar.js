// toolbar.js

import { DraggableNode } from './draggableNode';
import { paletteEntries } from './nodes/nodeTypes';
import { Workflow } from 'lucide-react';

export const PipelineToolbar = () => {
  return (
    <header className="vs-toolbar">
      <div className="vs-toolbar-brand">
        <span className="vs-toolbar-brand-icon">
          <Workflow size={18} strokeWidth={2.25} />
        </span>
        <div className="vs-toolbar-brand-text">
          <span className="vs-toolbar-title">WorkflowStudio</span>
          <span className="vs-toolbar-subtitle">Drag a block onto the board to wire it in</span>
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
    </header>
  );
};
