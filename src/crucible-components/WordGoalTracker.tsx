import React, { useState, useMemo } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { WordGoalTracking } from '../crucibleTypes';

const WordGoalTracker: React.FC = () => {
  const { project, updateMetadata } = useCrucible();
  const [editingGoals, setEditingGoals] = useState(false);
  const [tempDailyGoal, setTempDailyGoal] = useState(500);
  const [tempWeeklyGoal, setTempWeeklyGoal] = useState(3500);

  if (!project) return null;

  // Initialize word goals if not set
  const wordGoals: WordGoalTracking = project.metadata.wordGoals || {
    dailyGoal: 500,
    weeklyGoal: 3500,
    currentStreak: 0,
    longestStreak: 0,
    lastWriteDate: '',
    writingHistory: []
  };

  // Calculate today's word count
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = wordGoals.writingHistory.find(entry => entry.date === today);
  const todayWords = todayEntry?.wordsWritten || 0;

  // Calculate this week's word count
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const thisWeekWords = wordGoals.writingHistory
    .filter(entry => entry.date >= weekStartStr)
    .reduce((sum, entry) => sum + entry.wordsWritten, 0);

  // Calculate streak
  const calculateStreak = (): number => {
    if (wordGoals.writingHistory.length === 0) return 0;

    const sortedHistory = [...wordGoals.writingHistory].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedHistory.length; i++) {
      const entryDate = new Date(sortedHistory[i].date);
      entryDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === expectedDate.getTime() && sortedHistory[i].wordsWritten > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  // Progress percentages
  const dailyProgress = Math.min((todayWords / wordGoals.dailyGoal) * 100, 100);
  const weeklyProgress = Math.min((thisWeekWords / wordGoals.weeklyGoal) * 100, 100);

  // Last 30 days for calendar view
  const last30Days = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = wordGoals.writingHistory.find(e => e.date === dateStr);
      days.push({
        date: dateStr,
        dayOfWeek: date.getDay(),
        wordsWritten: entry?.wordsWritten || 0,
        isToday: dateStr === today
      });
    }
    return days;
  }, [wordGoals.writingHistory, today]);

  const handleSaveGoals = () => {
    const updatedGoals: WordGoalTracking = {
      ...wordGoals,
      dailyGoal: tempDailyGoal,
      weeklyGoal: tempWeeklyGoal
    };

    updateMetadata({ wordGoals: updatedGoals });
    setEditingGoals(false);
  };

  const handleStartEditing = () => {
    setTempDailyGoal(wordGoals.dailyGoal);
    setTempWeeklyGoal(wordGoals.weeklyGoal);
    setEditingGoals(true);
  };

  const getIntensityClass = (words: number): string => {
    if (words === 0) return 'intensity-0';
    if (words < wordGoals.dailyGoal * 0.25) return 'intensity-1';
    if (words < wordGoals.dailyGoal * 0.5) return 'intensity-2';
    if (words < wordGoals.dailyGoal * 0.75) return 'intensity-3';
    if (words < wordGoals.dailyGoal) return 'intensity-4';
    return 'intensity-5';
  };

  return (
    <div className="word-goal-tracker">
      <div className="tracker-header">
        <h1>Word Count Goals & Tracking</h1>
        <p className="tracker-subtitle">Stay motivated with daily goals and streaks</p>
      </div>

      {/* Goal Settings */}
      <div className="goal-settings-card">
        <div className="card-header">
          <h2>Your Goals</h2>
          {!editingGoals && (
            <button className="edit-btn" onClick={handleStartEditing}>
              ✏️ Edit Goals
            </button>
          )}
        </div>

        {editingGoals ? (
          <div className="goal-editor">
            <div className="goal-input-group">
              <label>Daily Word Goal:</label>
              <input
                type="number"
                value={tempDailyGoal}
                onChange={(e) => setTempDailyGoal(Number(e.target.value))}
                min="0"
                step="100"
              />
              <span className="input-hint">words/day</span>
            </div>

            <div className="goal-input-group">
              <label>Weekly Word Goal:</label>
              <input
                type="number"
                value={tempWeeklyGoal}
                onChange={(e) => setTempWeeklyGoal(Number(e.target.value))}
                min="0"
                step="500"
              />
              <span className="input-hint">words/week</span>
            </div>

            <div className="goal-actions">
              <button className="save-btn" onClick={handleSaveGoals}>
                Save Goals
              </button>
              <button className="cancel-btn" onClick={() => setEditingGoals(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="goal-display">
            <div className="goal-item">
              <span className="goal-label">Daily Goal:</span>
              <span className="goal-value">{wordGoals.dailyGoal.toLocaleString()} words</span>
            </div>
            <div className="goal-item">
              <span className="goal-label">Weekly Goal:</span>
              <span className="goal-value">{wordGoals.weeklyGoal.toLocaleString()} words</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Cards */}
      <div className="progress-cards">
        <div className="progress-card daily">
          <h3>Today's Progress</h3>
          <div className="progress-stats">
            <div className="stat-main">
              {todayWords.toLocaleString()} / {wordGoals.dailyGoal.toLocaleString()}
            </div>
            <div className="stat-label">words written</div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill daily-fill"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
          <div className="progress-percentage">{Math.round(dailyProgress)}% complete</div>
        </div>

        <div className="progress-card weekly">
          <h3>This Week's Progress</h3>
          <div className="progress-stats">
            <div className="stat-main">
              {thisWeekWords.toLocaleString()} / {wordGoals.weeklyGoal.toLocaleString()}
            </div>
            <div className="stat-label">words written</div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill weekly-fill"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
          <div className="progress-percentage">{Math.round(weeklyProgress)}% complete</div>
        </div>

        <div className="progress-card streak">
          <h3>Writing Streak</h3>
          <div className="progress-stats">
            <div className="stat-main streak-number">🔥 {currentStreak}</div>
            <div className="stat-label">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </div>
          </div>
          <div className="streak-info">
            <div className="streak-detail">
              <span className="detail-label">Best Streak:</span>
              <span className="detail-value">{wordGoals.longestStreak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Calendar */}
      <div className="writing-calendar-card">
        <h2>Last 30 Days</h2>
        <p className="calendar-subtitle">Each square represents a day of writing</p>

        <div className="calendar-grid">
          {last30Days.map((day) => (
            <div
              key={day.date}
              className={`calendar-day ${getIntensityClass(day.wordsWritten)} ${
                day.isToday ? 'today' : ''
              }`}
              title={`${day.date}: ${day.wordsWritten} words`}
            >
              <div className="day-content">
                {day.isToday && <div className="today-indicator">●</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="calendar-legend">
          <span className="legend-label">Less</span>
          <div className="legend-item intensity-0"></div>
          <div className="legend-item intensity-1"></div>
          <div className="legend-item intensity-2"></div>
          <div className="legend-item intensity-3"></div>
          <div className="legend-item intensity-4"></div>
          <div className="legend-item intensity-5"></div>
          <span className="legend-label">More</span>
        </div>
      </div>

      {/* Tips */}
      <div className="tracker-tips">
        <h3>💡 Tips for Reaching Your Goals</h3>
        <ul>
          <li>Write at the same time every day to build a habit</li>
          <li>Use the Distraction-Free Mode (Focus Mode) to maximize productivity</li>
          <li>Don't break the streak! Even 100 words counts</li>
          <li>Adjust your goals if they're too easy or too hard</li>
          <li>Track prose in the Chapters view to automatically update your daily count</li>
        </ul>
      </div>
    </div>
  );
};

export default WordGoalTracker;
