// NumberField.js
import { Field } from './Field';

export function NumberField({ field, value, onChange }) {
  return (
    <Field label={field.label}>
      <input
        type="number"
        className="vs-input vs-input--number nodrag"
        value={value}
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
