import { useState } from 'react';
import { GameProvider } from './GameContext';
import { NPCManagement } from './components/NPCManagement';
import { InformationManagement } from './components/InformationManagement';
import { InformationAssignment } from './components/InformationAssignment';
import { NPCInteraction } from './components/NPCInteraction';
import './App.css';

type Tab = 'npcs' | 'information' | 'assignment' | 'interaction';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('npcs');

  return (
    <GameProvider>
      <div className="app">
        <header className="app-header">
          <h1>🎲 TTRPG NPC Manager</h1>
          <p className="subtitle">Dynamic NPC and Story Management for Dungeon Masters</p>
        </header>

        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'npcs' ? 'active' : ''}`}
            onClick={() => setActiveTab('npcs')}
          >
            NPC Roster
          </button>
          <button
            className={`tab ${activeTab === 'information' ? 'active' : ''}`}
            onClick={() => setActiveTab('information')}
          >
            Story Information
          </button>
          <button
            className={`tab ${activeTab === 'assignment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignment')}
          >
            Assign Info
          </button>
          <button
            className={`tab ${activeTab === 'interaction' ? 'active' : ''}`}
            onClick={() => setActiveTab('interaction')}
          >
            NPC Interaction
          </button>
        </nav>

        <main className="main-content">
          {activeTab === 'npcs' && <NPCManagement />}
          {activeTab === 'information' && <InformationManagement />}
          {activeTab === 'assignment' && <InformationAssignment />}
          {activeTab === 'interaction' && <NPCInteraction />}
        </main>

        <footer className="app-footer">
          <p>All data is saved locally in your browser</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;
