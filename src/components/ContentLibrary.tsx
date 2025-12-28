import { useState } from 'react';

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  tags: string[];
  uploadedDate: string;
  fileSize?: number;
}

interface ContentLibraryProps {
  onSelectAsset?: (asset: MediaAsset) => void;
  mode?: 'selector' | 'manager'; // selector for picking, manager for full library
}

export function ContentLibrary({ onSelectAsset, mode = 'manager' }: ContentLibraryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(() => {
    const stored = localStorage.getItem('content-library');
    return stored ? JSON.parse(stored) : [];
  });

  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTags, setNewAssetTags] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const saveAssets = (newAssets: MediaAsset[]) => {
    setAssets(newAssets);
    localStorage.setItem('content-library', JSON.stringify(newAssets));
  };

  const handleAddAsset = () => {
    if (!newAssetUrl || !newAssetName) {
      alert('Please provide both URL and name');
      return;
    }

    const asset: MediaAsset = {
      id: Date.now().toString() + Math.random(),
      name: newAssetName,
      url: newAssetUrl,
      type: newAssetUrl.match(/\.(mp4|mov|avi)$/i) ? 'video' : 'image',
      tags: newAssetTags.split(',').map(t => t.trim()).filter(Boolean),
      uploadedDate: new Date().toISOString(),
    };

    saveAssets([...assets, asset]);
    setNewAssetUrl('');
    setNewAssetName('');
    setNewAssetTags('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this asset?')) {
      saveAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const allTags = Array.from(new Set(assets.flatMap(a => a.tags)));
  const filteredAssets = assets.filter(asset => {
    const matchesTag = filterTag === 'all' || asset.tags.includes(filterTag);
    const matchesSearch = searchQuery === '' ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const quickTags = ['valentine', 'fathers-day', 'halloween', 'christmas', 'product-shots', 'lifestyle', 'dad-jokes'];

  return (
    <div className="content-library">
      <div className="library-header">
        <h2>📚 Content Library</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
          ➕ Add Media
        </button>
      </div>

      {showAddForm && (
        <div className="add-asset-form">
          <h3>Add New Asset</h3>
          <div className="form-group">
            <label>Asset Name *</label>
            <input
              type="text"
              value={newAssetName}
              onChange={e => setNewAssetName(e.target.value)}
              placeholder="e.g., Dad Bod Shirt - Blue"
            />
          </div>

          <div className="form-group">
            <label>Image/Video URL *</label>
            <input
              type="url"
              value={newAssetUrl}
              onChange={e => setNewAssetUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={newAssetTags}
              onChange={e => setNewAssetTags(e.target.value)}
              placeholder="valentine, dad-jokes, product-shots"
            />
            <div className="quick-tags">
              <span>Quick tags:</span>
              {quickTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const tags = newAssetTags ? newAssetTags.split(',').map(t => t.trim()) : [];
                    if (!tags.includes(tag)) {
                      setNewAssetTags([...tags, tag].join(', '));
                    }
                  }}
                  className="quick-tag-btn"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button onClick={() => setShowAddForm(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleAddAsset} className="btn-primary">
              Add to Library
            </button>
          </div>
        </div>
      )}

      <div className="library-filters">
        <input
          type="text"
          placeholder="🔍 Search assets..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="filter-select">
          <option value="all">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="empty-state">
          <p>
            {assets.length === 0
              ? 'No assets yet. Add your product images and videos!'
              : 'No assets match your filters'}
          </p>
        </div>
      ) : (
        <div className="assets-grid">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-preview">
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} loading="lazy" />
                ) : (
                  <video src={asset.url} controls />
                )}
                <div className="asset-overlay">
                  {mode === 'selector' && onSelectAsset && (
                    <button
                      onClick={() => onSelectAsset(asset)}
                      className="btn-overlay"
                    >
                      ✓ Select
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyUrl(asset.url)}
                    className="btn-overlay"
                  >
                    📋 Copy URL
                  </button>
                </div>
              </div>

              <div className="asset-info">
                <h4>{asset.name}</h4>
                <div className="asset-tags">
                  {asset.tags.map((tag, i) => (
                    <span key={i} className="asset-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="asset-meta">
                  <span>📅 {new Date(asset.uploadedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="asset-actions">
                <button
                  onClick={() => window.open(asset.url, '_blank')}
                  className="btn-icon"
                  title="View Full Size"
                >
                  👁️
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="btn-icon danger"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'manager' && assets.length > 0 && (
        <div className="library-stats">
          <p>
            📊 {assets.length} total assets | {filteredAssets.length} showing
          </p>
        </div>
      )}
    </div>
  );
}
