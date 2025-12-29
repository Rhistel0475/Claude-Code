import type { AppMode } from '../App';

interface HomePageProps {
  onSelectApp: (mode: AppMode) => void;
}

export function HomePage({ onSelectApp }: HomePageProps) {
  return (
    <div className="homepage">
      <div className="homepage-hero">
        <h1 className="homepage-title">Rentals Web Apps</h1>
        <p className="homepage-subtitle">Professional tools for creators and managers</p>
      </div>

      <div className="app-cards">
        <div className="app-card" onClick={() => onSelectApp('ttrpg')}>
          <div className="app-card-icon">🎲</div>
          <h2 className="app-card-title">TTRPG Manager</h2>
          <p className="app-card-description">
            Dynamic NPC and story management for Dungeon Masters.
            Create characters, manage information, and run interactive sessions.
          </p>
          <button className="app-card-button">Launch App →</button>
        </div>

        <div className="app-card" onClick={() => onSelectApp('crucible')}>
          <div className="app-card-icon">⚒</div>
          <h2 className="app-card-title">Crucible Writer</h2>
          <p className="app-card-description">
            Comprehensive story development tool. Build characters, plot threads,
            relationships, and timelines for your narrative projects.
          </p>
          <button className="app-card-button">Launch App →</button>
        </div>

        <div className="app-card" onClick={() => onSelectApp('social')}>
          <div className="app-card-icon">📱</div>
          <h2 className="app-card-title">Post Manager</h2>
          <p className="app-card-description">
            Social media management for e-commerce. Schedule posts, manage campaigns,
            bulk upload content, and track performance across platforms.
          </p>
          <button className="app-card-button">Launch App →</button>
        </div>
      </div>

      <footer className="homepage-footer">
        <p>All data is saved locally in your browser</p>
        <p className="homepage-version">v1.0.0</p>
      </footer>
    </div>
  );
}
