import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { MercyEntry } from '../crucibleTypes';

const MercyEngine: React.FC = () => {
  const { project, addMercyEntry, updateMercyEntry, deleteMercyEntry } = useCrucible();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!project) return null;

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newEntry: MercyEntry = {
      id: `mercy-${Date.now()}`,
      beatNumber: parseInt(formData.get('beatNumber') as string),
      compassionateAct: formData.get('compassionateAct') as string,
      plantedAt: formData.get('plantedAt') as string,
      payoffAt: formData.get('payoffAt') as string || undefined,
      status: 'planted'
    };

    addMercyEntry(newEntry);
    setShowAddForm(false);
    form.reset();
  };

  const sortedEntries = [...project.mercyLedger].sort((a, b) => a.beatNumber - b.beatNumber);

  const statusColors = {
    planted: '#5cb85c',
    brewing: '#f0ad4e',
    'paid-off': '#5bc0de'
  };

  return (
    <div className="mercy-engine">
      <div className="mercy-header">
        <h1>Mercy Engine</h1>
        <p>
          Track compassionate acts planted early in your story for powerful emotional
          payoffs in the climax
        </p>
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
          {showAddForm ? 'Cancel' : '+ Add Mercy Entry'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-mercy-form">
          <h3>Add Mercy Entry</h3>
          <form onSubmit={handleAddEntry}>
            <div className="form-group">
              <label>Beat Number (where planted) *</label>
              <input
                type="number"
                name="beatNumber"
                min="1"
                max="36"
                required
              />
            </div>

            <div className="form-group">
              <label>Compassionate Act *</label>
              <textarea
                name="compassionateAct"
                placeholder="Describe the act of mercy, kindness, or compassion..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>Planted At (Chapter/Scene Reference) *</label>
              <input
                type="text"
                name="plantedAt"
                placeholder="e.g., Chapter 3, Scene 2"
                required
              />
            </div>

            <div className="form-group">
              <label>Payoff At (Optional)</label>
              <input
                type="text"
                name="payoffAt"
                placeholder="e.g., Chapter 40 (climax)"
              />
            </div>

            <button type="submit" className="primary-btn">
              Add Entry
            </button>
          </form>
        </div>
      )}

      <div className="mercy-stats">
        <div className="stat-card">
          <h3>Total Entries</h3>
          <p className="stat-value">{project.mercyLedger.length}</p>
        </div>
        <div className="stat-card">
          <h3>Planted</h3>
          <p className="stat-value">
            {project.mercyLedger.filter(e => e.status === 'planted').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Brewing</h3>
          <p className="stat-value">
            {project.mercyLedger.filter(e => e.status === 'brewing').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Paid Off</h3>
          <p className="stat-value">
            {project.mercyLedger.filter(e => e.status === 'paid-off').length}
          </p>
        </div>
      </div>

      <div className="mercy-entries">
        {sortedEntries.length > 0 ? (
          sortedEntries.map(entry => (
            <div
              key={entry.id}
              className="mercy-entry"
              style={{ borderLeftColor: statusColors[entry.status] }}
            >
              <div className="entry-header">
                <div className="entry-beat">Beat {entry.beatNumber}</div>
                <select
                  value={entry.status}
                  onChange={(e) =>
                    updateMercyEntry(entry.id, {
                      status: e.target.value as any
                    })
                  }
                  className="status-selector"
                  style={{ borderColor: statusColors[entry.status] }}
                >
                  <option value="planted">Planted</option>
                  <option value="brewing">Brewing</option>
                  <option value="paid-off">Paid Off</option>
                </select>
                <button
                  onClick={() => {
                    if (confirm('Delete this mercy entry?')) {
                      deleteMercyEntry(entry.id);
                    }
                  }}
                  className="delete-btn-small"
                >
                  ✕
                </button>
              </div>

              <div className="entry-field">
                <label>Compassionate Act</label>
                <textarea
                  value={entry.compassionateAct}
                  onChange={(e) =>
                    updateMercyEntry(entry.id, {
                      compassionateAct: e.target.value
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="entry-locations">
                <div className="entry-field">
                  <label>Planted At</label>
                  <input
                    type="text"
                    value={entry.plantedAt}
                    onChange={(e) =>
                      updateMercyEntry(entry.id, { plantedAt: e.target.value })
                    }
                  />
                </div>

                <div className="entry-field">
                  <label>Payoff At</label>
                  <input
                    type="text"
                    value={entry.payoffAt || ''}
                    onChange={(e) =>
                      updateMercyEntry(entry.id, { payoffAt: e.target.value })
                    }
                    placeholder="Where does this pay off?"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-entries">
            <h3>No Mercy Entries Yet</h3>
            <p>
              The Mercy Engine tracks acts of compassion that your protagonist
              performs early in the story, which can provide powerful emotional
              payoffs during the climax.
            </p>
          </div>
        )}
      </div>

      <div className="mercy-tips">
        <h3>Using the Mercy Engine</h3>
        <ul>
          <li>Plant mercy moments in the first half of your story</li>
          <li>Make them genuine, not obviously transactional</li>
          <li>The payoff should feel earned and emotionally resonant</li>
          <li>Not every act needs a payoff - some exist to show character</li>
          <li>The strongest payoffs come at the darkest moments</li>
        </ul>
      </div>
    </div>
  );
};

export default MercyEngine;
