// SelectField.js
import { Field } from './Field';

export function SelectField({ field, value, onChange }) {
  return (
    <Field label={field.label}>
      <select
        className="vs-select nodrag"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
