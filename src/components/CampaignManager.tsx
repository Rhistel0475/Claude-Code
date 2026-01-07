import { useState } from 'react';
import { useSocialMedia } from '../SocialMediaContext';
import type { Campaign, SocialPlatform } from '../socialMediaTypes';

export function CampaignManager() {
  const { state, addCampaign, updateCampaign, deleteCampaign } = useSocialMedia();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    platforms: [],
    posts: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const campaign: Campaign = {
      id: editingCampaign?.id || Date.now().toString() + Math.random(),
      name: formData.name!,
      description: formData.description || '',
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      platforms: formData.platforms || [],
      posts: formData.posts || [],
    };

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, campaign);
    } else {
      addCampaign(campaign);
    }

    setShowCreateForm(false);
    setEditingCampaign(null);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      platforms: [],
      posts: [],
    });
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData(campaign);
    setShowCreateForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
    }
  };

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setFormData(prev => {
      const platforms = prev.platforms || [];
      const newPlatforms = platforms.includes(platform)
        ? platforms.filter(p => p !== platform)
        : [...platforms, platform];
      return { ...prev, platforms: newPlatforms };
    });
  };

  const handleAddPostToCampaign = (campaignId: string, postId: string) => {
    const campaign = state.campaigns.find(c => c.id === campaignId);
    const post = state.templates.find(t => t.id === postId);
    if (campaign && post && !campaign.posts.find(p => p.id === postId)) {
      updateCampaign(campaignId, {
        posts: [...campaign.posts, post],
      });
    }
  };

  const handleRemovePostFromCampaign = (campaignId: string, postId: string) => {
    const campaign = state.campaigns.find(c => c.id === campaignId);
    if (campaign) {
      updateCampaign(campaignId, {
        posts: campaign.posts.filter(p => p.id !== postId),
      });
    }
  };

  return (
    <div className="campaign-manager">
      <div className="section-header">
        <h2>Campaigns</h2>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
          ➕ Create Campaign
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</h2>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Campaign Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Summer Sale 2024"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your campaign goals and strategy..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Target Platforms</label>
                <div className="platform-checkboxes">
                  {(['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'tiktok'] as SocialPlatform[]).map(platform => (
                    <label key={platform} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.platforms?.includes(platform)}
                        onChange={() => handlePlatformToggle(platform)}
                      />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {state.campaigns.length === 0 ? (
        <div className="empty-state">
          <p>No campaigns yet. Create your first campaign to organize your social media strategy!</p>
        </div>
      ) : (
        <div className="campaign-list">
          {state.campaigns.map(campaign => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <h3>{campaign.name}</h3>
                <div className="campaign-actions">
                  <button onClick={() => handleEdit(campaign)} className="btn-icon">✏️</button>
                  <button onClick={() => handleDelete(campaign.id)} className="btn-icon danger">🗑️</button>
                </div>
              </div>

              {campaign.description && <p className="campaign-description">{campaign.description}</p>}

              <div className="campaign-meta">
                <span>📅 {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                <span>📱 {campaign.platforms.length} platforms</span>
                <span>📝 {campaign.posts.length} posts</span>
              </div>

              <div className="campaign-platforms">
                {campaign.platforms.map(platform => (
                  <span key={platform} className="platform-badge-small">
                    {platform}
                  </span>
                ))}
              </div>

              <div className="campaign-posts">
                <h4>Posts in this campaign:</h4>
                {campaign.posts.length === 0 ? (
                  <p className="no-posts">No posts added yet</p>
                ) : (
                  <div className="mini-post-list">
                    {campaign.posts.map(post => (
                      <div key={post.id} className="mini-post-card">
                        <span className="post-name">{post.name}</span>
                        <span className="post-platform">{post.platform}</span>
                        <button
                          onClick={() => handleRemovePostFromCampaign(campaign.id, post.id)}
                          className="btn-icon-tiny"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <details className="add-post-section">
                  <summary>Add existing posts</summary>
                  <div className="available-posts">
                    {state.templates
                      .filter(t => !campaign.posts.find(p => p.id === t.id))
                      .map(post => (
                        <div key={post.id} className="available-post">
                          <span>{post.name} ({post.platform})</span>
                          <button
                            onClick={() => handleAddPostToCampaign(campaign.id, post.id)}
                            className="btn-secondary-small"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
