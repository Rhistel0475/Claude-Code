import React, { useState } from 'react';
import { useGame } from '../GameContext';

export const NPCInteraction: React.FC = () => {
  const { gameState, setActiveNPC } = useGame();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [conversationLog, setConversationLog] = useState<Array<{ speaker: string; text: string }>>([]);
  const [playerQuestion, setPlayerQuestion] = useState('');

  const activeNPC = gameState.activeNPC
    ? gameState.npcs.find(n => n.id === gameState.activeNPC)
    : null;

  const npcsAtLocation = selectedLocation
    ? gameState.npcs.filter(npc => npc.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    : [];

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setActiveNPC(null);
    setConversationLog([]);
  };

  const handleNPCSelect = (npcId: string) => {
    const npc = gameState.npcs.find(n => n.id === npcId);
    setActiveNPC(npcId);
    setConversationLog([
      { speaker: 'System', text: `You approach ${npc?.name}, the ${npc?.role}.` },
      { speaker: npc?.name || 'NPC', text: getGreeting(npc?.name || '') }
    ]);
  };

  const getGreeting = (npcName: string) => {
    const greetings = [
      `Hello there, traveler. What brings you to see ${npcName}?`,
      `Welcome! How can I help you today?`,
      `Greetings. What do you need?`,
      `Ah, a visitor. What can I do for you?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerQuestion.trim() || !activeNPC) return;

    setConversationLog(prev => [
      ...prev,
      { speaker: 'Player', text: playerQuestion }
    ]);

    const response = generateNPCResponse(playerQuestion, activeNPC);
    setTimeout(() => {
      setConversationLog(prev => [
        ...prev,
        { speaker: activeNPC.name, text: response }
      ]);
    }, 500);

    setPlayerQuestion('');
  };

  const generateNPCResponse = (question: string, npc: typeof activeNPC) => {
    if (!npc) return "...";

    const assignedInfo = gameState.information.filter(info =>
      npc.assignedInformation.includes(info.id)
    );

    const lowerQuestion = question.toLowerCase();
    const keywords = lowerQuestion.split(' ').filter(word => word.length > 3);

    for (const info of assignedInfo) {
      const infoWords = info.title.toLowerCase().split(' ');
      const contentWords = info.content.toLowerCase().split(' ');

      const hasMatch = keywords.some(keyword =>
        infoWords.some(word => word.includes(keyword)) ||
        contentWords.some(word => word.includes(keyword))
      );

      if (hasMatch) {
        return info.content;
      }
    }

    const genericResponses = [
      "I'm not sure about that. Perhaps you could ask me something else?",
      "Hmm, I don't know much about that, I'm afraid.",
      "That's not something I'm familiar with.",
      "I can't help you with that. Is there something else you'd like to know?",
      "Sorry, I don't have any information about that.",
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleEndConversation = () => {
    setActiveNPC(null);
    setConversationLog([]);
  };

  const uniqueLocations = Array.from(new Set(gameState.npcs.map(npc => npc.location)));

  return (
    <div className="npc-interaction">
      <h2>NPC Interaction</h2>

      {!gameState.activeNPC && (
        <>
          <div className="form-group">
            <label>Select Location:</label>
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationSelect(e.target.value)}
              className="select-input"
            >
              <option value="">-- Choose a location --</option>
              {uniqueLocations.map((location, idx) => (
                <option key={idx} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {selectedLocation && npcsAtLocation.length > 0 && (
            <div className="npc-selection">
              <h3>NPCs at this location:</h3>
              <div className="npc-buttons">
                {npcsAtLocation.map(npc => (
                  <button
                    key={npc.id}
                    onClick={() => handleNPCSelect(npc.id)}
                    className="npc-select-btn"
                  >
                    <strong>{npc.name}</strong>
                    <span>{npc.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedLocation && npcsAtLocation.length === 0 && (
            <p className="empty-state">No NPCs found at this location.</p>
          )}
        </>
      )}

      {activeNPC && (
        <div className="conversation-container">
          <div className="conversation-header">
            <div>
              <h3>Speaking with: {activeNPC.name}</h3>
              <p className="npc-role">{activeNPC.role} - {activeNPC.location}</p>
            </div>
            <button onClick={handleEndConversation} className="btn-secondary">
              End Conversation
            </button>
          </div>

          <div className="conversation-log">
            {conversationLog.map((entry, idx) => (
              <div
                key={idx}
                className={`conversation-entry ${entry.speaker === 'Player' ? 'player' : entry.speaker === 'System' ? 'system' : 'npc'}`}
              >
                <strong>{entry.speaker}:</strong> {entry.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleAskQuestion} className="question-form">
            <input
              type="text"
              value={playerQuestion}
              onChange={(e) => setPlayerQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="question-input"
            />
            <button type="submit" className="btn-primary">
              Ask
            </button>
          </form>

          <div className="dm-info">
            <h4>DM Info: {activeNPC.name}'s Knowledge</h4>
            {activeNPC.assignedInformation.length === 0 ? (
              <p className="empty-state">This NPC has no assigned information.</p>
            ) : (
              <ul>
                {activeNPC.assignedInformation.map(infoId => {
                  const info = gameState.information.find(i => i.id === infoId);
                  return info ? (
                    <li key={infoId}>
                      <strong>{info.title}:</strong> {info.content}
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {gameState.npcs.length === 0 && (
        <p className="empty-state">Create some NPCs first to start interactions!</p>
      )}
    </div>
  );
};
