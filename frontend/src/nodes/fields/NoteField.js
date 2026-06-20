// NoteField.js
// A read-only line of descriptive text inside a node body — no input,
// just context (e.g. "Combines system + prompt into one response").

export function NoteField({ field }) {
  return <p className="vs-note">{field.text}</p>;
}
