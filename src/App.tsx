import { useState } from 'react';
import { GameProvider } from './GameContext';
import { CrucibleProvider } from './CrucibleContext';
import { SocialMediaProvider } from './SocialMediaContext';
import { NPCManagement } from './components/NPCManagement';
import { InformationManagement } from './components/InformationManagement';
import { InformationAssignment } from './components/InformationAssignment';
import { NPCInteraction } from './components/NPCInteraction';
import CrucibleDashboard from './crucible-components/CrucibleDashboard';
import { SocialMediaManager } from './components/SocialMediaManager';
import './App.css';
import './Crucible.css';
import './SocialMedia.css';

type Tab = 'npcs' | 'information' | 'assignment' | 'interaction';
type AppMode = 'ttrpg' | 'crucible' | 'social';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('ttrpg');
  const [activeTab, setActiveTab] = useState<Tab>('npcs');

  return (
    <GameProvider>
      <CrucibleProvider>
        <SocialMediaProvider>
          <div className="app">
            {/* Mode Switcher */}
            <div className="mode-switcher">
              <button
                className={`mode-btn ${appMode === 'ttrpg' ? 'active' : ''}`}
                onClick={() => setAppMode('ttrpg')}
              >
                TTRPG
              </button>
              <button
                className={`mode-btn ${appMode === 'crucible' ? 'active' : ''}`}
                onClick={() => setAppMode('crucible')}
              >
                Crucible
              </button>
              <button
                className={`mode-btn ${appMode === 'social' ? 'active' : ''}`}
                onClick={() => setAppMode('social')}
                style={{ backgroundColor: '#ff0000', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                POST MANAGER
              </button>
            </div>

          {appMode === 'ttrpg' && (
            <>
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
            </>
          )}

          {appMode === 'crucible' && <CrucibleDashboard />}

          {appMode === 'social' && <SocialMediaManager />}
          </div>
        </SocialMediaProvider>
      </CrucibleProvider>
    </GameProvider>
  );
}

export default App;
