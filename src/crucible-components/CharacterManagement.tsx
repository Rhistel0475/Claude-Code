import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { Character } from '../crucibleTypes';

const CharacterManagement: React.FC = () => {
  const { project, addCharacter, updateCharacter, deleteCharacter } = useCrucible();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  if (!project) return null;

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newCharacter: Character = {
      id: `char-${Date.now()}`,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      arc: formData.get('arc') as string,
      relationships: [],
      darkMirror: formData.get('darkMirror') === 'on'
    };

    addCharacter(newCharacter);
    setShowAddForm(false);
    setSelectedCharacter(newCharacter.id);
    form.reset();
  };

  const addRelationship = (characterId: string) => {
    const otherCharId = prompt('Select related character ID:');
    const description = prompt('Describe the relationship:');
    if (otherCharId && description) {
      const character = project.characters.find(c => c.id === characterId);
      if (character) {
        updateCharacter(characterId, {
          relationships: [
            ...character.relationships,
            { characterId: otherCharId, description }
          ]
        });
      }
    }
  };

  const removeRelationship = (characterId: string, index: number) => {
    const character = project.characters.find(c => c.id === characterId);
    if (character) {
      updateCharacter(characterId, {
        relationships: character.relationships.filter((_, i) => i !== index)
      });
    }
  };

  const selectedChar = project.characters.find(c => c.id === selectedCharacter);

  return (
    <div className="character-management">
      <div className="character-sidebar">
        <div className="sidebar-header">
          <h2>Characters</h2>
          <button onClick={() => setShowAddForm(true)} className="add-btn">
            + Add Character
          </button>
        </div>

        <div className="character-list">
          {project.characters.map(char => (
            <div
              key={char.id}
              className={`character-item ${selectedCharacter === char.id ? 'active' : ''} ${
                char.darkMirror ? 'dark-mirror' : ''
              }`}
              onClick={() => setSelectedCharacter(char.id)}
            >
              <div className="char-name">
                {char.darkMirror && '⚔ '}
                {char.name}
              </div>
              <div className="char-role">{char.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="character-content">
        {showAddForm && (
          <div className="add-character-form">
            <h3>Add New Character</h3>
            <form onSubmit={handleAddCharacter}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" required />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g., Protagonist, Mentor, Ally"
                />
              </div>

              <div className="form-group">
                <label>Character Arc</label>
                <textarea
                  name="arc"
                  placeholder="Describe this character's journey through the story..."
                  rows={4}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="darkMirror" />
                  Dark Mirror (Antagonist)
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  Add Character
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedChar && !showAddForm && (
          <div className="character-details">
            <div className="character-header">
              <h2>{selectedChar.name}</h2>
              {selectedChar.darkMirror && (
                <span className="dark-mirror-badge">⚔ Dark Mirror</span>
              )}
              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedChar.name}?`)) {
                    deleteCharacter(selectedChar.id);
                    setSelectedCharacter(null);
                  }
                }}
                className="delete-btn"
              >
                Delete
              </button>
            </div>

            <div className="character-field">
              <label>Name</label>
              <input
                type="text"
                value={selectedChar.name}
                onChange={(e) =>
                  updateCharacter(selectedChar.id, { name: e.target.value })
                }
              />
            </div>

            <div className="character-field">
              <label>Role</label>
              <input
                type="text"
                value={selectedChar.role}
                onChange={(e) =>
                  updateCharacter(selectedChar.id, { role: e.target.value })
                }
                placeholder="e.g., Protagonist, Mentor, Antagonist"
              />
            </div>

            <div className="character-field">
              <label>Character Arc</label>
              <textarea
                value={selectedChar.arc}
                onChange={(e) =>
                  updateCharacter(selectedChar.id, { arc: e.target.value })
                }
                placeholder="Describe this character's journey..."
                rows={6}
              />
            </div>

            <div className="character-field">
              <label>
                <input
                  type="checkbox"
                  checked={selectedChar.darkMirror || false}
                  onChange={(e) =>
                    updateCharacter(selectedChar.id, {
                      darkMirror: e.target.checked
                    })
                  }
                />
                Dark Mirror (Antagonist)
              </label>
            </div>

            <div className="relationships-section">
              <div className="section-header">
                <h3>Relationships</h3>
                <button
                  onClick={() => addRelationship(selectedChar.id)}
                  className="add-btn-small"
                >
                  + Add Relationship
                </button>
              </div>

              {selectedChar.relationships.length > 0 ? (
                <div className="relationships-list">
                  {selectedChar.relationships.map((rel, index) => {
                    const relatedChar = project.characters.find(
                      c => c.id === rel.characterId
                    );
                    return (
                      <div key={index} className="relationship-item">
                        <div className="relationship-header">
                          <strong>
                            {relatedChar?.name || 'Unknown Character'}
                          </strong>
                          <button
                            onClick={() =>
                              removeRelationship(selectedChar.id, index)
                            }
                            className="delete-btn-small"
                          >
                            ✕
                          </button>
                        </div>
                        <p>{rel.description}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-relationships">
                  No relationships defined yet.
                </p>
              )}
            </div>
          </div>
        )}

        {!selectedChar && !showAddForm && (
          <div className="no-character-selected">
            <h3>No Character Selected</h3>
            <p>Select a character from the sidebar or add a new one.</p>
            <div className="character-tips">
              <h4>Character Development Tips:</h4>
              <ul>
                <li>Define clear character arcs that intersect with your story strands</li>
                <li>The Dark Mirror should reflect the protagonist's fears or flaws</li>
                <li>Map relationships in the Constellation Bible planning document</li>
                <li>Consider how each character contributes to the Forge Points</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterManagement;
