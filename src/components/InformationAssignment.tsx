import React, { useState } from 'react';
import { useGame } from '../GameContext';

export const InformationAssignment: React.FC = () => {
  const { gameState, assignInformationToNPC, unassignInformationFromNPC } = useGame();
  const [selectedNPC, setSelectedNPC] = useState<string>('');

  const availableInfo = gameState.information.filter(
    info => !selectedNPC || !gameState.npcs.find(n => n.id === selectedNPC)?.assignedInformation.includes(info.id)
  );

  const assignedInfo = selectedNPC
    ? gameState.information.filter(info =>
        gameState.npcs.find(n => n.id === selectedNPC)?.assignedInformation.includes(info.id)
      )
    : [];

  const handleAssign = (infoId: string) => {
    if (selectedNPC) {
      assignInformationToNPC(selectedNPC, infoId);
    }
  };

  const handleUnassign = (infoId: string) => {
    if (selectedNPC) {
      unassignInformationFromNPC(selectedNPC, infoId);
    }
  };

  return (
    <div className="information-assignment">
      <h2>Assign Information to NPCs</h2>

      <div className="form-group">
        <label>Select NPC:</label>
        <select
          value={selectedNPC}
          onChange={(e) => setSelectedNPC(e.target.value)}
          className="select-input"
        >
          <option value="">-- Choose an NPC --</option>
          {gameState.npcs.map(npc => (
            <option key={npc.id} value={npc.id}>
              {npc.name} ({npc.role})
            </option>
          ))}
        </select>
      </div>

      {selectedNPC && (
        <div className="assignment-panels">
          <div className="panel">
            <h3>Assigned Information</h3>
            {assignedInfo.length === 0 ? (
              <p className="empty-state">No information assigned yet.</p>
            ) : (
              <div className="info-items">
                {assignedInfo.map(info => (
                  <div key={info.id} className="info-item">
                    <div className="info-item-content">
                      <h4>{info.title}</h4>
                      <p>{info.content}</p>
                    </div>
                    <button
                      onClick={() => handleUnassign(info.id)}
                      className="btn-small btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <h3>Available Information</h3>
            {availableInfo.length === 0 ? (
              <p className="empty-state">All information has been assigned to this NPC.</p>
            ) : (
              <div className="info-items">
                {availableInfo.map(info => (
                  <div key={info.id} className="info-item">
                    <div className="info-item-content">
                      <h4>{info.title}</h4>
                      <p>{info.content}</p>
                    </div>
                    <button
                      onClick={() => handleAssign(info.id)}
                      className="btn-small btn-primary"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedNPC && gameState.npcs.length === 0 && (
        <p className="empty-state">Create some NPCs first to assign information!</p>
      )}
    </div>
  );
};
