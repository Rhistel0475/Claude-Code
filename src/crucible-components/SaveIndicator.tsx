import React, { useState, useEffect } from 'react';
import { useCrucible } from '../CrucibleContext';

const SaveIndicator: React.FC = () => {
  const { saveStatus, lastSaved } = useCrucible();
  const [timeAgo, setTimeAgo] = useState<string>('');

  // Update "time ago" display every 10 seconds
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastSaved) {
        setTimeAgo('Never');
        return;
      }

      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 10) {
        setTimeAgo('Just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds} seconds ago`);
      } else if (minutes < 60) {
        setTimeAgo(`${minutes} minute${minutes !== 1 ? 's' : ''} ago`);
      } else {
        setTimeAgo(`${hours} hour${hours !== 1 ? 's' : ''} ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastSaved]);

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="save-icon saving">
            <svg className="spinner" width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        );
      case 'saved':
        return <span className="save-icon saved">✓</span>;
      case 'error':
        return <span className="save-icon error">!</span>;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return `Saved ${timeAgo}`;
      case 'error':
        return 'Error saving';
      default:
        return '';
    }
  };

  return (
    <div className={`save-indicator ${saveStatus}`}>
      {getStatusIcon()}
      <span className="save-text">{getStatusText()}</span>
    </div>
  );
};

export default SaveIndicator;
