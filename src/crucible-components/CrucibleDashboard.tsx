import React, { useState, useEffect } from 'react';
import { useCrucible } from '../CrucibleContext';
import ProjectSetup from './ProjectSetup';
import StrandMapping from './StrandMapping';
import BeatStructure from './BeatStructure';
import ForgePoints from './ForgePoints';
import PlanningDocuments from './PlanningDocuments';
import CharacterManagement from './CharacterManagement';
import MercyEngine from './MercyEngine';
import ChapterOutline from './ChapterOutline';
import ProjectExport from './ProjectExport';
import StoryVisualization from './StoryVisualization';
import SaveIndicator from './SaveIndicator';
import ConsistencyChecker from './ConsistencyChecker';
import QuickNavigation from './QuickNavigation';
import WordGoalTracker from './WordGoalTracker';

type CrucibleView =
  | 'overview'
  | 'strands'
  | 'beats'
  | 'forge-points'
  | 'planning'
  | 'characters'
  | 'mercy'
  | 'chapters'
  | 'word-goals'
  | 'visualizations'
  | 'consistency'
  | 'export';

const CrucibleDashboard: React.FC = () => {
  const { project } = useCrucible();
  const [currentView, setCurrentView] = useState<CrucibleView>('overview');
  const [showQuickNav, setShowQuickNav] = useState(false);

  // Keyboard shortcut for Quick Navigation (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickNav(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickNavNavigate = (view: string, _itemId?: string) => {
    setCurrentView(view as CrucibleView);
    // TODO: If itemId is provided, scroll to or select that item in the view
  };

  if (!project) {
    return <ProjectSetup />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <ProjectOverview />;
      case 'strands':
        return <StrandMapping />;
      case 'beats':
        return <BeatStructure />;
      case 'forge-points':
        return <ForgePoints />;
      case 'planning':
        return <PlanningDocuments />;
      case 'characters':
        return <CharacterManagement />;
      case 'mercy':
        return <MercyEngine />;
      case 'chapters':
        return <ChapterOutline />;
      case 'word-goals':
        return <WordGoalTracker />;
      case 'visualizations':
        return <StoryVisualization />;
      case 'consistency':
        return <ConsistencyChecker />;
      case 'export':
        return <ProjectExport />;
      default:
        return <ProjectOverview />;
    }
  };

  return (
    <div className="crucible-dashboard">
      <nav className="crucible-nav">
        <div className="nav-header">
          <h2>{project.metadata.title}</h2>
          <SaveIndicator />
        </div>
        <div className="nav-buttons">
          <button
            className={currentView === 'overview' ? 'active' : ''}
            onClick={() => setCurrentView('overview')}
          >
            Overview
          </button>
          <button
            className={currentView === 'strands' ? 'active' : ''}
            onClick={() => setCurrentView('strands')}
          >
            Story Strands
          </button>
          <button
            className={currentView === 'beats' ? 'active' : ''}
            onClick={() => setCurrentView('beats')}
          >
            36 Beats
          </button>
          <button
            className={currentView === 'forge-points' ? 'active' : ''}
            onClick={() => setCurrentView('forge-points')}
          >
            Forge Points
          </button>
          <button
            className={currentView === 'planning' ? 'active' : ''}
            onClick={() => setCurrentView('planning')}
          >
            Planning Docs
          </button>
          <button
            className={currentView === 'characters' ? 'active' : ''}
            onClick={() => setCurrentView('characters')}
          >
            Characters
          </button>
          <button
            className={currentView === 'mercy' ? 'active' : ''}
            onClick={() => setCurrentView('mercy')}
          >
            Mercy Engine
          </button>
          <button
            className={currentView === 'chapters' ? 'active' : ''}
            onClick={() => setCurrentView('chapters')}
          >
            Chapters
          </button>
          <button
            className={currentView === 'word-goals' ? 'active' : ''}
            onClick={() => setCurrentView('word-goals')}
          >
            🎯 Word Goals
          </button>
          <button
            className={currentView === 'visualizations' ? 'active' : ''}
            onClick={() => setCurrentView('visualizations')}
          >
            📊 Visualizations
          </button>
          <button
            className={currentView === 'consistency' ? 'active' : ''}
            onClick={() => setCurrentView('consistency')}
          >
            ✓ Consistency
          </button>
          <button
            className={currentView === 'export' ? 'active' : ''}
            onClick={() => setCurrentView('export')}
          >
            Export/Backup
          </button>
        </div>
      </nav>
      <div className="crucible-content">{renderView()}</div>

      {/* Quick Navigation Modal */}
      {showQuickNav && (
        <QuickNavigation
          onNavigate={handleQuickNavNavigate}
          onClose={() => setShowQuickNav(false)}
        />
      )}
    </div>
  );
};

const ProjectOverview: React.FC = () => {
  const { project, updateMetadata, clearProject } = useCrucible();

  if (!project) return null;

  const handleNewProject = () => {
    if (confirm('Are you sure you want to start a new book? This will clear all current project data. Make sure you have exported your work first!')) {
      if (confirm('This action cannot be undone. Are you absolutely sure?')) {
        clearProject();
      }
    }
  };

  const totalWords = project.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  const progress = (totalWords / project.metadata.targetWordCount) * 100;

  const phaseSteps = {
    planning: ['Crucible Thesis', 'Strand Maps', 'Forge Points', 'Planning Documents'],
    outlining: ['Beat Structure', 'Chapter Outlines', 'Scene Breakdown'],
    drafting: ['Chapter Prose', 'Dialogue', 'Descriptions'],
    editing: ['Revision', 'Polish', 'Final Draft']
  };

  // Generate smart suggestions based on project state
  const generateSuggestions = () => {
    const suggestions: Array<{ text: string; action: string; priority: 'high' | 'medium' | 'low' }> = [];

    // Check strands
    const emptyStrands = [];
    if (!project.strandMaps.quest.summary) emptyStrands.push('Quest');
    if (!project.strandMaps.fire.summary) emptyStrands.push('Fire');
    if (!project.strandMaps.constellation.summary) emptyStrands.push('Constellation');
    if (emptyStrands.length > 0) {
      suggestions.push({
        text: `Define your ${emptyStrands.join(', ')} strand${emptyStrands.length > 1 ? 's' : ''}`,
        action: 'Go to Story Strands',
        priority: 'high'
      });
    }

    // Check forge points
    const incompleteForgePoints = project.forgePoints.filter(
      fp => !fp.stakes || !fp.sacrifice || !fp.questConvergence
    );
    if (incompleteForgePoints.length > 0) {
      suggestions.push({
        text: `Complete ${incompleteForgePoints.length} forge point${incompleteForgePoints.length > 1 ? 's' : ''}`,
        action: 'Go to Forge Points',
        priority: 'high'
      });
    }

    // Check beats
    const emptyBeats = project.beats.filter(
      b => !b.questStrand && !b.fireStrand && !b.constellationStrand
    );
    if (emptyBeats.length > 10) {
      suggestions.push({
        text: `${emptyBeats.length} beats need content - try using templates!`,
        action: 'Go to 36 Beats',
        priority: 'medium'
      });
    }

    // Check characters
    if (project.characters.length === 0) {
      suggestions.push({
        text: 'Create your first character',
        action: 'Go to Characters',
        priority: 'high'
      });
    } else {
      const charsWithoutArcs = project.characters.filter(c => !c.arc);
      if (charsWithoutArcs.length > 0) {
        suggestions.push({
          text: `${charsWithoutArcs.length} character${charsWithoutArcs.length > 1 ? 's need' : ' needs'} character arcs`,
          action: 'Go to Characters',
          priority: 'medium'
        });
      }
    }

    // Check chapters
    if (project.metadata.currentPhase === 'outlining' || project.metadata.currentPhase === 'drafting') {
      if (project.chapters.length === 0) {
        suggestions.push({
          text: 'Create your first chapter outline',
          action: 'Go to Chapters',
          priority: 'high'
        });
      } else {
        const chaptersWithoutOutlines = project.chapters.filter(ch => !ch.outline);
        if (chaptersWithoutOutlines.length > 0 && chaptersWithoutOutlines.length < project.chapters.length) {
          suggestions.push({
            text: `Outline ${chaptersWithoutOutlines.length} more chapter${chaptersWithoutOutlines.length > 1 ? 's' : ''}`,
            action: 'Go to Chapters',
            priority: 'medium'
          });
        }

        if (project.metadata.currentPhase === 'drafting') {
          const chaptersWithoutProse = project.chapters.filter(ch => !ch.prose || ch.prose.trim().length === 0);
          if (chaptersWithoutProse.length > 0) {
            suggestions.push({
              text: `Write prose for ${chaptersWithoutProse.length} chapter${chaptersWithoutProse.length > 1 ? 's' : ''}`,
              action: 'Go to Chapters',
              priority: 'high'
            });
          }
        }
      }
    }

    // Check word count goals
    if (!project.metadata.wordGoals && totalWords > 0) {
      suggestions.push({
        text: 'Set daily word count goals to track progress',
        action: 'Go to Word Goals',
        priority: 'low'
      });
    }

    // Check planning docs
    if (project.planningDocs.length === 0 && project.metadata.currentPhase === 'planning') {
      suggestions.push({
        text: 'Create planning documents for world-building and plot notes',
        action: 'Go to Planning Docs',
        priority: 'medium'
      });
    }

    // Check for mercy moments
    if (project.mercyLedger.length === 0) {
      suggestions.push({
        text: 'Add your first mercy moment to create emotional resonance',
        action: 'Go to Mercy Engine',
        priority: 'low'
      });
    }

    // Phase-specific suggestions
    if (project.metadata.currentPhase === 'planning' && emptyStrands.length === 0 && project.forgePoints.every(fp => fp.stakes)) {
      suggestions.push({
        text: 'Planning complete! Consider moving to Outlining phase',
        action: 'Update Phase above',
        priority: 'medium'
      });
    }

    if (progress >= 100 && project.metadata.currentPhase === 'drafting') {
      suggestions.push({
        text: 'Draft complete! Time to move to Editing phase',
        action: 'Update Phase above',
        priority: 'high'
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions.slice(0, 5); // Top 5 suggestions
  };

  const suggestions = generateSuggestions();

  return (
    <div className="project-overview">
      <div className="overview-header">
        <h1>{project.metadata.title}</h1>
        <p className="author">by {project.metadata.author}</p>
        <p className="genre">{project.metadata.genre}</p>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <h3>Current Phase</h3>
          <select
            value={project.metadata.currentPhase}
            onChange={(e) =>
              updateMetadata({ currentPhase: e.target.value as any })
            }
            className="phase-selector"
          >
            <option value="planning">Planning</option>
            <option value="outlining">Outlining</option>
            <option value="drafting">Drafting</option>
            <option value="editing">Editing</option>
          </select>
        </div>

        <div className="stat-card">
          <h3>Word Count</h3>
          <p className="stat-value">
            {totalWords.toLocaleString()} / {project.metadata.targetWordCount.toLocaleString()}
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <h3>Chapters</h3>
          <p className="stat-value">{project.chapters.length}</p>
          <p className="stat-detail">
            {project.chapters.filter(ch => ch.status === 'final').length} final
          </p>
        </div>

        <div className="stat-card">
          <h3>Characters</h3>
          <p className="stat-value">{project.characters.length}</p>
          <p className="stat-detail">
            {project.characters.filter(ch => ch.darkMirror).length} dark mirror
          </p>
        </div>
      </div>

      <div className="overview-premise">
        <h3>Premise</h3>
        <p>{project.metadata.premise || 'No premise defined yet.'}</p>
      </div>

      <div className="overview-theme">
        <h3>Theme</h3>
        <p>{project.metadata.theme || 'No theme defined yet.'}</p>
      </div>

      <div className="phase-checklist">
        <h3>Phase Checklist: {project.metadata.currentPhase}</h3>
        <ul>
          {phaseSteps[project.metadata.currentPhase].map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="quick-stats">
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          <div>
            <strong>Planning Docs:</strong> {project.planningDocs.length}
          </div>
          <div>
            <strong>Forge Points:</strong> {project.forgePoints.filter(fp => fp.stakes).length}/5 defined
          </div>
          <div>
            <strong>Mercy Entries:</strong> {project.mercyLedger.length}
          </div>
          <div>
            <strong>Backups:</strong> {project.backups.length}
          </div>
        </div>
      </div>

      {/* Progress Suggestions */}
      {suggestions.length > 0 && (
        <div className="progress-suggestions">
          <h3>✨ Suggested Next Steps</h3>
          <p className="suggestions-subtitle">
            Based on your current progress, here's what to focus on next:
          </p>
          <div className="suggestions-list">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className={`suggestion-item priority-${suggestion.priority}`}
              >
                <div className="suggestion-icon">
                  {suggestion.priority === 'high' && '🔴'}
                  {suggestion.priority === 'medium' && '🟡'}
                  {suggestion.priority === 'low' && '🟢'}
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-text">{suggestion.text}</div>
                  <div className="suggestion-action">{suggestion.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="danger-zone">
        <h3>Start New Book</h3>
        <p>Clear all current project data and start fresh. Make sure to export your work first!</p>
        <button onClick={handleNewProject} className="danger-btn">
          Start New Book
        </button>
      </div>
    </div>
  );
};

export default CrucibleDashboard;
