import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { MovementType } from '../crucibleTypes';
import { MOVEMENTS } from '../crucibleTypes';

const BeatStructure: React.FC = () => {
  const { project, updateBeat } = useCrucible();
  const [selectedMovement, setSelectedMovement] = useState<MovementType>('ignition');
  const [expandedBeat, setExpandedBeat] = useState<string | null>(null);

  if (!project) return null;

  const movement = MOVEMENTS.find(m => m.type === selectedMovement)!;
  const beatsInMovement = project.beats.filter(
    b => b.number >= movement.beatRange[0] && b.number <= movement.beatRange[1]
  );

  const toggleBeat = (beatId: string) => {
    setExpandedBeat(expandedBeat === beatId ? null : beatId);
  };

  return (
    <div className="beat-structure">
      <div className="beat-header">
        <h1>36-Beat Structure</h1>
        <p>
          Navigate through your story's narrative framework across six movements
        </p>
      </div>

      <div className="movement-selector">
        {MOVEMENTS.map(m => (
          <button
            key={m.type}
            className={`movement-btn ${selectedMovement === m.type ? 'active' : ''}`}
            onClick={() => setSelectedMovement(m.type)}
          >
            <div className="movement-name">{m.name}</div>
            <div className="movement-meta">
              {m.percentage}% · Beats {m.beatRange[0]}-{m.beatRange[1]}
            </div>
          </button>
        ))}
      </div>

      <div className="movement-info">
        <h2>{movement.name}</h2>
        <div className="movement-details">
          <span className="detail-item">
            <strong>Coverage:</strong> {movement.percentage}% of story
          </span>
          <span className="detail-item">
            <strong>Beats:</strong> {movement.beatRange[0]}-{movement.beatRange[1]}
          </span>
          <span className="detail-item">
            <strong>Function:</strong> {movement.description}
          </span>
        </div>
      </div>

      <div className="beats-list">
        {beatsInMovement.map(beat => (
          <div
            key={beat.id}
            className={`beat-card ${expandedBeat === beat.id ? 'expanded' : ''} ${
              beat.isForgePoint ? 'forge-point' : ''
            }`}
          >
            <div className="beat-card-header" onClick={() => toggleBeat(beat.id)}>
              <div className="beat-number">Beat {beat.number}</div>
              {beat.isForgePoint && <div className="forge-badge">⚒ Forge Point</div>}
              <div className="beat-title">
                {beat.title || `Beat ${beat.number}`}
              </div>
              <button className="expand-btn">
                {expandedBeat === beat.id ? '−' : '+'}
              </button>
            </div>

            {expandedBeat === beat.id && (
              <div className="beat-card-body">
                <div className="beat-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={beat.title}
                    onChange={(e) =>
                      updateBeat(beat.id, { title: e.target.value })
                    }
                    placeholder={`Beat ${beat.number} title...`}
                  />
                </div>

                <div className="beat-field">
                  <label>Description</label>
                  <textarea
                    value={beat.description}
                    onChange={(e) =>
                      updateBeat(beat.id, { description: e.target.value })
                    }
                    placeholder="Overall description of this beat..."
                    rows={3}
                  />
                </div>

                <div className="strand-fields">
                  <div className="beat-field quest-field">
                    <label>Quest Strand</label>
                    <textarea
                      value={beat.questStrand}
                      onChange={(e) =>
                        updateBeat(beat.id, { questStrand: e.target.value })
                      }
                      placeholder="External mission developments..."
                      rows={2}
                    />
                  </div>

                  <div className="beat-field fire-field">
                    <label>Fire Strand</label>
                    <textarea
                      value={beat.fireStrand}
                      onChange={(e) =>
                        updateBeat(beat.id, { fireStrand: e.target.value })
                      }
                      placeholder="Internal transformation..."
                      rows={2}
                    />
                  </div>

                  <div className="beat-field constellation-field">
                    <label>Constellation Strand</label>
                    <textarea
                      value={beat.constellationStrand}
                      onChange={(e) =>
                        updateBeat(beat.id, {
                          constellationStrand: e.target.value
                        })
                      }
                      placeholder="Relationship developments..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="beat-meta">
                  <small>
                    Approximately {Math.round(beat.percentagePoint)}% through the story
                  </small>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeatStructure;
