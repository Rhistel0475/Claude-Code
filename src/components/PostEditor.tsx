import { useState } from 'react';
import { useSocialMedia } from '../SocialMediaContext';
import type { PostTemplate, SocialPlatform } from '../socialMediaTypes';

interface PostEditorProps {
  post: PostTemplate | null;
  onClose: () => void;
}

const platformEmojis: Record<SocialPlatform, string> = {
  facebook: '📘',
  instagram: '📷',
  twitter: '🐦',
  linkedin: '💼',
  pinterest: '📌',
  tiktok: '🎵',
};

export function PostEditor({ post, onClose }: PostEditorProps) {
  const { addTemplate, updateTemplate, state } = useSocialMedia();
  const [formData, setFormData] = useState<PostTemplate>({
    id: post?.id || Date.now().toString() + Math.random(),
    name: post?.name || '',
    platform: post?.platform || 'facebook',
    content: post?.content || '',
    hashtags: post?.hashtags || [],
    imageUrl: post?.imageUrl || '',
    link: post?.link || '',
    callToAction: post?.callToAction || '',
    scheduledDate: post?.scheduledDate || '',
    status: post?.status || 'draft',
  });
  const [hashtagInput, setHashtagInput] = useState('');

  const platformConfig = state.platformConfigs.find(pc => pc.platform === formData.platform);
  const characterCount = formData.content.length;
  const characterLimit = platformConfig?.characterLimit || 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      alert('Please fill in post name and content');
      return;
    }

    if (post) {
      updateTemplate(post.id, formData);
    } else {
      addTemplate(formData);
    }
    onClose();
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.trim().startsWith('#') ? hashtagInput.trim() : `#${hashtagInput.trim()}`;
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, tag],
      }));
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index),
    }));
  };

  const handlePlatformChange = (platform: SocialPlatform) => {
    setFormData(prev => ({ ...prev, platform }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content post-editor" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{post ? 'Edit Post' : 'Create New Post'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Summer Sale Announcement"
              required
            />
          </div>

          <div className="form-group">
            <label>Platform *</label>
            <div className="platform-selector">
              {(['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'tiktok'] as SocialPlatform[]).map(platform => (
                <button
                  key={platform}
                  type="button"
                  className={`platform-btn ${formData.platform === platform ? 'active' : ''}`}
                  onClick={() => handlePlatformChange(platform)}
                >
                  {platformEmojis[platform]} {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              Post Content *
              <span className={`char-count ${characterCount > characterLimit ? 'over-limit' : ''}`}>
                {characterCount}/{characterLimit}
              </span>
            </label>
            <textarea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your post content here..."
              rows={8}
              required
            />
          </div>

          <div className="form-group">
            <label>Hashtags</label>
            <div className="hashtag-input">
              <input
                type="text"
                value={hashtagInput}
                onChange={e => setHashtagInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
                placeholder="Add hashtag (press Enter)"
              />
              <button type="button" onClick={handleAddHashtag} className="btn-secondary">
                Add
              </button>
            </div>
            <div className="hashtag-list">
              {formData.hashtags.map((tag, index) => (
                <span key={index} className="hashtag">
                  {tag}
                  <button type="button" onClick={() => handleRemoveHashtag(index)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
            {platformConfig?.imageRequirements && (
              <small className="form-hint">📌 {platformConfig.imageRequirements}</small>
            )}
          </div>

          <div className="form-group">
            <label>Link (Product/Landing Page)</label>
            <input
              type="url"
              value={formData.link}
              onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://yourstore.com/product"
            />
          </div>

          <div className="form-group">
            <label>Call to Action</label>
            <input
              type="text"
              value={formData.callToAction}
              onChange={e => setFormData(prev => ({ ...prev, callToAction: e.target.value }))}
              placeholder="e.g., Shop Now, Learn More, Sign Up"
            />
          </div>

          <div className="form-group">
            <label>Schedule Date (Optional)</label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={e => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
