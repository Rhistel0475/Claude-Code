import React, { useState } from 'react';
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

type CrucibleView =
  | 'overview'
  | 'strands'
  | 'beats'
  | 'forge-points'
  | 'planning'
  | 'characters'
  | 'mercy'
  | 'chapters'
  | 'export';

const CrucibleDashboard: React.FC = () => {
  const { project } = useCrucible();
  const [currentView, setCurrentView] = useState<CrucibleView>('overview');

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
      case 'export':
        return <ProjectExport />;
      default:
        return <ProjectOverview />;
    }
  };

  return (
    <div className="crucible-dashboard">
      <nav className="crucible-nav">
        <h2>{project.metadata.title}</h2>
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
            className={currentView === 'export' ? 'active' : ''}
            onClick={() => setCurrentView('export')}
          >
            Export/Backup
          </button>
        </div>
      </nav>
      <div className="crucible-content">{renderView()}</div>
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
