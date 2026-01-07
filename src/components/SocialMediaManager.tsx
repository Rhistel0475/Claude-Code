import { useState } from 'react';
import type { PostTemplate, SocialPlatform } from '../socialMediaTypes';
import { PostEditor } from './PostEditor';
import { PostList } from './PostList';
import { PlatformTemplates } from './PlatformTemplates';
import { CampaignManager } from './CampaignManager';
import { PlatformSettings } from './PlatformSettings';
import { ContentLibrary } from './ContentLibrary';
import { CalendarView } from './CalendarView';
import { HolidayCampaignTemplates } from './HolidayCampaignTemplates';
import { BulkUploader } from './BulkUploader';

type SocialTab = 'posts' | 'calendar' | 'templates' | 'holidays' | 'campaigns' | 'library' | 'bulk' | 'settings';

export function SocialMediaManager() {
  const [activeTab, setActiveTab] = useState<SocialTab>('posts');
  const [editingPost, setEditingPost] = useState<PostTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleCreateNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEdit = (post: PostTemplate) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleUseTemplate = (platform: SocialPlatform, templateContent: string, templateName: string) => {
    const newPost: PostTemplate = {
      id: Date.now().toString() + Math.random(),
      name: templateName,
      platform,
      content: templateContent,
      hashtags: [],
      status: 'draft',
    };
    setEditingPost(newPost);
    setShowEditor(true);
  };

  return (
    <div className="social-media-manager">
      <header className="app-header">
        <h1>📱 Social Media Manager</h1>
        <p className="subtitle">Manage your e-commerce store's social media presence across all platforms</p>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 My Posts
        </button>
        <button
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📋 Templates
        </button>
        <button
          className={`tab ${activeTab === 'holidays' ? 'active' : ''}`}
          onClick={() => setActiveTab('holidays')}
        >
          🎯 Holidays
        </button>
        <button
          className={`tab ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          📊 Campaigns
        </button>
        <button
          className={`tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          📚 Library
        </button>
        <button
          className={`tab ${activeTab === 'bulk' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk')}
        >
          📤 Bulk Upload
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            <div className="section-header">
              <h2>Your Posts</h2>
              <button className="btn-primary" onClick={handleCreateNew}>
                ➕ Create New Post
              </button>
            </div>
            <PostList onEdit={handleEdit} />
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarView onEditPost={handleEdit} />
        )}

        {activeTab === 'templates' && (
          <PlatformTemplates onUseTemplate={handleUseTemplate} />
        )}

        {activeTab === 'holidays' && (
          <HolidayCampaignTemplates onUseTemplate={handleUseTemplate} />
        )}

        {activeTab === 'campaigns' && (
          <CampaignManager />
        )}

        {activeTab === 'library' && (
          <ContentLibrary mode="manager" />
        )}

        {activeTab === 'bulk' && (
          <BulkUploader />
        )}

        {activeTab === 'settings' && (
          <PlatformSettings />
        )}
      </main>

      {showEditor && (
        <PostEditor
          post={editingPost}
          onClose={handleCloseEditor}
        />
      )}

      <footer className="app-footer">
        <p>All data is saved locally in your browser</p>
      </footer>
    </div>
  );
}
