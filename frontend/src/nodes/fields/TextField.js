// TextField.js
import { Field } from './Field';

export function TextField({ field, value, onChange }) {
  return (
    <Field label={field.label}>
      <input
        type="text"
        className="vs-input nodrag"
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
