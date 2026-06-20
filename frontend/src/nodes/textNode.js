// textNode.js
//
// The one node that can't be purely config-driven: its handles are
// derived from its own content. Typing `{{ name }}` creates a target
// Handle called `name` on the left edge, live, as you type. It still
// borrows BaseNode's visual language (same classes, same handle dot
// styling, same header) so it reads as part of the same system rather
// than a one-off.

import { useState, useCallback, useRef, useLayoutEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { Type, X } from 'lucide-react';
import { extractVariables } from './extractVariables';
import { useStore } from '../store';

export const TextNode = ({ id, data, selected }) => {
  const removeNode = useStore((s) => s.removeNode);
  const handleDelete = useCallback(
    (e) => { e.stopPropagation(); removeNode(id); },
    [id, removeNode]
  );
  const [text, setText] = useState(data?.text ?? '{{input}}');
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(text), [text]);

  const handleTextChange = useCallback(
    (e) => {
      const value = e.target.value;
      setText(value);
      data?.onFieldChange?.(id, 'text', value);
    },
    [id, data]
  );

  // Auto-grow both dimensions: height from content, width from the
  // longest line, within sane bounds so a one-word node stays compact
  // and a paragraph doesn't run off the canvas.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const longestLine = useMemo(
    () => Math.max(8, ...text.split('\n').map((l) => l.length)),
    [text]
  );
  const widthCh = Math.min(48, Math.max(18, longestLine + 2));

  const handleTopPercents = useMemo(() => {
    const n = variables.length;
    if (n === 0) return [];
    return variables.map((_, i) => ((i + 1) / (n + 1)) * 100);
  }, [variables]);

  return (
    <div
      className={`vs-node${selected ? ' vs-node--selected' : ''}`}
      style={{
        width: `${widthCh}ch`,
        minWidth: 220,
        '--node-accent': 'var(--cat-text)',
        '--node-accent-dim': 'var(--cat-text-dim)',
      }}
    >
      {variables.map((varName, i) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          className="vs-handle vs-handle--variable"
          style={{ top: `${handleTopPercents[i]}%` }}
        >
          <span className="vs-handle-label vs-handle-label--left">{varName}</span>
        </Handle>
      ))}

      <div className="vs-node-header">
        <span className="vs-node-icon" aria-hidden="true">
          <Type size={14} strokeWidth={2.25} />
        </span>
        <span className="vs-node-title">Text</span>
        <span className="vs-node-id">{id}</span>
        <button
          className="vs-node-delete"
          onClick={handleDelete}
          title="Delete node"
          aria-label="Delete node"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>

      <div className="vs-node-body">
        <label className="vs-field vs-field--stacked">
          <span className="vs-field-label">Text</span>
          <textarea
            ref={textareaRef}
            className="vs-textarea nodrag"
            rows={1}
            value={text}
            onChange={handleTextChange}
            placeholder="Type text — use {{ variable }} to add an input"
          />
        </label>
        {variables.length > 0 && (
          <p className="vs-note vs-note--variables">
            {variables.length} variable{variables.length > 1 ? 's' : ''}: {variables.join(', ')}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="vs-handle"
      />
    </div>
  );
};
