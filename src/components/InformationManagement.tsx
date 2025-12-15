import React, { useState } from 'react';
import { useGame } from '../GameContext';
import type { Information } from '../types';

export const InformationManagement: React.FC = () => {
  const { gameState, addInformation, updateInformation, deleteInformation, randomizeInformation } = useGame();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [selectedForRandomize, setSelectedForRandomize] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateInformation(editingId, formData);
      setEditingId(null);
    } else {
      addInformation({ ...formData, isRevealed: false });
      setIsAdding(false);
    }
    setFormData({ title: '', content: '', category: '' });
  };

  const handleEdit = (info: Information) => {
    setEditingId(info.id);
    setFormData({
      title: info.title,
      content: info.content,
      category: info.category || '',
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', content: '', category: '' });
  };

  const toggleSelectForRandomize = (id: string) => {
    setSelectedForRandomize(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRandomize = () => {
    if (selectedForRandomize.length > 0 && gameState.npcs.length > 0) {
      randomizeInformation(selectedForRandomize);
      setSelectedForRandomize([]);
      alert(`Randomly assigned ${selectedForRandomize.length} information piece(s) to NPCs!`);
    } else {
      alert('Please select information to randomize and ensure you have NPCs created.');
    }
  };

  const getNPCsWithInfo = (infoId: string) => {
    return gameState.npcs.filter(npc => npc.assignedInformation.includes(infoId));
  };

  return (
    <div className="information-management">
      <div className="section-header">
        <h2>Story Information</h2>
        <div className="header-actions">
          {selectedForRandomize.length > 0 && (
            <button onClick={handleRandomize} className="btn-accent">
              Randomize Selected ({selectedForRandomize.length})
            </button>
          )}
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="btn-primary">
              Add Information
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="info-form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief title for this information"
              required
            />
          </div>
          <div className="form-group">
            <label>Content:</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="The actual information that NPCs can reveal"
              rows={4}
              required
            />
          </div>
          <div className="form-group">
            <label>Category (optional):</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Main Quest, Side Quest, Lore"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Add'} Information
            </button>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="info-list">
        {gameState.information.length === 0 ? (
          <p className="empty-state">No information pieces yet. Add story information that NPCs can reveal!</p>
        ) : (
          gameState.information.map(info => {
            const assignedNPCs = getNPCsWithInfo(info.id);
            return (
              <div key={info.id} className="info-card">
                <div className="info-header">
                  <div className="info-title-group">
                    <input
                      type="checkbox"
                      checked={selectedForRandomize.includes(info.id)}
                      onChange={() => toggleSelectForRandomize(info.id)}
                      title="Select for randomization"
                    />
                    <h3>{info.title}</h3>
                    {info.category && <span className="info-category">{info.category}</span>}
                  </div>
                  <div className="info-actions">
                    <button onClick={() => handleEdit(info)} className="btn-small">
                      Edit
                    </button>
                    <button onClick={() => deleteInformation(info.id)} className="btn-small btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="info-content">
                  <p>{info.content}</p>
                </div>
                <div className="info-footer">
                  <p><strong>Assigned to:</strong> {
                    assignedNPCs.length > 0
                      ? assignedNPCs.map(npc => npc.name).join(', ')
                      : 'No one yet'
                  }</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
