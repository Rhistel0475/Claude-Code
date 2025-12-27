import { useState } from 'react';
import type { SocialPlatform } from '../socialMediaTypes';

interface TemplateData {
  name: string;
  content: string;
  category: 'product' | 'promotion' | 'engagement' | 'announcement';
}

const templates: Record<SocialPlatform, TemplateData[]> = {
  facebook: [
    {
      name: 'New Product Launch',
      category: 'product',
      content: '🎉 Exciting news! We just launched [PRODUCT NAME]!\n\n✨ [KEY FEATURE 1]\n✨ [KEY FEATURE 2]\n✨ [KEY FEATURE 3]\n\nShop now at [LINK] and be among the first to experience [BENEFIT]!\n\n#NewProduct #ShopNow',
    },
    {
      name: 'Flash Sale',
      category: 'promotion',
      content: '⚡ FLASH SALE ALERT! ⚡\n\nGet [X]% OFF on [PRODUCT CATEGORY] for the next [TIME PERIOD]!\n\n🎁 Use code: [COUPON CODE]\n⏰ Hurry, limited time only!\n\nShop now: [LINK]\n\n#Sale #LimitedOffer',
    },
    {
      name: 'Customer Testimonial',
      category: 'engagement',
      content: '💙 We love hearing from our customers!\n\n"[CUSTOMER QUOTE]" - [CUSTOMER NAME]\n\nThank you for choosing us! Want to share your experience? Comment below! 👇\n\n#CustomerLove #Testimonial',
    },
    {
      name: 'Weekend Special',
      category: 'promotion',
      content: '🌟 WEEKEND SPECIAL 🌟\n\nThis weekend only: [OFFER DETAILS]\n\n✅ [BENEFIT 1]\n✅ [BENEFIT 2]\n✅ [BENEFIT 3]\n\nDon\'t miss out! Shop now: [LINK]\n\n#WeekendSale #SpecialOffer',
    },
  ],
  instagram: [
    {
      name: 'Product Showcase',
      category: 'product',
      content: '✨ Meet [PRODUCT NAME] ✨\n\nYour new favorite [PRODUCT TYPE] is here! \n\n💫 [FEATURE]\n🌟 [BENEFIT]\n💖 [USP]\n\nTap the link in bio to shop!\n\n#[BrandName] #[ProductCategory] #ShopSmall',
    },
    {
      name: 'Behind the Scenes',
      category: 'engagement',
      content: '👀 Behind the scenes at [BRAND NAME]!\n\nHere\'s a sneak peek at how we [PROCESS/CREATE PRODUCTS]. Every detail matters to us! 💯\n\nWhat would you like to see more of? Drop a comment! 👇\n\n#BTS #SmallBusiness #Handmade',
    },
    {
      name: 'User Generated Content',
      category: 'engagement',
      content: '📸 Repost from @[USERNAME]\n\nWe love seeing [PRODUCT] in action! Thanks for sharing 💙\n\nTag us in your photos for a chance to be featured!\n\n#[BrandName]Community #CustomerLove',
    },
    {
      name: 'Story Prompt',
      category: 'engagement',
      content: '🎯 POLL TIME! 🎯\n\nWhich [PRODUCT/COLOR/STYLE] is your favorite?\n\nA) [OPTION A]\nB) [OPTION B]\n\nLet us know in the comments! 👇\n\n#Community #YourOpinionMatters',
    },
  ],
  twitter: [
    {
      name: 'Product Drop',
      category: 'product',
      content: '🚀 NEW DROP ALERT\n\n[PRODUCT NAME] is now live!\n\n🔥 [KEY FEATURE]\n💎 [UNIQUE BENEFIT]\n\nShop: [LINK]\n\n#NewRelease #ShopNow',
    },
    {
      name: 'Limited Offer',
      category: 'promotion',
      content: '⚡ FLASH DEAL ⚡\n\n[X]% OFF [PRODUCT] \nCode: [COUPON]\n\n⏰ Ends [TIME]\n\n👉 [LINK]\n\n#Sale #Deal',
    },
    {
      name: 'Tip/Value Tweet',
      category: 'engagement',
      content: '💡 PRO TIP:\n\n[HELPFUL TIP RELATED TO YOUR PRODUCT/NICHE]\n\nWant more tips? Follow us for daily insights!\n\n#Tips #LifeHack',
    },
    {
      name: 'Question Tweet',
      category: 'engagement',
      content: '🤔 Quick question:\n\n[ENGAGING QUESTION RELATED TO YOUR NICHE]?\n\nReply and let us know! We love hearing from you 💬\n\n#Community',
    },
  ],
  linkedin: [
    {
      name: 'Company Milestone',
      category: 'announcement',
      content: '🎉 Milestone Alert!\n\nWe\'re thrilled to announce that [ACHIEVEMENT/MILESTONE].\n\nThis wouldn\'t be possible without our amazing customers and dedicated team. Thank you for being part of our journey!\n\nHere\'s what this means for you:\n• [BENEFIT 1]\n• [BENEFIT 2]\n• [BENEFIT 3]\n\n#BusinessGrowth #Milestone #ThankYou',
    },
    {
      name: 'Industry Insight',
      category: 'engagement',
      content: '💡 Industry Insight:\n\nRecent trends show [TREND/STATISTIC].\n\nAt [COMPANY NAME], we\'re addressing this by [YOUR SOLUTION/APPROACH].\n\nKey takeaways:\n1. [POINT 1]\n2. [POINT 2]\n3. [POINT 3]\n\nWhat\'s your experience with this? Share your thoughts below.\n\n#Industry #Trends #BusinessStrategy',
    },
    {
      name: 'Product Solution',
      category: 'product',
      content: 'Solving [PROBLEM] for businesses.\n\nIntroducing [PRODUCT NAME] - designed to help [TARGET AUDIENCE] achieve [GOAL].\n\nKey benefits:\n✅ [BENEFIT 1]\n✅ [BENEFIT 2]\n✅ [BENEFIT 3]\n\nInterested in learning more? Visit: [LINK]\n\n#B2B #Solution #Innovation',
    },
  ],
  pinterest: [
    {
      name: 'Product Pin',
      category: 'product',
      content: '📌 [PRODUCT NAME]\n\n✨ [KEY FEATURE]\n💕 Perfect for [USE CASE]\n\n[PRICE] | Shop now: [LINK]\n\n#[Category] #[Style] #ShopTheLook',
    },
    {
      name: 'How-To Guide',
      category: 'engagement',
      content: '📚 How to [ACHIEVE RESULT]\n\nStep-by-step guide featuring our [PRODUCT]!\n\n✅ [STEP 1]\n✅ [STEP 2]\n✅ [STEP 3]\n\nSave this pin for later!\n\n#HowTo #Tutorial #DIY',
    },
    {
      name: 'Gift Guide',
      category: 'product',
      content: '🎁 Perfect Gift Idea!\n\n[PRODUCT NAME] makes the ideal gift for [OCCASION/PERSON]\n\n💝 [REASON 1]\n💝 [REASON 2]\n\nShop: [LINK]\n\n#GiftIdeas #GiftGuide #[Occasion]',
    },
  ],
  tiktok: [
    {
      name: 'Product Demo',
      category: 'product',
      content: 'You NEED to see this! 👀\n\n[PRODUCT NAME] is a game-changer for [PROBLEM IT SOLVES]\n\nWatch how easy it is to use! ⬆️\n\n#TikTokMadeMeBuyIt #ProductDemo #MustHave',
    },
    {
      name: 'Trend Participation',
      category: 'engagement',
      content: 'Jumping on the [TREND NAME] trend! 🎵\n\nShowing off our [PRODUCT] in a fun way 😄\n\nWhich one is your favorite? Comment below! 👇\n\n#[TrendHashtag] #SmallBusiness #Viral',
    },
    {
      name: 'Before/After',
      category: 'product',
      content: 'Before vs After using [PRODUCT NAME] 🤯\n\nThe difference is INSANE!\n\nGet yours: [LINK IN BIO]\n\n#BeforeAndAfter #Transformation #Amazing',
    },
  ],
};

interface PlatformTemplatesProps {
  onUseTemplate: (platform: SocialPlatform, content: string, name: string) => void;
}

export function PlatformTemplates({ onUseTemplate }: PlatformTemplatesProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('facebook');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'product' | 'promotion' | 'engagement' | 'announcement'>('all');

  const platformTemplates = templates[selectedPlatform].filter(
    t => selectedCategory === 'all' || t.category === selectedCategory
  );

  const categoryColors = {
    product: '#4caf50',
    promotion: '#ff9800',
    engagement: '#2196f3',
    announcement: '#9c27b0',
  };

  return (
    <div className="platform-templates">
      <div className="templates-header">
        <h2>Platform Templates</h2>
        <p>Choose a template and customize it for your needs</p>
      </div>

      <div className="template-controls">
        <div className="platform-tabs">
          {(['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'tiktok'] as SocialPlatform[]).map(platform => (
            <button
              key={platform}
              className={`platform-tab ${selectedPlatform === platform ? 'active' : ''}`}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as any)}>
            <option value="all">All Categories</option>
            <option value="product">Product</option>
            <option value="promotion">Promotion</option>
            <option value="engagement">Engagement</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
      </div>

      <div className="template-grid">
        {platformTemplates.map((template, index) => (
          <div key={index} className="template-card">
            <div className="template-header">
              <h3>{template.name}</h3>
              <span
                className="category-badge"
                style={{ backgroundColor: categoryColors[template.category] }}
              >
                {template.category}
              </span>
            </div>
            <div className="template-content">
              <pre>{template.content}</pre>
            </div>
            <button
              className="btn-primary"
              onClick={() => onUseTemplate(selectedPlatform, template.content, template.name)}
            >
              Use This Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
