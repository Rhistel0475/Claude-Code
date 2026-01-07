import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { SocialMediaState, PostTemplate, Campaign, PlatformConfig, SocialPlatform } from './socialMediaTypes';

interface SocialMediaContextType {
  state: SocialMediaState;
  addTemplate: (template: PostTemplate) => void;
  updateTemplate: (id: string, template: Partial<PostTemplate>) => void;
  deleteTemplate: (id: string) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  updatePlatformConfig: (platform: SocialPlatform, config: Partial<PlatformConfig>) => void;
  duplicateTemplate: (id: string, targetPlatform?: SocialPlatform) => void;
  schedulePost: (templateId: string, date: string) => void;
  publishPost: (templateId: string) => void;
}

const SocialMediaContext = createContext<SocialMediaContextType | undefined>(undefined);

const STORAGE_KEY = 'socialmedia-data';

const defaultPlatformConfigs: PlatformConfig[] = [
  { platform: 'facebook', enabled: true, accountName: '', characterLimit: 63206 },
  { platform: 'instagram', enabled: true, accountName: '', characterLimit: 2200, imageRequirements: 'Square or vertical, min 320px' },
  { platform: 'twitter', enabled: true, accountName: '', characterLimit: 280 },
  { platform: 'linkedin', enabled: true, accountName: '', characterLimit: 3000 },
  { platform: 'pinterest', enabled: true, accountName: '', characterLimit: 500, imageRequirements: 'Vertical, 1000x1500px recommended' },
  { platform: 'tiktok', enabled: true, accountName: '', characterLimit: 2200, imageRequirements: 'Vertical video 9:16' },
];

export function SocialMediaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SocialMediaState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        platformConfigs: parsed.platformConfigs || defaultPlatformConfigs,
      };
    }
    return {
      templates: [],
      campaigns: [],
      platformConfigs: defaultPlatformConfigs,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTemplate = (template: PostTemplate) => {
    setState(prev => ({
      ...prev,
      templates: [...prev.templates, template],
    }));
  };

  const updateTemplate = (id: string, updates: Partial<PostTemplate>) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  };

  const deleteTemplate = (id: string) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.filter(t => t.id !== id),
    }));
  };

  const addCampaign = (campaign: Campaign) => {
    setState(prev => ({
      ...prev,
      campaigns: [...prev.campaigns, campaign],
    }));
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const deleteCampaign = (id: string) => {
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.filter(c => c.id !== id),
    }));
  };

  const updatePlatformConfig = (platform: SocialPlatform, config: Partial<PlatformConfig>) => {
    setState(prev => ({
      ...prev,
      platformConfigs: prev.platformConfigs.map(pc =>
        pc.platform === platform ? { ...pc, ...config } : pc
      ),
    }));
  };

  const duplicateTemplate = (id: string, targetPlatform?: SocialPlatform) => {
    const template = state.templates.find(t => t.id === id);
    if (template) {
      const newTemplate: PostTemplate = {
        ...template,
        id: Date.now().toString() + Math.random(),
        name: `${template.name} (Copy)`,
        platform: targetPlatform || template.platform,
        status: 'draft',
      };
      addTemplate(newTemplate);
    }
  };

  const schedulePost = (templateId: string, date: string) => {
    updateTemplate(templateId, { scheduledDate: date, status: 'scheduled' });
  };

  const publishPost = (templateId: string) => {
    updateTemplate(templateId, { status: 'published' });
  };

  return (
    <SocialMediaContext.Provider value={{
      state,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      updatePlatformConfig,
      duplicateTemplate,
      schedulePost,
      publishPost,
    }}>
      {children}
    </SocialMediaContext.Provider>
  );
}

export function useSocialMedia() {
  const context = useContext(SocialMediaContext);
  if (!context) {
    throw new Error('useSocialMedia must be used within SocialMediaProvider');
  }
  return context;
}
