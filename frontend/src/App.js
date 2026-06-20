import { useEffect } from 'react';
import './theme.css';
import './App.css';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { useStore } from './store';

function App() {
  useEffect(() => {
    window.__useStore = useStore;
  }, []);

  return (
    <div className="vs-app">
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
