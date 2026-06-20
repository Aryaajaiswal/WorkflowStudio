// TextAreaField.js
import { useRef, useLayoutEffect } from 'react';
import { Field } from './Field';

export function TextAreaField({ field, value, onChange }) {
  const ref = useRef(null);

  // Auto-grow to fit content. Reset height first so the box can shrink
  // back down when text is deleted, not just grow.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <Field label={field.label} stacked>
      <textarea
        ref={ref}
        className="vs-textarea nodrag"
        rows={1}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
