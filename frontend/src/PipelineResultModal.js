// PipelineResultModal.js
//
// The "alert" required by Part 4, built as an in-app modal instead of a
// native window.alert(). A blocking browser alert can't be styled and
// looks out of place against the rest of the board — this renders the
// same information (node count, edge count, DAG status) inside the
// design system, and still functions as a single, undeniable summary
// the user sees immediately after submitting.

import { CheckCircle2, XCircle, Boxes, Cable } from 'lucide-react';

export const PipelineResultModal = ({ result, onClose }) => {
  if (!result) return null;

  const { numNodes, numEdges, isDag, error } = result;

  return (
    <div className="vs-modal-overlay" onClick={onClose}>
      <div className="vs-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {error ? (
          <>
            <div className="vs-modal-icon vs-modal-icon--error">
              <XCircle size={28} strokeWidth={2} />
            </div>
            <h2 className="vs-modal-title">Couldn't reach the backend</h2>
            <p className="vs-modal-message">{error}</p>
          </>
        ) : (
          <>
            <div className={`vs-modal-icon ${isDag ? 'vs-modal-icon--success' : 'vs-modal-icon--warning'}`}>
              {isDag ? <CheckCircle2 size={28} strokeWidth={2} /> : <XCircle size={28} strokeWidth={2} />}
            </div>
            <h2 className="vs-modal-title">Pipeline analyzed</h2>
            <div className="vs-modal-stats">
              <div className="vs-modal-stat">
                <Boxes size={16} strokeWidth={2.25} />
                <span className="vs-modal-stat-value">{numNodes}</span>
                <span className="vs-modal-stat-label">node{numNodes === 1 ? '' : 's'}</span>
              </div>
              <div className="vs-modal-stat">
                <Cable size={16} strokeWidth={2.25} />
                <span className="vs-modal-stat-value">{numEdges}</span>
                <span className="vs-modal-stat-label">edge{numEdges === 1 ? '' : 's'}</span>
              </div>
            </div>
            <p className={`vs-modal-dag ${isDag ? 'vs-modal-dag--yes' : 'vs-modal-dag--no'}`}>
              {isDag
                ? 'This pipeline is a valid DAG — no cycles found.'
                : 'This pipeline has a cycle, so it is not a DAG.'}
            </p>
          </>
        )}
        <button className="vs-button vs-button--primary vs-modal-close" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};
