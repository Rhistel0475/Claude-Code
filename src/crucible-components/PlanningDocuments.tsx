import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { PlanningDocument } from '../crucibleTypes';

const PlanningDocuments: React.FC = () => {
  const { project, addPlanningDoc, updatePlanningDoc, deletePlanningDoc } = useCrucible();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  if (!project) return null;

  const docTypes = [
    { type: 'crucible-thesis', label: 'Crucible Thesis', description: 'Core forging question and strand summaries' },
    { type: 'quest-map', label: 'Quest Strand Map', description: 'External mission progression' },
    { type: 'fire-map', label: 'Fire Strand Map', description: 'Internal transformation arc' },
    { type: 'constellation-map', label: 'Constellation Strand Map', description: 'Relationship dynamics' },
    { type: 'dark-mirror', label: 'Dark Mirror Profile', description: 'Antagonist as protagonist shadow' },
    { type: 'constellation-bible', label: 'Constellation Bible', description: 'Character relationship matrix' },
    { type: 'mercy-ledger', label: 'Mercy Ledger', description: 'Compassionate acts with payoff mechanics' },
    { type: 'world-forge', label: 'World Forge', description: 'Thematic worldbuilding integration' },
  ];

  const createDocument = (type: string, title: string) => {
    const newDoc: PlanningDocument = {
      id: `doc-${Date.now()}`,
      type: type as any,
      title,
      content: '',
      lastModified: new Date()
    };
    addPlanningDoc(newDoc);
    setSelectedDoc(newDoc.id);
  };

  const selectedDocument = project.planningDocs.find(d => d.id === selectedDoc);

  return (
    <div className="planning-documents">
      <div className="planning-sidebar">
        <h2>Planning Documents</h2>

        {docTypes.map(docType => {
          const docs = project.planningDocs.filter(d => d.type === docType.type);
          return (
            <div key={docType.type} className="doc-type-group">
              <div className="doc-type-header">
                <strong>{docType.label}</strong>
                <button
                  onClick={() => {
                    const title = prompt(`Title for ${docType.label}:`, docType.label);
                    if (title) createDocument(docType.type, title);
                  }}
                  className="add-doc-btn"
                  title="Add document"
                >
                  +
                </button>
              </div>
              <p className="doc-type-desc">{docType.description}</p>
              {docs.length > 0 && (
                <div className="doc-list">
                  {docs.map(doc => (
                    <div
                      key={doc.id}
                      className={`doc-item ${selectedDoc === doc.id ? 'active' : ''}`}
                      onClick={() => setSelectedDoc(doc.id)}
                    >
                      {doc.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="planning-content">
        {selectedDocument ? (
          <div className="document-editor">
            <div className="document-header">
              <input
                type="text"
                value={selectedDocument.title}
                onChange={(e) =>
                  updatePlanningDoc(selectedDocument.id, { title: e.target.value })
                }
                className="document-title-input"
              />
              <button
                onClick={() => {
                  if (confirm('Delete this document?')) {
                    deletePlanningDoc(selectedDocument.id);
                    setSelectedDoc(null);
                  }
                }}
                className="delete-btn"
              >
                Delete
              </button>
            </div>

            <div className="document-meta">
              <small>
                Type: {selectedDocument.type} · Last modified:{' '}
                {new Date(selectedDocument.lastModified).toLocaleString()}
              </small>
            </div>

            <textarea
              value={selectedDocument.content}
              onChange={(e) =>
                updatePlanningDoc(selectedDocument.id, { content: e.target.value })
              }
              placeholder="Write your planning document content here..."
              className="document-content"
            />
          </div>
        ) : (
          <div className="no-document-selected">
            <h3>No Document Selected</h3>
            <p>Select a document from the sidebar or create a new one.</p>
            <div className="planning-tips">
              <h4>Planning Document Tips:</h4>
              <ul>
                <li>Start with the Crucible Thesis to establish your core question</li>
                <li>Map each strand (Quest, Fire, Constellation) thoroughly</li>
                <li>Develop your antagonist's Dark Mirror profile early</li>
                <li>Use the Constellation Bible to track all character relationships</li>
                <li>The Mercy Ledger tracks compassion for powerful payoffs</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanningDocuments;
