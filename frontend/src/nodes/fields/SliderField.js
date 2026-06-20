// SliderField.js
import { Field } from './Field';

export function SliderField({ field, value, onChange }) {
  return (
    <Field label={`${field.label} — ${value}`}>
      <input
        type="range"
        className="vs-slider nodrag"
        value={value}
        min={field.min ?? 0}
        max={field.max ?? 1}
        step={field.step ?? 0.1}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
