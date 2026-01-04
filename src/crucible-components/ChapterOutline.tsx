import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { Chapter } from '../crucibleTypes';
import DistractionFreeMode from './DistractionFreeMode';

const ChapterOutline: React.FC = () => {
  const { project, addChapter, updateChapter, deleteChapter } = useCrucible();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [distractionFreeMode, setDistractionFreeMode] = useState(false);

  if (!project) return null;

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      number: parseInt(formData.get('number') as string),
      title: formData.get('title') as string,
      wordCount: 0,
      targetWordCount: parseInt(formData.get('targetWordCount') as string),
      beats: [],
      outline: '',
      prose: '',
      status: 'outlined',
      notes: ''
    };

    addChapter(newChapter);
    setShowAddForm(false);
    setSelectedChapter(newChapter.id);
    form.reset();
  };

  const selectedCh = project.chapters.find(c => c.id === selectedChapter);

  const statusColors = {
    outlined: '#5bc0de',
    drafting: '#f0ad4e',
    drafted: '#5cb85c',
    revised: '#337ab7',
    final: '#292b2c'
  };

  return (
    <div className="chapter-outline">
      <div className="chapter-sidebar">
        <div className="sidebar-header">
          <h2>Chapters</h2>
          <button onClick={() => setShowAddForm(true)} className="add-btn">
            + Add Chapter
          </button>
        </div>

        <div className="chapter-stats">
          <div>Total: {project.chapters.length}</div>
          <div>
            Words: {project.chapters.reduce((sum, ch) => sum + ch.wordCount, 0).toLocaleString()}
          </div>
        </div>

        <div className="chapter-list">
          {project.chapters.map(chapter => (
            <div
              key={chapter.id}
              className={`chapter-item ${selectedChapter === chapter.id ? 'active' : ''}`}
              onClick={() => setSelectedChapter(chapter.id)}
            >
              <div className="chapter-number">Ch {chapter.number}</div>
              <div className="chapter-info">
                <div className="chapter-title">{chapter.title || 'Untitled'}</div>
                <div className="chapter-meta">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: statusColors[chapter.status] }}
                  >
                    {chapter.status}
                  </span>
                  <span className="word-count">
                    {chapter.wordCount}/{chapter.targetWordCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chapter-content">
        {showAddForm && (
          <div className="add-chapter-form">
            <h3>Add New Chapter</h3>
            <form onSubmit={handleAddChapter}>
              <div className="form-group">
                <label>Chapter Number *</label>
                <input
                  type="number"
                  name="number"
                  min="1"
                  defaultValue={project.chapters.length + 1}
                  required
                />
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" required />
              </div>

              <div className="form-group">
                <label>Target Word Count</label>
                <input
                  type="number"
                  name="targetWordCount"
                  defaultValue="3000"
                  min="500"
                  step="100"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  Add Chapter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedCh && !showAddForm && (
          <div className="chapter-details">
            <div className="chapter-header">
              <div>
                <h2>
                  Chapter {selectedCh.number}: {selectedCh.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Delete Chapter ${selectedCh.number}?`)) {
                    deleteChapter(selectedCh.id);
                    setSelectedChapter(null);
                  }
                }}
                className="delete-btn"
              >
                Delete
              </button>
            </div>

            <div className="chapter-field">
              <label>Title</label>
              <input
                type="text"
                value={selectedCh.title}
                onChange={(e) =>
                  updateChapter(selectedCh.id, { title: e.target.value })
                }
              />
            </div>

            <div className="chapter-field">
              <label>Status</label>
              <select
                value={selectedCh.status}
                onChange={(e) =>
                  updateChapter(selectedCh.id, { status: e.target.value as any })
                }
              >
                <option value="outlined">Outlined</option>
                <option value="drafting">Drafting</option>
                <option value="drafted">Drafted</option>
                <option value="revised">Revised</option>
                <option value="final">Final</option>
              </select>
            </div>

            <div className="word-count-section">
              <div className="chapter-field inline">
                <label>Current Word Count</label>
                <input
                  type="number"
                  value={selectedCh.wordCount}
                  onChange={(e) =>
                    updateChapter(selectedCh.id, {
                      wordCount: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>

              <div className="chapter-field inline">
                <label>Target Word Count</label>
                <input
                  type="number"
                  value={selectedCh.targetWordCount}
                  onChange={(e) =>
                    updateChapter(selectedCh.id, {
                      targetWordCount: parseInt(e.target.value) || 3000
                    })
                  }
                />
              </div>

              <div className="progress-indicator">
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(
                      (selectedCh.wordCount / selectedCh.targetWordCount) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>

            <div className="chapter-field">
              <label>Outline</label>
              <textarea
                value={selectedCh.outline}
                onChange={(e) =>
                  updateChapter(selectedCh.id, { outline: e.target.value })
                }
                placeholder="Detailed chapter outline..."
                rows={8}
              />
            </div>

            <div className="chapter-field">
              <div className="field-header-with-action">
                <label>Prose Draft</label>
                <button
                  className="focus-mode-btn"
                  onClick={() => setDistractionFreeMode(true)}
                  title="Enter Distraction-Free Writing Mode"
                >
                  🎯 Focus Mode
                </button>
              </div>
              <textarea
                value={selectedCh.prose}
                onChange={(e) => {
                  const newProse = e.target.value;
                  const wordCount = newProse.trim().split(/\s+/).filter(w => w.length > 0).length;
                  updateChapter(selectedCh.id, {
                    prose: newProse,
                    wordCount
                  });
                }}
                placeholder="Write your chapter prose here..."
                rows={15}
                className="prose-editor"
              />
            </div>

            <div className="chapter-field">
              <label>Notes</label>
              <textarea
                value={selectedCh.notes}
                onChange={(e) =>
                  updateChapter(selectedCh.id, { notes: e.target.value })
                }
                placeholder="Chapter notes, reminders, research..."
                rows={4}
              />
            </div>
          </div>
        )}

        {!selectedCh && !showAddForm && (
          <div className="no-chapter-selected">
            <h3>No Chapter Selected</h3>
            <p>Select a chapter from the sidebar or add a new one.</p>
            <div className="chapter-tips">
              <h4>Chapter Writing Tips:</h4>
              <ul>
                <li>Target 3,000-4,000 words per chapter for epic fantasy</li>
                <li>Each chapter should advance at least one story strand</li>
                <li>Outline thoroughly before drafting prose</li>
                <li>Reference your beat structure while writing</li>
                <li>Track which beats each chapter covers</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Distraction-Free Mode */}
      {distractionFreeMode && selectedCh && (
        <DistractionFreeMode
          chapter={selectedCh}
          onClose={() => setDistractionFreeMode(false)}
        />
      )}
    </div>
  );
};

export default ChapterOutline;
