import React, { useState, useEffect, useRef } from 'react';
import { useCrucible } from '../CrucibleContext';

interface QuickNavigationProps {
  onNavigate: (view: string, itemId?: string) => void;
  onClose: () => void;
}

interface NavItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  view: string;
  itemId?: string;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ onNavigate, onClose }) => {
  const { project } = useCrucible();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!project) return null;

  // Build navigation items
  const navItems: NavItem[] = [
    // Views
    { id: 'overview', title: 'Overview', subtitle: 'Project dashboard', category: 'Views', view: 'overview' },
    { id: 'strands', title: 'Story Strands', subtitle: 'Quest, Fire, Constellation', category: 'Views', view: 'strands' },
    { id: 'beats', title: '36 Beats', subtitle: 'Beat structure', category: 'Views', view: 'beats' },
    { id: 'forge-points', title: 'Forge Points', subtitle: '5 convergence moments', category: 'Views', view: 'forge-points' },
    { id: 'planning', title: 'Planning Docs', subtitle: 'Documentation', category: 'Views', view: 'planning' },
    { id: 'characters', title: 'Characters', subtitle: 'Character management', category: 'Views', view: 'characters' },
    { id: 'mercy', title: 'Mercy Engine', subtitle: 'Compassionate acts', category: 'Views', view: 'mercy' },
    { id: 'chapters', title: 'Chapters', subtitle: 'Chapter outlines', category: 'Views', view: 'chapters' },
    { id: 'word-goals', title: 'Word Goals', subtitle: 'Daily & weekly tracking', category: 'Views', view: 'word-goals' },
    { id: 'visualizations', title: 'Visualizations', subtitle: 'Story arc graphs', category: 'Views', view: 'visualizations' },
    { id: 'consistency', title: 'Consistency', subtitle: 'Error checking', category: 'Views', view: 'consistency' },
    { id: 'export', title: 'Export/Backup', subtitle: 'Save & export', category: 'Views', view: 'export' },
  ];

  // Add beats
  project.beats.forEach(beat => {
    navItems.push({
      id: `beat-${beat.number}`,
      title: `Beat ${beat.number}`,
      subtitle: beat.title || `${beat.movement} movement`,
      category: 'Beats',
      view: 'beats',
      itemId: beat.id
    });
  });

  // Add characters
  project.characters.forEach(char => {
    navItems.push({
      id: `char-${char.id}`,
      title: char.name,
      subtitle: char.role || 'Character',
      category: 'Characters',
      view: 'characters',
      itemId: char.id
    });
  });

  // Add chapters
  project.chapters.forEach(chapter => {
    navItems.push({
      id: `chapter-${chapter.id}`,
      title: `Chapter ${chapter.number}: ${chapter.title}`,
      subtitle: `${chapter.wordCount} words`,
      category: 'Chapters',
      view: 'chapters',
      itemId: chapter.id
    });
  });

  // Add forge points
  project.forgePoints.forEach((fp, idx) => {
    navItems.push({
      id: `fp-${fp.id}`,
      title: fp.name,
      subtitle: `Forge Point ${idx + 1} at beat ${fp.beatNumber}`,
      category: 'Forge Points',
      view: 'forge-points',
      itemId: fp.id
    });
  });

  // Filter items
  const filteredItems = searchQuery.trim().length === 0
    ? navItems
    : navItems.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      });

  // Group by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const categories = Object.keys(groupedItems);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          const item = filteredItems[selectedIndex];
          onNavigate(item.view, item.itemId);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems, onClose, onNavigate]);

  // Auto-adjust selected index when filtering
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  let currentIndex = 0;

  return (
    <div className="quick-nav-overlay" onClick={onClose}>
      <div className="quick-nav-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quick-nav-search">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search... (beats, chapters, characters, views)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <kbd className="search-hint">ESC</kbd>
        </div>

        <div className="quick-nav-results">
          {filteredItems.length === 0 ? (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
            </div>
          ) : (
            categories.map(category => (
              <div key={category} className="result-category">
                <div className="category-header">{category}</div>
                {groupedItems[category].map(item => {
                  const itemIndex = currentIndex++;
                  const isSelected = itemIndex === selectedIndex;

                  return (
                    <div
                      key={item.id}
                      className={`result-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        onNavigate(item.view, item.itemId);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                    >
                      <div className="item-title">{item.title}</div>
                      <div className="item-subtitle">{item.subtitle}</div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="quick-nav-footer">
          <div className="footer-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>Enter</kbd> Select</span>
            <span><kbd>ESC</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickNavigation;
