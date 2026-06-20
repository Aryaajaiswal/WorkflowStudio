// Field.js
// Thin label+control wrapper so every field type lines up the same way.

export function Field({ label, children, stacked = false }) {
  if (!label) return children;
  return (
    <label className={`vs-field${stacked ? ' vs-field--stacked' : ''}`}>
      <span className="vs-field-label">{label}</span>
      {children}
    </label>
  );
}
