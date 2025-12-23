import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { ProjectMetadata } from '../crucibleTypes';

const ProjectSetup: React.FC = () => {
  const { createNewProject, importProject } = useCrucible();
  const [isImporting, setIsImporting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Epic Fantasy',
    targetWordCount: 120000,
    premise: '',
    theme: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metadata: ProjectMetadata = {
      ...formData,
      createdAt: new Date(),
      lastModified: new Date(),
      currentPhase: 'planning'
    };
    createNewProject(metadata);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        importProject(jsonData);
      } catch (error) {
        alert('Error importing project: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  if (isImporting) {
    return (
      <div className="project-setup">
        <div className="setup-card">
          <h1>Import Existing Project</h1>
          <p>Select a Crucible project JSON file to import:</p>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="file-input"
          />
          <button onClick={() => setIsImporting(false)} className="secondary-btn">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-setup">
      <div className="setup-card">
        <h1>The Crucible Writing System</h1>
        <p className="setup-subtitle">
          A 36-beat narrative framework for fantasy authors
        </p>

        <div className="setup-actions">
          <div className="action-card">
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="The Quest of the Forgotten Realm"
                  required
                />
              </div>

              <div className="form-group">
                <label>Author Name *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                >
                  <option>Epic Fantasy</option>
                  <option>Urban Fantasy</option>
                  <option>Dark Fantasy</option>
                  <option>High Fantasy</option>
                  <option>Sword and Sorcery</option>
                  <option>Grimdark</option>
                  <option>Other Fantasy</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Word Count</label>
                <input
                  type="number"
                  value={formData.targetWordCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetWordCount: parseInt(e.target.value)
                    })
                  }
                  min="50000"
                  max="300000"
                  step="10000"
                />
                <small>Recommended: 120,000-180,000 for epic fantasy</small>
              </div>

              <div className="form-group">
                <label>Story Premise</label>
                <textarea
                  value={formData.premise}
                  onChange={(e) =>
                    setFormData({ ...formData, premise: e.target.value })
                  }
                  placeholder="A brief description of your story's core concept..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Central Theme</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) =>
                    setFormData({ ...formData, theme: e.target.value })
                  }
                  placeholder="e.g., The cost of power, Redemption through sacrifice"
                />
              </div>

              <button type="submit" className="primary-btn">
                Create Project
              </button>
            </form>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="action-card">
            <h2>Import Project</h2>
            <p>Continue working on an existing Crucible project.</p>
            <button
              onClick={() => setIsImporting(true)}
              className="secondary-btn"
            >
              Import from File
            </button>
          </div>
        </div>

        <div className="setup-info">
          <h3>About The Crucible System</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>Three Story Strands</h4>
              <p>
                <strong>Quest:</strong> External mission<br />
                <strong>Fire:</strong> Internal transformation<br />
                <strong>Constellation:</strong> Relationships
              </p>
            </div>
            <div className="info-item">
              <h4>36 Narrative Beats</h4>
              <p>
                Structured across six movements from ignition to resolution,
                ensuring consistent pacing and development.
              </p>
            </div>
            <div className="info-item">
              <h4>5 Forge Points</h4>
              <p>
                Critical convergence moments where all three strands collide
                at high-stakes junctures.
              </p>
            </div>
            <div className="info-item">
              <h4>Mercy Engine</h4>
              <p>
                Track compassionate acts planted early for powerful payoff
                in your story's climax.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetup;
