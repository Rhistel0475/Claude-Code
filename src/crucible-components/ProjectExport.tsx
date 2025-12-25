import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';

const ProjectExport: React.FC = () => {
  const { project, createBackup, restoreBackup, deleteBackup, exportProject, clearProject } =
    useCrucible();
  const [backupNote, setBackupNote] = useState('');

  if (!project) return null;

  const handleExport = () => {
    const jsonData = exportProject();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.metadata.title.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateBackup = () => {
    if (!backupNote.trim()) {
      alert('Please enter a backup note');
      return;
    }
    createBackup(backupNote);
    setBackupNote('');
  };

  const handleClearProject = () => {
    const confirmation = prompt(
      `Type "${project.metadata.title}" to confirm deletion:`
    );
    if (confirmation === project.metadata.title) {
      clearProject();
    } else {
      alert('Project name does not match. Deletion cancelled.');
    }
  };

  const sortedBackups = [...project.backups].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="project-export">
      <h1>Export & Backup</h1>

      <div className="export-section">
        <h2>Export Project</h2>
        <p>
          Download your entire project as a JSON file. This includes all planning
          documents, chapters, characters, and settings.
        </p>
        <button onClick={handleExport} className="primary-btn">
          Export Project
        </button>
      </div>

      <div className="backup-section">
        <h2>Create Backup</h2>
        <p>
          Create a timestamped backup of your current project state. Backups are
          stored locally in your browser.
        </p>
        <div className="backup-form">
          <input
            type="text"
            value={backupNote}
            onChange={(e) => setBackupNote(e.target.value)}
            placeholder="Backup note (e.g., 'Before major revision')"
            className="backup-input"
          />
          <button onClick={handleCreateBackup} className="primary-btn">
            Create Backup
          </button>
        </div>
      </div>

      <div className="backups-list-section">
        <h2>Backups ({project.backups.length})</h2>
        {sortedBackups.length > 0 ? (
          <div className="backups-list">
            {sortedBackups.map(backup => (
              <div key={backup.id} className="backup-item">
                <div className="backup-info">
                  <div className="backup-timestamp">
                    {new Date(backup.timestamp).toLocaleString()}
                  </div>
                  <div className="backup-note">{backup.note}</div>
                </div>
                <div className="backup-actions">
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          'Restore this backup? Current unsaved changes will be lost.'
                        )
                      ) {
                        restoreBackup(backup.id);
                      }
                    }}
                    className="restore-btn"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this backup?')) {
                        deleteBackup(backup.id);
                      }
                    }}
                    className="delete-btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-backups">No backups created yet.</p>
        )}
      </div>

      <div className="project-stats">
        <h2>Project Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <strong>Total Characters:</strong> {project.characters.length}
          </div>
          <div className="stat-item">
            <strong>Planning Documents:</strong> {project.planningDocs.length}
          </div>
          <div className="stat-item">
            <strong>Chapters:</strong> {project.chapters.length}
          </div>
          <div className="stat-item">
            <strong>Total Words:</strong>{' '}
            {project.chapters
              .reduce((sum, ch) => sum + ch.wordCount, 0)
              .toLocaleString()}
          </div>
          <div className="stat-item">
            <strong>Mercy Entries:</strong> {project.mercyLedger.length}
          </div>
          <div className="stat-item">
            <strong>Forge Points Defined:</strong>{' '}
            {project.forgePoints.filter(fp => fp.stakes).length}/5
          </div>
          <div className="stat-item">
            <strong>Created:</strong>{' '}
            {new Date(project.metadata.createdAt).toLocaleDateString()}
          </div>
          <div className="stat-item">
            <strong>Last Modified:</strong>{' '}
            {new Date(project.metadata.lastModified).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h2>Danger Zone</h2>
        <p>
          Clearing your project will permanently delete all data from local storage.
          Make sure to export your project first!
        </p>
        <button onClick={handleClearProject} className="danger-btn">
          Clear Project
        </button>
      </div>
    </div>
  );
};

export default ProjectExport;
