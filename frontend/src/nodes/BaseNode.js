// BaseNode.js
//
// The shared shell every node in the pipeline renders through. A node is
// declared once as plain data (see nodeConfigs.js) — a title, a category
// color, a list of handles, and a list of fields — and BaseNode turns that
// declaration into a fully styled, interactive React Flow node.
//
// Why this exists: the four starter nodes (input/output/llm/text) each
// reimplemented the same box, the same label row, and near-identical
// handle/field markup. Adding a fifth node meant copy-pasting all of that
// and hoping you didn't drift from the others' styling. BaseNode collapses
// that duplication to a single config object per node, so new nodes are a
// few lines of data instead of a new component.

import { memo, useMemo, useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { X } from 'lucide-react';
import { renderField } from './fields/fieldRegistry';
import { useStore } from '../store';

/**
 * Spread a list of handles evenly along the left or right edge of a node.
 * Single-handle nodes stay centered; multi-handle nodes fan out so labels
 * don't collide.
 */
function layoutHandles(handles, fallbackHeight) {
  const count = handles.length;
  if (count === 0) return [];
  return handles.map((handle, i) => {
    const pct = ((i + 1) / (count + 1)) * 100;
    return { ...handle, topPercent: pct };
  });
}

export const BaseNode = memo(function BaseNode({
  id,
  data,
  selected,
  config,
}) {
  const {
    title,
    icon: Icon,
    category = 'logic',
    handles = [],
    fields = [],
    footer,
    minWidth = 220,
  } = config;

  // Local field state lives here, in one place, instead of one useState
  // per field per node file. Each node still gets its own values, keyed
  // by field name, and changes are mirrored up to the global store so
  // the rest of the app (submit, other nodes referencing this one) can
  // read current values.
  const initialValues = useMemo(() => {
    const values = {};
    fields.forEach((f) => {
      values[f.name] = data?.[f.name] ?? f.default ?? '';
    });
    return values;
  }, [fields, data]);

  const [values, setValues] = useState(initialValues);

  const handleFieldChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (data?.onFieldChange) {
        data.onFieldChange(id, name, value);
      }
    },
    [id, data]
  );

  const leftHandles = useMemo(
    () => layoutHandles(handles.filter((h) => h.position === 'left')),
    [handles]
  );
  const rightHandles = useMemo(
    () => layoutHandles(handles.filter((h) => h.position === 'right')),
    [handles]
  );

  const removeNode = useStore((s) => s.removeNode);
  const handleDelete = useCallback(
    (e) => { e.stopPropagation(); removeNode(id); },
    [id, removeNode]
  );

  const categoryVar = `var(--cat-${category})`;
  const categoryDimVar = `var(--cat-${category}-dim)`;

  return (
    <div
      className={`vs-node${selected ? ' vs-node--selected' : ''}`}
      style={{
        minWidth,
        '--node-accent': categoryVar,
        '--node-accent-dim': categoryDimVar,
      }}
    >
      {leftHandles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={Position.Left}
          id={`${id}-${h.id}`}
          className="vs-handle"
          style={{ top: `${h.topPercent}%` }}
        >
          {h.label && <span className="vs-handle-label vs-handle-label--left">{h.label}</span>}
        </Handle>
      ))}

      <div className="vs-node-header">
        <span className="vs-node-icon" aria-hidden="true">
          {Icon ? <Icon size={14} strokeWidth={2.25} /> : null}
        </span>
        <span className="vs-node-title">{title}</span>
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

      {fields.length > 0 && (
        <div className="vs-node-body">
          {fields.map((field) =>
            renderField({
              field,
              value: values[field.name],
              allValues: values,
              nodeId: id,
              onChange: (val) => handleFieldChange(field.name, val),
            })
          )}
        </div>
      )}

      {footer && <div className="vs-node-footer">{footer(values)}</div>}

      {rightHandles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={Position.Right}
          id={`${id}-${h.id}`}
          className="vs-handle"
          style={{ top: `${h.topPercent}%` }}
        >
          {h.label && <span className="vs-handle-label vs-handle-label--right">{h.label}</span>}
        </Handle>
      ))}
    </div>
  );
});
