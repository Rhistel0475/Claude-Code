import { useSocialMedia } from '../SocialMediaContext';
import type { SocialPlatform } from '../socialMediaTypes';

const platformInfo = {
  facebook: {
    icon: '📘',
    name: 'Facebook',
    tips: [
      'Best posting times: 1-3 PM on weekdays',
      'Ideal post length: 40-80 characters for maximum engagement',
      'Use images or videos for 2x more engagement',
      'Ask questions to boost comments',
    ],
  },
  instagram: {
    icon: '📷',
    name: 'Instagram',
    tips: [
      'Best posting times: 11 AM - 1 PM, 7-9 PM',
      'Use 9-11 hashtags for optimal reach',
      'Square images (1080x1080) or vertical (1080x1350)',
      'Stories disappear after 24 hours - use highlights!',
    ],
  },
  twitter: {
    icon: '🐦',
    name: 'Twitter',
    tips: [
      'Best posting times: 8-10 AM, 12 PM, 5-6 PM',
      'Tweet 3-5 times per day for best results',
      'Use 1-2 hashtags maximum',
      'Add images for 150% more retweets',
    ],
  },
  linkedin: {
    icon: '💼',
    name: 'LinkedIn',
    tips: [
      'Best posting times: Tuesday-Thursday, 10-11 AM',
      'Professional tone and industry insights perform best',
      'Posts with 8+ lines get more engagement',
      'Ask thought-provoking questions',
    ],
  },
  pinterest: {
    icon: '📌',
    name: 'Pinterest',
    tips: [
      'Best posting times: 2-4 PM, 8-11 PM',
      'Vertical images (2:3 ratio) perform best',
      'Include keyword-rich descriptions',
      'Pin consistently - 5-30 pins per day',
    ],
  },
  tiktok: {
    icon: '🎵',
    name: 'TikTok',
    tips: [
      'Best posting times: 6-10 AM, 7-11 PM',
      'Videos between 21-34 seconds perform best',
      'Use trending sounds and hashtags',
      'Post 1-4 times per day for growth',
    ],
  },
};

export function PlatformSettings() {
  const { state, updatePlatformConfig } = useSocialMedia();

  const handleToggleEnabled = (platform: SocialPlatform) => {
    const config = state.platformConfigs.find(pc => pc.platform === platform);
    if (config) {
      updatePlatformConfig(platform, { enabled: !config.enabled });
    }
  };

  const handleAccountNameChange = (platform: SocialPlatform, accountName: string) => {
    updatePlatformConfig(platform, { accountName });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `social-media-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (confirm('This will replace all your current data. Continue?')) {
              localStorage.setItem('socialmedia-data', JSON.stringify(data));
              window.location.reload();
            }
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="platform-settings">
      <div className="settings-section">
        <h2>Platform Settings</h2>
        <p>Configure your social media accounts and preferences</p>
      </div>

      <div className="platforms-config">
        {state.platformConfigs.map(config => {
          const info = platformInfo[config.platform];
          return (
            <div key={config.platform} className="platform-config-card">
              <div className="platform-config-header">
                <div className="platform-title">
                  <span className="platform-icon">{info.icon}</span>
                  <h3>{info.name}</h3>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => handleToggleEnabled(config.platform)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="platform-config-content">
                <div className="form-group">
                  <label>Account Name / Handle</label>
                  <input
                    type="text"
                    value={config.accountName}
                    onChange={e => handleAccountNameChange(config.platform, e.target.value)}
                    placeholder={`@your${config.platform}handle`}
                    disabled={!config.enabled}
                  />
                </div>

                <div className="platform-limits">
                  <span>📝 Character Limit: {config.characterLimit?.toLocaleString()}</span>
                  {config.imageRequirements && (
                    <span>🖼️ {config.imageRequirements}</span>
                  )}
                </div>

                <div className="platform-tips">
                  <h4>💡 Best Practices</h4>
                  <ul>
                    {info.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="settings-section data-management">
        <h2>Data Management</h2>
        <div className="data-actions">
          <button onClick={handleExportData} className="btn-secondary">
            📥 Export All Data
          </button>
          <button onClick={handleImportData} className="btn-secondary">
            📤 Import Data
          </button>
          <button
            onClick={() => {
              if (confirm('This will delete ALL your data. This cannot be undone!')) {
                localStorage.removeItem('socialmedia-data');
                window.location.reload();
              }
            }}
            className="btn-danger"
          >
            🗑️ Clear All Data
          </button>
        </div>
        <p className="data-note">
          💾 All data is stored locally in your browser. Export regularly to backup your work!
        </p>
      </div>
    </div>
  );
}
