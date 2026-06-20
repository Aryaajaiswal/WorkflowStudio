import { useState, useEffect, useCallback } from 'react';
import './theme.css';
import './App.css';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { ShortcutsModal } from './ShortcutsModal';
import { useStore } from './store';

function App() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const autoLayout = useStore((s) => s.autoLayout);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleAutoLayout = useCallback(() => {
    autoLayout();
  }, [autoLayout]);

  const toggleShortcuts = useCallback(() => setShowShortcuts((v) => !v), []);

  return (
    <div className="vs-app">
      <PipelineToolbar onAutoLayout={handleAutoLayout} onToggleShortcuts={toggleShortcuts} />
      <PipelineUI />
      <SubmitButton />
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

export default App;
