import { useEffect } from 'react';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: ['Backspace', 'Delete'], desc: 'Delete selected node' },
  { keys: ['?'], desc: 'Toggle this shortcuts panel' },
  { keys: ['Esc'], desc: 'Close modal / deselect' },
];

export const ShortcutsModal = ({ onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="vs-modal-overlay" onClick={onClose}>
      <div className="vs-modal vs-modal--shortcuts" onClick={(e) => e.stopPropagation()}>
        <div className="vs-modal-icon vs-modal-icon--info">
          <Keyboard size={28} strokeWidth={2} />
        </div>
        <h2 className="vs-modal-title">Keyboard shortcuts</h2>
        <div className="vs-shortcuts-list">
          {shortcuts.map((s, i) => (
            <div key={i} className="vs-shortcut-row">
              <div className="vs-shortcut-keys">
                {s.keys.map((k, j) => (
                  <span key={j} className="vs-kbd">{k}</span>
                ))}
              </div>
              <span className="vs-shortcut-desc">{s.desc}</span>
            </div>
          ))}
        </div>
        <button className="vs-button vs-button--primary vs-modal-close" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};
