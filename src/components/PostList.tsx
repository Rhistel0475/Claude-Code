import { useState } from 'react';
import { useSocialMedia } from '../SocialMediaContext';
import type { PostTemplate, SocialPlatform } from '../socialMediaTypes';

interface PostListProps {
  onEdit: (post: PostTemplate) => void;
}

const platformEmojis: Record<SocialPlatform, string> = {
  facebook: '📘',
  instagram: '📷',
  twitter: '🐦',
  linkedin: '💼',
  pinterest: '📌',
  tiktok: '🎵',
};

const statusColors = {
  draft: '#888',
  scheduled: '#ff9800',
  published: '#4caf50',
};

export function PostList({ onEdit }: PostListProps) {
  const { state, deleteTemplate, duplicateTemplate, publishPost } = useSocialMedia();
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());

  const filteredPosts = state.templates.filter(post => {
    const platformMatch = filterPlatform === 'all' || post.platform === filterPlatform;
    const statusMatch = filterStatus === 'all' || post.status === filterStatus;
    return platformMatch && statusMatch;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteTemplate(id);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateTemplate(id);
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPosts(newSelected);
  };

  const handleBulkPublish = () => {
    if (selectedPosts.size === 0) return;
    if (confirm(`Publish ${selectedPosts.size} selected posts?`)) {
      selectedPosts.forEach(id => publishPost(id));
      setSelectedPosts(new Set());
    }
  };

  const handleExportSelected = () => {
    const postsToExport = state.templates.filter(p => selectedPosts.has(p.id));
    const dataStr = JSON.stringify(postsToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `social-posts-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="post-list-container">
      <div className="filters">
        <div className="filter-group">
          <label>Platform:</label>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value as any)}>
            <option value="all">All Platforms</option>
            <option value="facebook">📘 Facebook</option>
            <option value="instagram">📷 Instagram</option>
            <option value="twitter">🐦 Twitter</option>
            <option value="linkedin">💼 LinkedIn</option>
            <option value="pinterest">📌 Pinterest</option>
            <option value="tiktok">🎵 TikTok</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {selectedPosts.size > 0 && (
        <div className="bulk-actions">
          <span>{selectedPosts.size} selected</span>
          <button onClick={handleBulkPublish} className="btn-secondary">Publish Selected</button>
          <button onClick={handleExportSelected} className="btn-secondary">Export Selected</button>
          <button onClick={() => setSelectedPosts(new Set())} className="btn-secondary">Clear Selection</button>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found. Create your first post to get started!</p>
        </div>
      ) : (
        <div className="post-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className={`post-card ${selectedPosts.has(post.id) ? 'selected' : ''}`}>
              <div className="post-card-header">
                <input
                  type="checkbox"
                  checked={selectedPosts.has(post.id)}
                  onChange={() => handleToggleSelect(post.id)}
                  className="post-checkbox"
                />
                <span className="platform-badge">
                  {platformEmojis[post.platform]} {post.platform}
                </span>
                <span className="status-badge" style={{ backgroundColor: statusColors[post.status] }}>
                  {post.status}
                </span>
              </div>

              <h3>{post.name}</h3>
              <p className="post-preview">{post.content.substring(0, 120)}{post.content.length > 120 ? '...' : ''}</p>

              {post.hashtags.length > 0 && (
                <div className="post-hashtags">
                  {post.hashtags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="hashtag-small">{tag}</span>
                  ))}
                  {post.hashtags.length > 3 && <span className="hashtag-small">+{post.hashtags.length - 3}</span>}
                </div>
              )}

              {post.scheduledDate && (
                <div className="post-schedule">
                  📅 {new Date(post.scheduledDate).toLocaleString()}
                </div>
              )}

              {post.imageUrl && (
                <div className="post-image-preview">
                  🖼️ Image attached
                </div>
              )}

              <div className="post-card-actions">
                <button onClick={() => onEdit(post)} className="btn-icon" title="Edit">
                  ✏️
                </button>
                <button onClick={() => handleDuplicate(post.id)} className="btn-icon" title="Duplicate">
                  📋
                </button>
                <button onClick={() => handleDelete(post.id)} className="btn-icon danger" title="Delete">
                  🗑️
                </button>
                {post.status !== 'published' && (
                  <button onClick={() => publishPost(post.id)} className="btn-icon success" title="Publish">
                    ✅
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
