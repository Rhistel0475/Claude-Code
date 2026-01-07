import { useState } from 'react';
import type { SocialPlatform } from '../socialMediaTypes';

interface HolidayTemplate {
  name: string;
  holiday: 'valentines' | 'fathers-day' | 'halloween' | 'christmas' | 'mothers-day';
  platform: SocialPlatform;
  content: string;
  suggestedHashtags: string[];
  postingTip: string;
}

const holidayTemplates: HolidayTemplate[] = [
  // VALENTINE'S DAY - Dad Joke Store
  {
    name: "Valentine's Day Hero Product",
    holiday: 'valentines',
    platform: 'facebook',
    content: "💘 Looking for the PERFECT Valentine's gift for the dad in your life?\n\nOur 'Dad Bod' shirt says \"I HAVE A DAD BOD - Carefully Crafted with Beer & Pizza\" 😂\n\nBecause nothing says love like celebrating his dad bod! Available in sizes S-3XL.\n\n⏰ Order by Feb 10th for Valentine's delivery!\n🚚 Free shipping on orders $50+\n\n👉 Shop now: [YOUR LINK]\n\n#ValentinesDay #DadGifts #DadJokes #FunnyGifts #DadBod",
    suggestedHashtags: ['#ValentinesDay', '#GiftsForHim', '#DadJokes', '#DadBod', '#FunnyShirts'],
    postingTip: 'Post between Jan 25 - Feb 13. Best engagement on evenings!'
  },
  {
    name: "Valentine's Countdown - 7 Days",
    holiday: 'valentines',
    platform: 'instagram',
    content: "💕 7 DAYS UNTIL VALENTINE'S DAY! 💕\n\nStill haven't found the perfect gift for your favorite dad joker?\n\nWe've got you covered with gifts that'll make him LOL:\n\n👕 Funny Dad Shirts\n☕ \"Dad Fuel\" Coffee Mugs\n🎁 Dad Joke Gift Sets\n\nDon't wait! Delivery cutoff is Feb 10th! ⏰\n\nLink in bio 👆\n\n#ValentinesDayCountdown #GiftsForDads #DadJokes #LastMinuteGift",
    suggestedHashtags: ['#ValentinesDay', '#DadGifts', '#FunnyGifts', '#ShopSmall'],
    postingTip: 'Post on Feb 7th. Use Story polls to engage!'
  },
  {
    name: "Valentine's Last Chance",
    holiday: 'valentines',
    platform: 'facebook',
    content: "⚠️ LAST CALL FOR VALENTINE'S DELIVERY! ⚠️\n\nOrder by TONIGHT (Feb 10th) to get your dad joke gifts delivered before Valentine's Day! 💝\n\n🔥 TOP SELLERS:\n• \"I'm Not A Regular Dad, I'm A Cool Dad\" Tee\n• \"Dad Jokes Loading...\" Hoodie  \n• \"World's Okayest Dad\" Coffee Mug\n\nFREE Rush Shipping automatically applied at checkout!\n\nShop: [LINK] 👈\n\n#ValentinesDay #DadGifts #LastChance #FreeShipping",
    suggestedHashtags: ['#ValentinesDay', '#LastMinuteGift', '#FreeShipping', '#DadJokes'],
    postingTip: 'Post Feb 10th morning. Create urgency!'
  },

  // FATHER'S DAY - Dad Joke Store
  {
    name: "Father's Day Early Bird",
    holiday: 'fathers-day',
    platform: 'facebook',
    content: "🎉 IT'S FATHER'S DAY SEASON! 🎉\n\nDad deserves more than just a card this year... He deserves the ULTIMATE dad joke gift! 😂\n\nIntroducing our Father's Day Collection:\n\n👔 \"Father Figure (Dad Bod Actual Size)\" Tee\n🍺 \"Grill Sergeant\" Apron\n👨‍👧‍👦 \"Dad: The Man, The Myth, The Legend... The Napper\" Hoodie\n\n🚀 EARLY BIRD SPECIAL:\n15% OFF with code SUPERDAD\n\nValid through [DATE] - Don't wait!\n\nShop: [LINK]\n\n#FathersDay #DadGifts #DadJokes #FathersDayGifts",
    suggestedHashtags: ['#FathersDay', '#GiftsForDad', '#DadJokes', '#FunnyDadShirts'],
    postingTip: 'Start posting May 15th. Build anticipation early!'
  },
  {
    name: "Father's Day Gift Guide",
    holiday: 'fathers-day',
    platform: 'instagram',
    content: "🎁 THE ULTIMATE FATHER'S DAY GIFT GUIDE 🎁\n\nSwipe to see gifts for every type of dad! 👉\n\n1️⃣ The Grillmaster Dad\n2️⃣ The Tech Dad\n3️⃣ The Sports Dad\n4️⃣ The \"I'm Not Old\" Dad\n5️⃣ The Coffee-Addicted Dad\n\nAll featuring HILARIOUS dad jokes he'll actually wear! 😂\n\n💰 15% OFF Father's Day Collection\n📦 Free shipping over $40\n⏰ Order by June 10th for delivery!\n\nLink in bio to shop! 👆\n\n#FathersDayGiftGuide #GiftsForDad #DadStyle #DadJokesRule",
    suggestedHashtags: ['#FathersDay', '#DadGifts', '#GiftGuide', '#ShopSmall'],
    postingTip: 'Carousel post works best! Post early June.'
  },
  {
    name: "Father's Day Weekend Reminder",
    holiday: 'fathers-day',
    platform: 'twitter',
    content: "⏰ FATHER'S DAY IS THIS SUNDAY! ⏰\n\nForget the boring tie. Get Dad something that'll make him laugh! 😂\n\n👕 Funny Dad Shirts\n☕ Dad Joke Mugs  \n🎁 Gift Sets\n\n🚨 Order TODAY for guaranteed delivery!\n\n👉 [LINK]\n\n#FathersDay #DadGifts",
    suggestedHashtags: ['#FathersDay', '#LastMinute', '#DadJokes'],
    postingTip: 'Post Thursday before Father\'s Day. Pin this tweet!'
  },

  // HALLOWEEN - Dad Joke Store
  {
    name: 'Halloween Dad Costume Tees',
    holiday: 'halloween',
    platform: 'facebook',
    content: "🎃 BOO-TIFUL NEWS! 🎃\n\nOur Halloween Dad Collection is HERE!\n\nBecause scary movies are cool, but dad jokes are TERRIFYING! 😱😂\n\n👻 \"Boo Sheet, I'm a Dad\" Tee\n🦇 \"Resting Witch Face (On Mondays)\" Hoodie\n💀 \"Dead Tired Dad\" PJs\n\n🕷️ HALLOWEEN SPECIAL:\n20% OFF with code SPOOKYDAD\nValid through Oct 25th!\n\nPerfect for:\n✅ Halloween parties\n✅ Trick-or-treating with kids\n✅ Everyday dad life\n\nShop: [LINK]\n\n#Halloween #DadCostume #DadJokes #HalloweenShirts",
    suggestedHashtags: ['#Halloween', '#DadLife', '#FunnyShirts', '#HalloweenCostume'],
    postingTip: 'Start October 1st. Halloween shopping peaks early Oct!'
  },

  // CHRISTMAS - Dad Joke Store
  {
    name: 'Christmas Gift Guide Launch',
    holiday: 'christmas',
    platform: 'instagram',
    content: "🎄 'TIS THE SEASON FOR DAD JOKES! 🎄\n\nOur Christmas Collection is LIVE and it's SLEIGH-ing! 😂\n\n🎅 \"Sleigh My Name\" Ugly Sweater\n❄️ \"Chillin' Like A Villain (In My Recliner)\" Hoodie\n🎁 \"Dear Santa, I Can Explain...\" Tee\n\n✨ HOLIDAY DEALS:\n🎁 Buy 2, Get 20% OFF\n📦 FREE Gift Wrapping\n🎅 Ships within 24 hours!\n\nPerfect for White Elephant, family photos, or just being the funniest dad at dinner! 😄\n\nLink in bio! 🎄\n\n#Christmas #DadGifts #UglySweater #ChristmasGifts",
    suggestedHashtags: ['#ChristmasGifts', '#UglySweaterSeason', '#DadJokes', '#HolidayShopping'],
    postingTip: 'Launch Nov 1st. Ugly sweater season starts early!'
  },
  {
    name: 'Christmas Countdown - Free Shipping',
    holiday: 'christmas',
    platform: 'facebook',
    content: "🎅 10 DAYS UNTIL CHRISTMAS! 🎅\n\nPanic mode activated? We got you! 😅\n\n🎁 GUARANTEED DELIVERY if you order in the next 48 hours!\n🚚 FREE 2-DAY SHIPPING on ALL orders!\n🎄 No code needed - auto-applied!\n\nTOP SELLERS:\n1. \"Dad Bod - Powered by Cookies & Milk\" Tee\n2. \"Naughty List Champion\" Hoodie\n3. \"Santa's Favorite Dad\" Mug Set\n\nDon't let Dad down! Order now: [LINK]\n\n#Christmas #LastMinuteGifts #FreeShipping #DadGifts",
    suggestedHashtags: ['#ChristmasGifts', '#LastMinute', '#FreeShipping', '#DadJokes'],
    postingTip: 'Post Dec 15th. Creates urgency before cutoff!'
  },

  // MOTHER'S DAY - For Moms of Dads/Kids
  {
    name: "Mother's Day - Gifts FROM Dads",
    holiday: 'mothers-day',
    platform: 'facebook',
    content: "💐 DADS: Don't Mess This Up! 💐\n\nMother's Day is [DATE] and Mom deserves something THOUGHTFUL!\n\n(Or at least something that'll make her laugh 😂)\n\nGifts She'll Actually Love:\n🌸 \"Mom Fuel\" Coffee Mug Set\n💕 \"World's Okayest Mom\" Matching Tee\n🎁 Mom & Dad Joke Combo Packs\n\n🌟 SPECIAL FOR MOMS:\nFREE \"Super Mom\" Gift Wrap\n+ Handwritten Card Option\n\nOrder by [DATE] for delivery!\n\nShop: [LINK]\n\n#MothersDay #GiftsForMom #DadHelp #MomGifts",
    suggestedHashtags: ['#MothersDay', '#MomGifts', '#DadLife'],
    postingTip: 'Post early May. Target dads who need help!'
  }
];

interface HolidayCampaignTemplatesProps {
  onUseTemplate: (platform: SocialPlatform, content: string, name: string) => void;
}

export function HolidayCampaignTemplates({ onUseTemplate }: HolidayCampaignTemplatesProps) {
  const [selectedHoliday, setSelectedHoliday] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');

  const filteredTemplates = holidayTemplates.filter(template => {
    const matchesHoliday = selectedHoliday === 'all' || template.holiday === selectedHoliday;
    const matchesPlatform = selectedPlatform === 'all' || template.platform === selectedPlatform;
    return matchesHoliday && matchesPlatform;
  });

  const holidayInfo = {
    valentines: { emoji: '💝', name: "Valentine's Day", color: '#e91e63' },
    'fathers-day': { emoji: '👔', name: "Father's Day", color: '#1976d2' },
    halloween: { emoji: '🎃', name: 'Halloween', color: '#ff6f00' },
    christmas: { emoji: '🎄', name: 'Christmas', color: '#4caf50' },
    'mothers-day': { emoji: '💐', name: "Mother's Day", color: '#9c27b0' },
  };

  return (
    <div className="holiday-campaigns">
      <div className="holiday-header">
        <h2>🎯 Holiday Campaign Templates</h2>
        <p>Pre-written posts for your seasonal campaigns - tailored for dad joke products!</p>
      </div>

      <div className="holiday-filters">
        <div className="holiday-selector">
          <button
            className={`holiday-btn ${selectedHoliday === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedHoliday('all')}
          >
            All Holidays
          </button>
          {Object.entries(holidayInfo).map(([key, info]) => (
            <button
              key={key}
              className={`holiday-btn ${selectedHoliday === key ? 'active' : ''}`}
              onClick={() => setSelectedHoliday(key)}
              style={{ borderColor: selectedHoliday === key ? info.color : undefined }}
            >
              {info.emoji} {info.name}
            </button>
          ))}
        </div>

        <select
          value={selectedPlatform}
          onChange={e => setSelectedPlatform(e.target.value as any)}
          className="platform-filter"
        >
          <option value="all">All Platforms</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="pinterest">Pinterest</option>
          <option value="tiktok">TikTok</option>
        </select>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="empty-state">
          <p>No templates found for these filters</p>
        </div>
      ) : (
        <div className="holiday-template-grid">
          {filteredTemplates.map((template, index) => {
            const holiday = holidayInfo[template.holiday];
            return (
              <div key={index} className="holiday-template-card">
                <div className="holiday-template-header">
                  <div className="holiday-badge" style={{ backgroundColor: holiday.color }}>
                    {holiday.emoji} {holiday.name}
                  </div>
                  <div className="platform-badge-small">
                    {template.platform}
                  </div>
                </div>

                <h3>{template.name}</h3>

                <div className="template-content">
                  <pre>{template.content}</pre>
                </div>

                <div className="template-meta">
                  <div className="suggested-hashtags">
                    <strong>Suggested Hashtags:</strong>
                    <div className="hashtag-list-preview">
                      {template.suggestedHashtags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="hashtag-preview">{tag}</span>
                      ))}
                      {template.suggestedHashtags.length > 3 && (
                        <span className="hashtag-more">+{template.suggestedHashtags.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="posting-tip">
                    <strong>💡 Tip:</strong> {template.postingTip}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => onUseTemplate(template.platform, template.content, template.name)}
                >
                  Use This Template
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="holiday-planning-tips">
        <h3>📅 Holiday Marketing Timeline</h3>
        <div className="timeline-grid">
          <div className="timeline-item">
            <div className="timeline-date">💝 Valentine's Day</div>
            <div className="timeline-details">
              <strong>Start:</strong> Jan 20th<br />
              <strong>Peak:</strong> Feb 1-13<br />
              <strong>Delivery Cutoff:</strong> Feb 10th
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">💐 Mother's Day</div>
            <div className="timeline-details">
              <strong>Start:</strong> April 20th<br />
              <strong>Peak:</strong> May 1-10<br />
              <strong>Delivery Cutoff:</strong> May 7th
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">👔 Father's Day</div>
            <div className="timeline-details">
              <strong>Start:</strong> May 15th<br />
              <strong>Peak:</strong> June 1-14<br />
              <strong>Delivery Cutoff:</strong> June 12th
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">🎃 Halloween</div>
            <div className="timeline-details">
              <strong>Start:</strong> Sept 15th<br />
              <strong>Peak:</strong> Oct 1-25<br />
              <strong>Best Days:</strong> Weekends in Oct
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">🎄 Christmas</div>
            <div className="timeline-details">
              <strong>Start:</strong> Nov 1st<br />
              <strong>Peak:</strong> Nov 20 - Dec 10<br />
              <strong>Delivery Cutoff:</strong> Dec 15th
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
