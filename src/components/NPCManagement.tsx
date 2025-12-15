import React, { useState } from 'react';
import { useGame } from '../GameContext';
import type { NPC } from '../types';

export const NPCManagement: React.FC = () => {
  const { gameState, addNPC, updateNPC, deleteNPC } = useGame();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateNPC(editingId, formData);
      setEditingId(null);
    } else {
      addNPC({ ...formData, assignedInformation: [] });
      setIsAdding(false);
    }
    setFormData({ name: '', role: '', location: '', description: '' });
  };

  const handleEdit = (npc: NPC) => {
    setEditingId(npc.id);
    setFormData({
      name: npc.name,
      role: npc.role,
      location: npc.location,
      description: npc.description,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', role: '', location: '', description: '' });
  };

  return (
    <div className="npc-management">
      <div className="section-header">
        <h2>NPC Roster</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary">
            Add NPC
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="npc-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Blacksmith, Tavern Owner"
              required
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., The Rusty Anvil, Market Square"
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Physical appearance, personality traits, etc."
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Add'} NPC
            </button>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="npc-list">
        {gameState.npcs.length === 0 ? (
          <p className="empty-state">No NPCs yet. Add your first NPC to get started!</p>
        ) : (
          gameState.npcs.map(npc => (
            <div key={npc.id} className="npc-card">
              <div className="npc-header">
                <h3>{npc.name}</h3>
                <div className="npc-actions">
                  <button onClick={() => handleEdit(npc)} className="btn-small">
                    Edit
                  </button>
                  <button onClick={() => deleteNPC(npc.id)} className="btn-small btn-danger">
                    Delete
                  </button>
                </div>
              </div>
              <div className="npc-details">
                <p><strong>Role:</strong> {npc.role}</p>
                <p><strong>Location:</strong> {npc.location}</p>
                {npc.description && <p><strong>Description:</strong> {npc.description}</p>}
                <p><strong>Information Pieces:</strong> {npc.assignedInformation.length}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
