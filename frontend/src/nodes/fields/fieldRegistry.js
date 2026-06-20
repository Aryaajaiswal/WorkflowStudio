// fieldRegistry.js
//
// Maps a field's declared `type` to the component that renders it. Node
// configs never import field components directly — they just write
// `{ type: 'select', ... }` and the registry resolves it. Adding a new
// field type (e.g. a file picker) means writing one component and adding
// one line here; every node can use it immediately.

import { TextField } from './TextField';
import { SelectField } from './SelectField';
import { TextAreaField } from './TextAreaField';
import { NumberField } from './NumberField';
import { SliderField } from './SliderField';
import { CheckboxField } from './CheckboxField';
import { NoteField } from './NoteField';

const REGISTRY = {
  text: TextField,
  select: SelectField,
  textarea: TextAreaField,
  number: NumberField,
  slider: SliderField,
  checkbox: CheckboxField,
  note: NoteField,
};

export function renderField({ field, value, allValues, nodeId, onChange }) {
  const Component = REGISTRY[field.type];
  if (!Component) {
    console.warn(`Unknown field type "${field.type}" on field "${field.name}"`);
    return null;
  }
  return (
    <Component
      key={field.name}
      field={field}
      value={value}
      allValues={allValues}
      nodeId={nodeId}
      onChange={onChange}
    />
  );
}
