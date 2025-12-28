import { useState } from 'react';
import { useSocialMedia } from '../SocialMediaContext';
import type { PostTemplate, SocialPlatform } from '../socialMediaTypes';

interface BulkPost {
  name: string;
  platform: SocialPlatform;
  content: string;
  hashtags: string;
  imageUrl?: string;
  link?: string;
  scheduledDate?: string;
}

export function BulkUploader() {
  const { addTemplate } = useSocialMedia();
  const [bulkPosts, setBulkPosts] = useState<BulkPost[]>([]);
  const [csvText, setCsvText] = useState('');
  const [autoSchedule, setAutoSchedule] = useState({
    enabled: false,
    startDate: '',
    endDate: '',
    frequency: 'daily' as 'daily' | 'twice-daily' | 'every-other-day',
    platforms: [] as SocialPlatform[],
  });

  const handleCSVImport = () => {
    try {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      const posts: BulkPost[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const post: BulkPost = {
          name: values[headers.indexOf('name')] || `Post ${i}`,
          platform: (values[headers.indexOf('platform')] || 'facebook') as SocialPlatform,
          content: values[headers.indexOf('content')] || '',
          hashtags: values[headers.indexOf('hashtags')] || '',
          imageUrl: values[headers.indexOf('imageUrl')],
          link: values[headers.indexOf('link')],
          scheduledDate: values[headers.indexOf('scheduledDate')],
        };
        posts.push(post);
      }

      setBulkPosts(posts);
      alert(`Successfully imported ${posts.length} posts!`);
    } catch (error) {
      alert('Error parsing CSV. Please check the format.');
    }
  };

  const handleQuickCreate = (count: number, template: string) => {
    const posts: BulkPost[] = [];
    for (let i = 1; i <= count; i++) {
      posts.push({
        name: `Valentine's Post ${i}`,
        platform: 'facebook',
        content: template.replace('[NUMBER]', i.toString()),
        hashtags: '#ValentinesDay #DadJokes #GiftsForDad',
      });
    }
    setBulkPosts(posts);
  };

  const generateScheduleDates = () => {
    if (!autoSchedule.startDate || !autoSchedule.endDate) {
      alert('Please set start and end dates');
      return [];
    }

    const start = new Date(autoSchedule.startDate);
    const end = new Date(autoSchedule.endDate);
    const dates: Date[] = [];

    let current = new Date(start);

    while (current <= end) {
      // Add morning post (9 AM)
      const morning = new Date(current);
      morning.setHours(9, 0, 0, 0);
      dates.push(new Date(morning));

      // Add evening post if twice-daily (6 PM)
      if (autoSchedule.frequency === 'twice-daily') {
        const evening = new Date(current);
        evening.setHours(18, 0, 0, 0);
        dates.push(new Date(evening));
      }

      // Increment date
      if (autoSchedule.frequency === 'every-other-day') {
        current.setDate(current.getDate() + 2);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    return dates;
  };

  const handleBulkUpload = () => {
    if (bulkPosts.length === 0) {
      alert('No posts to upload');
      return;
    }

    let scheduleDates: Date[] = [];
    if (autoSchedule.enabled) {
      scheduleDates = generateScheduleDates();
      if (scheduleDates.length === 0) return;
    }

    bulkPosts.forEach((post, index) => {
      const template: PostTemplate = {
        id: Date.now().toString() + Math.random() + index,
        name: post.name,
        platform: post.platform,
        content: post.content,
        hashtags: post.hashtags ? post.hashtags.split(',').map(h => h.trim()) : [],
        imageUrl: post.imageUrl,
        link: post.link,
        scheduledDate: autoSchedule.enabled && scheduleDates[index % scheduleDates.length]
          ? scheduleDates[index % scheduleDates.length].toISOString().slice(0, 16)
          : post.scheduledDate,
        status: 'draft',
      };
      addTemplate(template);
    });

    alert(`Successfully uploaded ${bulkPosts.length} posts!`);
    setBulkPosts([]);
    setCsvText('');
  };

  const downloadTemplate = () => {
    const csv = `name,platform,content,hashtags,imageUrl,link,scheduledDate
Valentine's Day Sale,facebook,Check out our Valentine's Day collection! Perfect gifts for dads.,#ValentinesDay #DadGifts,https://example.com/image.jpg,https://yourstore.com/valentines,2025-02-01T09:00
Father's Day Preview,instagram,Early bird gets the dad joke! Father's Day collection coming soon.,#FathersDay #DadJokes,https://example.com/image2.jpg,https://yourstore.com/fathers-day,2025-05-15T10:00`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk-upload-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bulk-uploader">
      <div className="bulk-header">
        <h2>📤 Bulk Post Upload & Scheduler</h2>
        <p>Upload multiple posts at once and auto-schedule them</p>
      </div>

      <div className="bulk-methods">
        {/* Method 1: Quick Create */}
        <div className="bulk-method-card">
          <h3>🚀 Quick Create</h3>
          <p>Generate multiple posts from a template</p>

          <div className="quick-create-options">
            <button
              onClick={() => handleQuickCreate(10, 'Day [NUMBER] of Valentine\'s countdown! 💝\n\nDon\'t forget to shop for the dad in your life!\n\nShop now: [YOUR LINK]')}
              className="btn-secondary"
            >
              Create 10 Valentine's Countdown Posts
            </button>
            <button
              onClick={() => handleQuickCreate(15, 'Did you know? Dad Joke #[NUMBER]\n\n[ADD YOUR DAD JOKE HERE]\n\nShop funny dad gifts: [YOUR LINK]')}
              className="btn-secondary"
            >
              Create 15 Dad Joke Posts
            </button>
            <button
              onClick={() => handleQuickCreate(7, 'Only [NUMBER] days until Father\'s Day! 👔\n\nHave you found the perfect gift yet?\n\nShop: [YOUR LINK]')}
              className="btn-secondary"
            >
              Create 7-Day Father's Day Countdown
            </button>
          </div>
        </div>

        {/* Method 2: CSV Import */}
        <div className="bulk-method-card">
          <h3>📊 CSV Import</h3>
          <p>Upload a CSV file with all your posts</p>

          <button onClick={downloadTemplate} className="btn-secondary">
            ⬇️ Download CSV Template
          </button>

          <div className="csv-input">
            <label>Paste CSV Data:</label>
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="name,platform,content,hashtags,imageUrl,link,scheduledDate&#10;Valentine's Sale,facebook,Check out our collection!,#ValentinesDay,..."
              rows={8}
            />
            <button onClick={handleCSVImport} className="btn-primary">
              Import CSV
            </button>
          </div>

          <div className="csv-format-help">
            <strong>CSV Format:</strong>
            <code>name,platform,content,hashtags,imageUrl,link,scheduledDate</code>
            <br />
            <small>Platforms: facebook, instagram, twitter, linkedin, pinterest, tiktok</small>
          </div>
        </div>
      </div>

      {/* Auto-Scheduler */}
      {bulkPosts.length > 0 && (
        <div className="auto-scheduler">
          <h3>📅 Auto-Schedule Posts</h3>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoSchedule.enabled}
              onChange={e => setAutoSchedule(prev => ({ ...prev, enabled: e.target.checked }))}
            />
            Enable automatic scheduling
          </label>

          {autoSchedule.enabled && (
            <div className="schedule-config">
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={autoSchedule.startDate}
                    onChange={e => setAutoSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={autoSchedule.endDate}
                    onChange={e => setAutoSchedule(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Posting Frequency</label>
                <select
                  value={autoSchedule.frequency}
                  onChange={e => setAutoSchedule(prev => ({ ...prev, frequency: e.target.value as any }))}
                >
                  <option value="daily">Daily (9 AM)</option>
                  <option value="twice-daily">Twice Daily (9 AM & 6 PM)</option>
                  <option value="every-other-day">Every Other Day (9 AM)</option>
                </select>
              </div>

              <div className="schedule-preview">
                <strong>📊 Schedule Preview:</strong>
                <p>{bulkPosts.length} posts will be distributed from {autoSchedule.startDate} to {autoSchedule.endDate}</p>
                <p>Frequency: {autoSchedule.frequency.replace('-', ' ')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Posts Preview */}
      {bulkPosts.length > 0 && (
        <div className="bulk-preview">
          <h3>📝 Posts to Upload ({bulkPosts.length})</h3>

          <div className="preview-grid">
            {bulkPosts.slice(0, 5).map((post, index) => (
              <div key={index} className="preview-card">
                <div className="preview-header">
                  <strong>{post.name}</strong>
                  <span className="platform-badge-small">{post.platform}</span>
                </div>
                <p className="preview-content">{post.content.substring(0, 80)}...</p>
                {post.hashtags && (
                  <div className="preview-hashtags">{post.hashtags}</div>
                )}
              </div>
            ))}
            {bulkPosts.length > 5 && (
              <div className="preview-more">
                + {bulkPosts.length - 5} more posts
              </div>
            )}
          </div>

          <div className="bulk-actions">
            <button onClick={() => setBulkPosts([])} className="btn-secondary">
              Clear All
            </button>
            <button onClick={handleBulkUpload} className="btn-primary">
              Upload {bulkPosts.length} Posts
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bulk-tips">
        <h4>💡 Pro Tips</h4>
        <ul>
          <li><strong>Valentine's Strategy:</strong> Create 20-30 posts from Jan 25 to Feb 13</li>
          <li><strong>Best Frequency:</strong> Post twice daily (morning & evening) for maximum reach</li>
          <li><strong>Mix Platforms:</strong> Rotate between Facebook, Instagram, and Twitter</li>
          <li><strong>Use Templates:</strong> Download the CSV template for proper formatting</li>
          <li><strong>Auto-Schedule:</strong> Let the system distribute posts evenly across your campaign dates</li>
        </ul>
      </div>
    </div>
  );
}
