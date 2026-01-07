export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'pinterest' | 'tiktok';

export interface PostTemplate {
  id: string;
  name: string;
  platform: SocialPlatform;
  content: string;
  hashtags: string[];
  imageUrl?: string;
  link?: string;
  callToAction?: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  posts: PostTemplate[];
  platforms: SocialPlatform[];
}

export interface PlatformConfig {
  platform: SocialPlatform;
  enabled: boolean;
  accountName: string;
  characterLimit?: number;
  imageRequirements?: string;
}

export interface SocialMediaState {
  templates: PostTemplate[];
  campaigns: Campaign[];
  platformConfigs: PlatformConfig[];
}
