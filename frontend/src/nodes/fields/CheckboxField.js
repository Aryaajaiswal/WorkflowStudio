// CheckboxField.js

export function CheckboxField({ field, value, onChange }) {
  return (
    <label className="vs-field vs-field--checkbox">
      <input
        type="checkbox"
        className="vs-checkbox nodrag"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="vs-field-label">{field.label}</span>
    </label>
  );
}
