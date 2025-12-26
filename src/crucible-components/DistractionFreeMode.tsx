import React, { useState, useEffect, useRef } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { Chapter } from '../crucibleTypes';

interface DistractionFreeModeProps {
  chapter: Chapter;
  onClose: () => void;
}

const DistractionFreeMode: React.FC<DistractionFreeModeProps> = ({ chapter, onClose }) => {
  const { updateChapter } = useCrucible();
  const [prose, setProse] = useState(chapter.prose);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [maxWidth, setMaxWidth] = useState(700);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pomodoroIntervalRef = useRef<number | null>(null);

  // Word count
  const wordCount = prose.trim().split(/\s+/).filter(word => word.length > 0).length;
  const sessionStartWords = useRef(chapter.prose.trim().split(/\s+/).filter(w => w.length > 0).length);
  const wordsWritten = wordCount - sessionStartWords.current;

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      if (prose !== chapter.prose) {
        updateChapter(chapter.id, {
          prose,
          wordCount: wordCount
        });
      }
    };
  }, [prose, chapter.id, chapter.prose, updateChapter, wordCount]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to exit
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else {
          handleSave();
          onClose();
        }
      }

      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // Ctrl/Cmd + , to toggle settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(!showSettings);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, onClose, prose, chapter.id]);

  // Pomodoro timer
  useEffect(() => {
    if (pomodoroActive) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (pomodoroMinutes === 0) {
              // Timer complete
              setPomodoroActive(false);
              playNotificationSound();
              alert('Pomodoro complete! Take a break.');
              return 0;
            } else {
              setPomodoroMinutes((prev) => prev - 1);
              return 59;
            }
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);
    } else {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    }

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    };
  }, [pomodoroActive, pomodoroMinutes]);

  const handleSave = () => {
    updateChapter(chapter.id, {
      prose,
      wordCount: wordCount
    });
  };

  const playNotificationSound = () => {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const togglePomodoro = () => {
    if (pomodoroActive) {
      setPomodoroActive(false);
    } else {
      setPomodoroMinutes(25);
      setPomodoroSeconds(0);
      setPomodoroActive(true);
    }
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  return (
    <div className="distraction-free-mode">
      {/* Header Bar */}
      <div className="dfm-header">
        <div className="dfm-header-left">
          <h3 className="dfm-chapter-title">{chapter.title}</h3>
        </div>

        <div className="dfm-header-center">
          <div className="dfm-stats">
            <span className="stat">{wordCount} words</span>
            {wordsWritten > 0 && (
              <span className="stat session-words">+{wordsWritten} today</span>
            )}
          </div>
        </div>

        <div className="dfm-header-right">
          {/* Pomodoro Timer */}
          <div className="pomodoro-timer">
            <button
              className={`timer-display ${pomodoroActive ? 'active' : ''}`}
              onClick={togglePomodoro}
              title="Toggle Pomodoro Timer"
            >
              🍅 {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
            </button>
            {pomodoroActive && (
              <button className="timer-reset" onClick={resetPomodoro} title="Reset Timer">
                ↻
              </button>
            )}
          </div>

          <button
            className="dfm-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings (Ctrl/Cmd + ,)"
          >
            ⚙️
          </button>

          <button
            className="dfm-close-btn"
            onClick={() => {
              handleSave();
              onClose();
            }}
            title="Exit (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="dfm-settings-panel">
          <h4>Display Settings</h4>

          <div className="setting-group">
            <label>
              Font Size: {fontSize}px
              <input
                type="range"
                min="14"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="setting-group">
            <label>
              Line Height: {lineHeight}
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="setting-group">
            <label>
              Max Width: {maxWidth}px
              <input
                type="range"
                min="500"
                max="1200"
                step="50"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="setting-info">
            <p><strong>Keyboard Shortcuts:</strong></p>
            <ul>
              <li><kbd>Esc</kbd> - Exit focus mode</li>
              <li><kbd>Ctrl/Cmd + S</kbd> - Save</li>
              <li><kbd>Ctrl/Cmd + ,</kbd> - Toggle settings</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="dfm-editor-container">
        <textarea
          ref={textareaRef}
          className="dfm-editor"
          value={prose}
          onChange={(e) => setProse(e.target.value)}
          placeholder="Start writing..."
          autoFocus
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            maxWidth: `${maxWidth}px`,
          }}
        />
      </div>

      {/* Footer hint */}
      <div className="dfm-footer">
        <span className="hint">Press <kbd>Esc</kbd> to exit · <kbd>Ctrl/Cmd + S</kbd> to save</span>
      </div>
    </div>
  );
};

export default DistractionFreeMode;
