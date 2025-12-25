import React from 'react';
import { useCrucible } from '../CrucibleContext';

const ForgePoints: React.FC = () => {
  const { project, updateForgePoint } = useCrucible();

  if (!project) return null;

  return (
    <div className="forge-points">
      <div className="forge-header">
        <h1>Forge Points</h1>
        <p>
          Five critical convergence moments where all three story strands collide
          at high-stakes junctures
        </p>
      </div>

      <div className="forge-points-list">
        {project.forgePoints.map((forgePoint) => (
          <div key={forgePoint.id} className="forge-point-card">
            <div className="forge-point-header">
              <div className="forge-icon">⚒</div>
              <div className="forge-title-section">
                <h2>{forgePoint.name}</h2>
                <div className="forge-meta">
                  Beat {forgePoint.beatNumber} · {forgePoint.percentagePoint}% through story
                </div>
              </div>
            </div>

            <div className="forge-description">
              <p><em>{forgePoint.description}</em></p>
            </div>

            <div className="forge-fields">
              <div className="forge-field">
                <label>Overall Description</label>
                <textarea
                  value={forgePoint.description}
                  onChange={(e) =>
                    updateForgePoint(forgePoint.id, {
                      description: e.target.value
                    })
                  }
                  placeholder="Describe this convergence moment..."
                  rows={3}
                />
              </div>

              <div className="strand-convergences">
                <div className="forge-field quest-field">
                  <label>Quest Convergence</label>
                  <textarea
                    value={forgePoint.questConvergence}
                    onChange={(e) =>
                      updateForgePoint(forgePoint.id, {
                        questConvergence: e.target.value
                      })
                    }
                    placeholder="How does the external mission reach a critical point?"
                    rows={3}
                  />
                </div>

                <div className="forge-field fire-field">
                  <label>Fire Convergence</label>
                  <textarea
                    value={forgePoint.fireConvergence}
                    onChange={(e) =>
                      updateForgePoint(forgePoint.id, {
                        fireConvergence: e.target.value
                      })
                    }
                    placeholder="How does the internal transformation manifest?"
                    rows={3}
                  />
                </div>

                <div className="forge-field constellation-field">
                  <label>Constellation Convergence</label>
                  <textarea
                    value={forgePoint.constellationConvergence}
                    onChange={(e) =>
                      updateForgePoint(forgePoint.id, {
                        constellationConvergence: e.target.value
                      })
                    }
                    placeholder="How do relationships reach a breaking point?"
                    rows={3}
                  />
                </div>
              </div>

              <div className="forge-field stakes-field">
                <label>Stakes</label>
                <textarea
                  value={forgePoint.stakes}
                  onChange={(e) =>
                    updateForgePoint(forgePoint.id, { stakes: e.target.value })
                  }
                  placeholder="What's at stake? What will be lost if the protagonist fails?"
                  rows={2}
                />
              </div>

              <div className="forge-field sacrifice-field">
                <label>Sacrifice Required</label>
                <textarea
                  value={forgePoint.sacrifice}
                  onChange={(e) =>
                    updateForgePoint(forgePoint.id, {
                      sacrifice: e.target.value
                    })
                  }
                  placeholder="What must the protagonist give up to move forward?"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="forge-tips">
        <h3>Forge Point Guidelines</h3>
        <ul>
          <li>Each forge point should feel inevitable yet surprising</li>
          <li>All three strands must genuinely converge - not just coincide</li>
          <li>The sacrifice should be meaningful and painful</li>
          <li>Stakes should escalate from one forge point to the next</li>
          <li>The Apex Willed Surrender should be the protagonist's choice, not forced</li>
        </ul>
      </div>
    </div>
  );
};

export default ForgePoints;
