import { useState } from 'react';
import type { AppMode } from '../App';

interface HamburgerMenuProps {
  currentMode: AppMode;
  onNavigate: (mode: AppMode) => void;
}

export function HamburgerMenu({ currentMode, onNavigate }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (mode: AppMode) => {
    onNavigate(mode);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="hamburger-nav">
        <button
          className="hamburger-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className="nav-title">Rentals Web Apps</div>
      </nav>

      {isOpen && (
        <>
          <div className="menu-overlay" onClick={() => setIsOpen(false)} />
          <div className="menu-drawer">
            <div className="menu-header">
              <h2>Menu</h2>
              <button
                className="menu-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="menu-items">
              <button
                className={`menu-item ${currentMode === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigate('home')}
              >
                <span className="menu-icon">🏠</span>
                <span className="menu-label">Home</span>
              </button>

              <button
                className={`menu-item ${currentMode === 'ttrpg' ? 'active' : ''}`}
                onClick={() => handleNavigate('ttrpg')}
              >
                <span className="menu-icon">🎲</span>
                <span className="menu-label">TTRPG Manager</span>
              </button>

              <button
                className={`menu-item ${currentMode === 'crucible' ? 'active' : ''}`}
                onClick={() => handleNavigate('crucible')}
              >
                <span className="menu-icon">⚒</span>
                <span className="menu-label">Crucible Writer</span>
              </button>

              <button
                className={`menu-item ${currentMode === 'social' ? 'active' : ''}`}
                onClick={() => handleNavigate('social')}
              >
                <span className="menu-icon">📱</span>
                <span className="menu-label">Post Manager</span>
              </button>
            </div>

            <div className="menu-footer">
              <p>All apps save data locally</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
