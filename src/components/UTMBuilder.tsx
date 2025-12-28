import { useState } from 'react';

interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

interface UTMBuilderProps {
  baseUrl: string;
  onUrlGenerated: (url: string) => void;
}

export function UTMBuilder({ baseUrl, onUrlGenerated }: UTMBuilderProps) {
  const [params, setParams] = useState<UTMParams>({
    source: 'facebook',
    medium: 'social',
    campaign: '',
    term: '',
    content: '',
  });

  const [generatedUrl, setGeneratedUrl] = useState('');

  const generateUrl = () => {
    if (!baseUrl || !params.campaign) {
      alert('Please enter a base URL and campaign name');
      return;
    }

    const url = new URL(baseUrl);
    url.searchParams.append('utm_source', params.source);
    url.searchParams.append('utm_medium', params.medium);
    url.searchParams.append('utm_campaign', params.campaign);

    if (params.term) {
      url.searchParams.append('utm_term', params.term);
    }

    if (params.content) {
      url.searchParams.append('utm_content', params.content);
    }

    const finalUrl = url.toString();
    setGeneratedUrl(finalUrl);
    onUrlGenerated(finalUrl);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    alert('URL copied to clipboard!');
  };

  const quickPresets = {
    valentines: { campaign: 'valentines-2025', content: 'dad-jokes-gifts' },
    fathersday: { campaign: 'fathers-day-2025', content: 'dad-bod-shirts' },
    halloween: { campaign: 'halloween-2025', content: 'spooky-dad-jokes' },
    christmas: { campaign: 'christmas-2025', content: 'holiday-gifts' },
  };

  const applyPreset = (preset: keyof typeof quickPresets) => {
    setParams(prev => ({ ...prev, ...quickPresets[preset] }));
  };

  return (
    <div className="utm-builder">
      <h3>🔗 UTM Link Builder</h3>
      <p className="utm-description">
        Track which posts drive sales with custom tracking URLs
      </p>

      <div className="utm-presets">
        <label>Quick Presets:</label>
        <div className="preset-buttons">
          <button type="button" onClick={() => applyPreset('valentines')} className="btn-preset">
            💝 Valentine's Day
          </button>
          <button type="button" onClick={() => applyPreset('fathersday')} className="btn-preset">
            👔 Father's Day
          </button>
          <button type="button" onClick={() => applyPreset('halloween')} className="btn-preset">
            🎃 Halloween
          </button>
          <button type="button" onClick={() => applyPreset('christmas')} className="btn-preset">
            🎄 Christmas
          </button>
        </div>
      </div>

      <div className="utm-form">
        <div className="form-group">
          <label>Source *</label>
          <select
            value={params.source}
            onChange={e => setParams(prev => ({ ...prev, source: e.target.value }))}
          >
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="pinterest">Pinterest</option>
            <option value="tiktok">TikTok</option>
          </select>
          <small className="form-hint">Which platform is this from?</small>
        </div>

        <div className="form-group">
          <label>Medium *</label>
          <select
            value={params.medium}
            onChange={e => setParams(prev => ({ ...prev, medium: e.target.value }))}
          >
            <option value="social">Social (Organic Post)</option>
            <option value="cpc">CPC (Paid Ad)</option>
            <option value="story">Story</option>
            <option value="reel">Reel/Video</option>
            <option value="sponsored">Sponsored</option>
          </select>
          <small className="form-hint">Type of post</small>
        </div>

        <div className="form-group">
          <label>Campaign Name *</label>
          <input
            type="text"
            value={params.campaign}
            onChange={e => setParams(prev => ({ ...prev, campaign: e.target.value }))}
            placeholder="e.g., valentines-2025"
          />
          <small className="form-hint">Use lowercase with dashes</small>
        </div>

        <div className="form-group">
          <label>Term (Optional)</label>
          <input
            type="text"
            value={params.term}
            onChange={e => setParams(prev => ({ ...prev, term: e.target.value }))}
            placeholder="e.g., dad-jokes, funny-gifts"
          />
          <small className="form-hint">Keywords for paid ads</small>
        </div>

        <div className="form-group">
          <label>Content (Optional)</label>
          <input
            type="text"
            value={params.content}
            onChange={e => setParams(prev => ({ ...prev, content: e.target.value }))}
            placeholder="e.g., dad-bod-shirt-blue"
          />
          <small className="form-hint">Specific product or variant</small>
        </div>

        <button type="button" onClick={generateUrl} className="btn-primary">
          Generate Tracking URL
        </button>
      </div>

      {generatedUrl && (
        <div className="utm-result">
          <label>Your Tracking URL:</label>
          <div className="url-output">
            <input
              type="text"
              value={generatedUrl}
              readOnly
              className="generated-url"
            />
            <button type="button" onClick={copyToClipboard} className="btn-secondary">
              📋 Copy
            </button>
          </div>
          <div className="utm-preview">
            <h4>Parameters:</h4>
            <ul>
              <li><strong>Source:</strong> {params.source}</li>
              <li><strong>Medium:</strong> {params.medium}</li>
              <li><strong>Campaign:</strong> {params.campaign}</li>
              {params.term && <li><strong>Term:</strong> {params.term}</li>}
              {params.content && <li><strong>Content:</strong> {params.content}</li>}
            </ul>
          </div>
        </div>
      )}

      <div className="utm-tips">
        <h4>💡 Pro Tips</h4>
        <ul>
          <li>Use the same campaign name across all platforms for easy comparison</li>
          <li>Track in Google Analytics: Acquisition → Campaigns → All Campaigns</li>
          <li>Use "content" to A/B test different images or copy</li>
          <li>Keep names lowercase and use dashes (valentines-2025, not Valentines 2025)</li>
        </ul>
      </div>
    </div>
  );
}
