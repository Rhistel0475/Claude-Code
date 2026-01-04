import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { Beat, Character, MercyEntry } from '../crucibleTypes';

type VisualizationType = 'arc' | 'relationships' | 'mercy';

const StoryVisualization: React.FC = () => {
  const [activeViz, setActiveViz] = useState<VisualizationType>('arc');

  return (
    <div className="story-visualization">
      <div className="viz-header">
        <h1>Story Visualizations</h1>
        <p className="viz-subtitle">Visual representations of your narrative structure</p>
      </div>

      <div className="viz-tabs">
        <button
          className={activeViz === 'arc' ? 'active' : ''}
          onClick={() => setActiveViz('arc')}
        >
          📈 Story Arc
        </button>
        <button
          className={activeViz === 'relationships' ? 'active' : ''}
          onClick={() => setActiveViz('relationships')}
        >
          🕸️ Relationships
        </button>
        <button
          className={activeViz === 'mercy' ? 'active' : ''}
          onClick={() => setActiveViz('mercy')}
        >
          💫 Mercy Flow
        </button>
      </div>

      <div className="viz-content">
        {activeViz === 'arc' && <StoryArcVisualizer />}
        {activeViz === 'relationships' && <RelationshipMap />}
        {activeViz === 'mercy' && <MercyFlowchart />}
      </div>
    </div>
  );
};

// Story Arc Visualizer - Shows all three strands across 36 beats
const StoryArcVisualizer: React.FC = () => {
  const { project } = useCrucible();
  const [selectedStrand, setSelectedStrand] = useState<'all' | 'quest' | 'fire' | 'constellation'>('all');
  const [hoveredBeat, setHoveredBeat] = useState<number | null>(null);

  if (!project) return null;

  const width = 1200;
  const height = 500;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate intensity for each beat (based on content length)
  const calculateIntensity = (beat: Beat, strand: 'quest' | 'fire' | 'constellation'): number => {
    const content = beat[`${strand}Strand`] || '';
    if (!content) return 0;
    // Normalize to 0-1 range based on content length (max ~500 chars = full intensity)
    return Math.min(content.length / 500, 1);
  };

  // Generate points for a strand
  const generateStrandPath = (strand: 'quest' | 'fire' | 'constellation'): string => {
    const points = project.beats.map((beat, idx) => {
      const x = padding.left + (idx / 35) * chartWidth;
      const intensity = calculateIntensity(beat, strand);
      const y = padding.top + chartHeight - (intensity * chartHeight);
      return `${x},${y}`;
    });

    // Create smooth curve
    if (points.length === 0) return '';

    let path = `M ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      const [x, y] = points[i].split(',').map(Number);
      const [prevX, prevY] = points[i - 1].split(',').map(Number);
      const cpx1 = prevX + (x - prevX) / 3;
      const cpx2 = prevX + 2 * (x - prevX) / 3;
      path += ` C ${cpx1},${prevY} ${cpx2},${y} ${x},${y}`;
    }
    return path;
  };

  const strandColors = {
    quest: '#3498db',
    fire: '#e74c3c',
    constellation: '#9b59b6'
  };

  const forgePoints = project.forgePoints.filter(fp => fp.stakes);

  return (
    <div className="arc-visualizer">
      <div className="arc-controls">
        <label>
          <strong>Show Strands:</strong>
          <select value={selectedStrand} onChange={(e) => setSelectedStrand(e.target.value as any)}>
            <option value="all">All Three Strands</option>
            <option value="quest">Quest Only</option>
            <option value="fire">Fire Only</option>
            <option value="constellation">Constellation Only</option>
          </select>
        </label>
      </div>

      <svg width={width} height={height} className="arc-chart">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="url(#grid)" />

        {/* Movement sections */}
        {[
          { name: 'Ignition', start: 0, end: 6, color: '#fff4e6' },
          { name: 'First Tempering', start: 6, end: 12, color: '#ffe6e6' },
          { name: 'Scattering', start: 12, end: 18, color: '#e6f3ff' },
          { name: 'Brightest Burning', start: 18, end: 24, color: '#fff0f0' },
          { name: 'Final Forging', start: 24, end: 30, color: '#f0e6ff' },
          { name: 'Tempered Blade', start: 30, end: 36, color: '#e6ffe6' }
        ].map((movement, idx) => {
          const x = padding.left + (movement.start / 35) * chartWidth;
          const sectionWidth = ((movement.end - movement.start) / 35) * chartWidth;
          return (
            <g key={idx}>
              <rect
                x={x}
                y={padding.top}
                width={sectionWidth}
                height={chartHeight}
                fill={movement.color}
                opacity={0.3}
              />
              <text
                x={x + sectionWidth / 2}
                y={padding.top - 10}
                textAnchor="middle"
                fontSize="11"
                fill="#666"
                fontWeight="bold"
              >
                {movement.name}
              </text>
            </g>
          );
        })}

        {/* Forge Points as peaks */}
        {forgePoints.map((fp) => {
          const beatIdx = fp.beatNumber - 1;
          const x = padding.left + (beatIdx / 35) * chartWidth;
          return (
            <g key={fp.id}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + chartHeight}
                stroke="#ff6b6b"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <circle cx={x} cy={padding.top + 10} r="6" fill="#ff6b6b" />
              <text
                x={x}
                y={padding.top + 30}
                textAnchor="middle"
                fontSize="10"
                fill="#ff6b6b"
                fontWeight="bold"
              >
                FP{forgePoints.indexOf(fp) + 1}
              </text>
            </g>
          );
        })}

        {/* Story strands */}
        {(selectedStrand === 'all' || selectedStrand === 'quest') && (
          <path
            d={generateStrandPath('quest')}
            fill="none"
            stroke={strandColors.quest}
            strokeWidth="3"
            opacity={selectedStrand === 'quest' ? 1 : 0.7}
          />
        )}
        {(selectedStrand === 'all' || selectedStrand === 'fire') && (
          <path
            d={generateStrandPath('fire')}
            fill="none"
            stroke={strandColors.fire}
            strokeWidth="3"
            opacity={selectedStrand === 'fire' ? 1 : 0.7}
          />
        )}
        {(selectedStrand === 'all' || selectedStrand === 'constellation') && (
          <path
            d={generateStrandPath('constellation')}
            fill="none"
            stroke={strandColors.constellation}
            strokeWidth="3"
            opacity={selectedStrand === 'constellation' ? 1 : 0.7}
          />
        )}

        {/* Beat markers */}
        {project.beats.map((beat, idx) => {
          const x = padding.left + (idx / 35) * chartWidth;
          const intensities = {
            quest: calculateIntensity(beat, 'quest'),
            fire: calculateIntensity(beat, 'fire'),
            constellation: calculateIntensity(beat, 'constellation')
          };

          const avgIntensity = (intensities.quest + intensities.fire + intensities.constellation) / 3;
          const y = padding.top + chartHeight - (avgIntensity * chartHeight);

          return (
            <circle
              key={beat.id}
              cx={x}
              cy={y}
              r={hoveredBeat === beat.number ? 6 : 4}
              fill={hoveredBeat === beat.number ? '#2c3e50' : '#95a5a6'}
              opacity={0.8}
              onMouseEnter={() => setHoveredBeat(beat.number)}
              onMouseLeave={() => setHoveredBeat(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {/* Axes */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#2c3e50"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#2c3e50"
          strokeWidth="2"
        />

        {/* Axis labels */}
        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="14" fill="#2c3e50">
          Beat Number
        </text>
        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          fontSize="14"
          fill="#2c3e50"
          transform={`rotate(-90, 20, ${height / 2})`}
        >
          Story Intensity
        </text>

        {/* X-axis beat numbers */}
        {[0, 6, 12, 18, 24, 30, 36].map((beat) => {
          const x = padding.left + ((beat) / 35) * chartWidth;
          return (
            <text key={beat} x={x} y={height - 30} textAnchor="middle" fontSize="12" fill="#666">
              {beat === 36 ? 36 : beat + 1}
            </text>
          );
        })}
      </svg>

      {/* Hover info */}
      {hoveredBeat !== null && (
        <div className="beat-hover-info">
          <h4>Beat {hoveredBeat}</h4>
          <p><strong>Quest:</strong> {project.beats[hoveredBeat - 1].questStrand ? '✓' : '—'}</p>
          <p><strong>Fire:</strong> {project.beats[hoveredBeat - 1].fireStrand ? '✓' : '—'}</p>
          <p><strong>Constellation:</strong> {project.beats[hoveredBeat - 1].constellationStrand ? '✓' : '—'}</p>
        </div>
      )}

      {/* Legend */}
      <div className="arc-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: strandColors.quest }}></div>
          <span>Quest (External)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: strandColors.fire }}></div>
          <span>Fire (Internal)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: strandColors.constellation }}></div>
          <span>Constellation (Relationships)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ff6b6b' }}></div>
          <span>Forge Points</span>
        </div>
      </div>
    </div>
  );
};

// Character Relationship Map
const RelationshipMap: React.FC = () => {
  const { project } = useCrucible();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  if (!project) return null;

  const width = 1000;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;

  // Initialize positions in a circle if not set
  React.useEffect(() => {
    if (project.characters.length > 0 && Object.keys(nodePositions).length === 0) {
      const positions: Record<string, { x: number; y: number }> = {};
      const radius = 200;

      project.characters.forEach((char, idx) => {
        const angle = (idx / project.characters.length) * 2 * Math.PI;
        positions[char.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });

      setNodePositions(positions);
    }
  }, [project.characters, nodePositions, centerX, centerY]);

  const getRelationshipColor = (type: string): string => {
    const colors: Record<string, string> = {
      ally: '#27ae60',
      enemy: '#e74c3c',
      mentor: '#3498db',
      student: '#9b59b6',
      family: '#f39c12',
      romantic: '#e91e63',
      rival: '#ff6b6b',
      neutral: '#95a5a6'
    };
    return colors[type] || '#95a5a6';
  };

  // Build relationship connections
  const connections: Array<{
    from: Character;
    to: Character;
    description: string;
  }> = [];

  project.characters.forEach((char) => {
    char.relationships.forEach((rel) => {
      const targetChar = project.characters.find(c => c.id === rel.characterId);
      if (targetChar) {
        connections.push({
          from: char,
          to: targetChar,
          description: rel.description
        });
      }
    });
  });

  const handleNodeDrag = (charId: string, e: React.MouseEvent<SVGCircleElement>) => {
    if (draggedNode === charId) {
      const svg = e.currentTarget.ownerSVGElement;
      if (svg) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        setNodePositions(prev => ({
          ...prev,
          [charId]: { x: svgP.x, y: svgP.y }
        }));
      }
    }
  };

  if (project.characters.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Characters Yet</h3>
        <p>Add characters in the Characters tab to see their relationship map.</p>
      </div>
    );
  }

  return (
    <div className="relationship-map">
      <div className="map-info">
        <h3>Character Relationship Network</h3>
        <p>Drag nodes to rearrange. Click to see details.</p>
      </div>

      <svg
        width={width}
        height={height}
        className="relationship-chart"
        onMouseMove={(e) => draggedNode && handleNodeDrag(draggedNode, e as any)}
        onMouseUp={() => setDraggedNode(null)}
      >
        {/* Draw connections */}
        {connections.map((conn, idx) => {
          const fromPos = nodePositions[conn.from.id];
          const toPos = nodePositions[conn.to.id];

          if (!fromPos || !toPos) return null;

          const isHighlighted = selectedCharacter === conn.from.id || selectedCharacter === conn.to.id;

          return (
            <g key={idx}>
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#3498db"
                strokeWidth={isHighlighted ? 3 : 2}
                opacity={selectedCharacter && !isHighlighted ? 0.2 : 0.6}
                markerEnd="url(#arrowhead)"
              />
              {/* Relationship label */}
              <text
                x={(fromPos.x + toPos.x) / 2}
                y={(fromPos.y + toPos.y) / 2}
                textAnchor="middle"
                fontSize="9"
                fill="#666"
                opacity={isHighlighted ? 1 : 0.3}
              >
                {conn.description.substring(0, 15)}
              </text>
            </g>
          );
        })}

        {/* Draw character nodes */}
        {project.characters.map((char) => {
          const pos = nodePositions[char.id];
          if (!pos) return null;

          const isSelected = selectedCharacter === char.id;
          const isDarkMirror = char.darkMirror;

          return (
            <g key={char.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 35 : 30}
                fill={isDarkMirror ? '#34495e' : '#3498db'}
                stroke={isSelected ? '#e74c3c' : '#2c3e50'}
                strokeWidth={isSelected ? 3 : 2}
                opacity={selectedCharacter && !isSelected ? 0.5 : 1}
                style={{ cursor: 'grab' }}
                onMouseDown={() => setDraggedNode(char.id)}
                onClick={() => setSelectedCharacter(isSelected ? null : char.id)}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                pointerEvents="none"
              >
                {char.name.substring(0, 10)}
              </text>
              {isDarkMirror && (
                <text
                  x={pos.x}
                  y={pos.y + 45}
                  textAnchor="middle"
                  fontSize="16"
                  pointerEvents="none"
                >
                  🌑
                </text>
              )}
            </g>
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#666" />
          </marker>
        </defs>
      </svg>

      {/* Selected character details */}
      {selectedCharacter && (
        <div className="character-details-panel">
          {(() => {
            const char = project.characters.find(c => c.id === selectedCharacter);
            if (!char) return null;

            return (
              <>
                <h3>{char.name}</h3>
                <p><strong>Role:</strong> {char.role}</p>
                {char.darkMirror && <p className="dark-mirror-badge">🌑 Dark Mirror</p>}
                <div className="character-relationships">
                  <h4>Relationships ({char.relationships.length})</h4>
                  {char.relationships.map((rel, idx) => {
                    const targetChar = project.characters.find(c => c.id === rel.characterId);
                    return (
                      <div key={idx} className="rel-item">
                        <span className="rel-name">{targetChar?.name || 'Unknown'}</span>
                        <span className="rel-desc">: {rel.description}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="relationship-legend">
        <h4>Relationship Types</h4>
        {['ally', 'enemy', 'mentor', 'romantic', 'rival', 'family'].map(type => (
          <div key={type} className="legend-item">
            <div className="legend-line" style={{ background: getRelationshipColor(type) }}></div>
            <span>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mercy Engine Flowchart
const MercyFlowchart: React.FC = () => {
  const { project } = useCrucible();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  if (!project) return null;

  const plantedEntries = project.mercyLedger.filter(e => e.status === 'planted');
  const brewingEntries = project.mercyLedger.filter(e => e.status === 'brewing');
  const paidOffEntries = project.mercyLedger.filter(e => e.status === 'paid-off');

  const renderMercyCard = (entry: MercyEntry) => {
    const isSelected = selectedEntry === entry.id;

    return (
      <div
        key={entry.id}
        className={`mercy-card ${isSelected ? 'selected' : ''}`}
        onClick={() => setSelectedEntry(isSelected ? null : entry.id)}
      >
        <div className="mercy-card-header">
          <strong>{entry.compassionateAct}</strong>
        </div>
        <div className="mercy-card-body">
          <p className="mercy-giver">Planted: {entry.plantedAt}</p>
          <p className="mercy-beat">Beat {entry.beatNumber}</p>
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'planted' ? '#3498db' : status === 'brewing' ? '#f39c12' : '#27ae60';
  };

  if (project.mercyLedger.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Mercy Moments Yet</h3>
        <p>Track acts of compassion in the Mercy Engine tab to see their flow through your story.</p>
      </div>
    );
  }

  return (
    <div className="mercy-flowchart">
      <div className="flowchart-info">
        <h3>Mercy Engine Flow</h3>
        <p>Track compassionate acts from setup to payoff</p>
      </div>

      <div className="flowchart-columns">
        {/* Planted Column */}
        <div className="flow-column">
          <div className="column-header" style={{ background: getStatusColor('planted') }}>
            <h3>🌱 Planted</h3>
            <span className="count">{plantedEntries.length}</span>
          </div>
          <div className="column-content">
            {plantedEntries.length === 0 ? (
              <p className="empty-column">No planted seeds yet</p>
            ) : (
              plantedEntries.map(renderMercyCard)
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flow-arrow">→</div>

        {/* Brewing Column */}
        <div className="flow-column">
          <div className="column-header" style={{ background: getStatusColor('brewing') }}>
            <h3>🔥 Brewing</h3>
            <span className="count">{brewingEntries.length}</span>
          </div>
          <div className="column-content">
            {brewingEntries.length === 0 ? (
              <p className="empty-column">Nothing brewing</p>
            ) : (
              brewingEntries.map(renderMercyCard)
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flow-arrow">→</div>

        {/* Paid Off Column */}
        <div className="flow-column">
          <div className="column-header" style={{ background: getStatusColor('paid-off') }}>
            <h3>✨ Paid Off</h3>
            <span className="count">{paidOffEntries.length}</span>
          </div>
          <div className="column-content">
            {paidOffEntries.length === 0 ? (
              <p className="empty-column">No payoffs yet</p>
            ) : (
              paidOffEntries.map(renderMercyCard)
            )}
          </div>
        </div>
      </div>

      {/* Selected entry details */}
      {selectedEntry && (
        <div className="mercy-details-panel">
          {(() => {
            const entry = project.mercyLedger.find(e => e.id === selectedEntry);
            if (!entry) return null;

            return (
              <>
                <h3>Mercy Moment Details</h3>
                <div className="detail-grid">
                  <div>
                    <strong>Compassionate Act:</strong>
                    <p>{entry.compassionateAct}</p>
                  </div>
                  <div>
                    <strong>Beat Number:</strong>
                    <p>Beat {entry.beatNumber}</p>
                  </div>
                  <div>
                    <strong>Planted At:</strong>
                    <p>{entry.plantedAt}</p>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <p style={{ color: getStatusColor(entry.status) }}>
                      {entry.status}
                    </p>
                  </div>
                  {entry.payoffAt && (
                    <div>
                      <strong>Payoff At:</strong>
                      <p>{entry.payoffAt}</p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Warnings for imbalanced mercy */}
      <div className="mercy-warnings">
        {plantedEntries.length > 5 && paidOffEntries.length === 0 && (
          <div className="warning-card">
            ⚠️ You have {plantedEntries.length} planted mercy moments but no payoffs yet.
            Consider advancing some to "brewing" or "paid off" status.
          </div>
        )}
        {brewingEntries.length > 3 && (
          <div className="warning-card">
            💡 {brewingEntries.length} mercy moments are brewing. Make sure to pay them off
            before the story ends for maximum emotional impact.
          </div>
        )}
        {paidOffEntries.length > 0 && plantedEntries.length === 0 && (
          <div className="success-card">
            ✅ Great job! You've paid off {paidOffEntries.length} mercy moment(s).
            This creates powerful emotional resonance.
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryVisualization;
