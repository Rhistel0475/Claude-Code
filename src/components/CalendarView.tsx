import { useState } from 'react';
import { useSocialMedia } from '../SocialMediaContext';
import type { PostTemplate } from '../socialMediaTypes';

interface CalendarViewProps {
  onEditPost: (post: PostTemplate) => void;
}

export function CalendarView({ onEditPost }: CalendarViewProps) {
  const { state } = useSocialMedia();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return state.templates.filter(post => {
      if (!post.scheduledDate) return false;
      const postDate = new Date(post.scheduledDate).toISOString().split('T')[0];
      return postDate === dateStr;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const posts = getPostsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${posts.length > 0 ? 'has-posts' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="day-number">{day}</div>
          {posts.length > 0 && (
            <div className="post-indicators">
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="post-indicator"
                  style={{ backgroundColor: getPlatformColor(post.platform) }}
                  title={`${post.platform}: ${post.name}`}
                />
              ))}
              {posts.length > 3 && (
                <div className="post-count">+{posts.length - 3}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: '#1877f2',
      instagram: '#e4405f',
      twitter: '#1da1f2',
      linkedin: '#0077b5',
      pinterest: '#e60023',
      tiktok: '#000000',
    };
    return colors[platform] || '#999';
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : [];

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get upcoming posts for quick view
  const upcomingPosts = state.templates
    .filter(p => p.scheduledDate && new Date(p.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
    .slice(0, 5);

  return (
    <div className="calendar-view">
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth} className="calendar-nav">◀ Prev</button>
          <h2>{monthYear}</h2>
          <button onClick={nextMonth} className="calendar-nav">Next ▶</button>
        </div>

        <div className="calendar-actions">
          <button onClick={goToToday} className="btn-secondary">📅 Today</button>
          <div className="calendar-legend">
            <span className="legend-item"><div className="legend-dot" style={{background: '#1877f2'}}></div> Facebook</span>
            <span className="legend-item"><div className="legend-dot" style={{background: '#e4405f'}}></div> Instagram</span>
            <span className="legend-item"><div className="legend-dot" style={{background: '#1da1f2'}}></div> Twitter</span>
            <span className="legend-item"><div className="legend-dot" style={{background: '#0077b5'}}></div> LinkedIn</span>
          </div>
        </div>

        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-grid">
          {renderCalendar()}
        </div>
      </div>

      <div className="calendar-sidebar">
        {selectedDate ? (
          <div className="selected-date-posts">
            <h3>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            {selectedPosts.length === 0 ? (
              <p className="no-posts">No posts scheduled for this day</p>
            ) : (
              <div className="date-posts-list">
                {selectedPosts.map(post => (
                  <div key={post.id} className="mini-post" onClick={() => onEditPost(post)}>
                    <div className="mini-post-header">
                      <span className="mini-platform" style={{ color: getPlatformColor(post.platform) }}>
                        {post.platform}
                      </span>
                      <span className="mini-time">
                        {new Date(post.scheduledDate!).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="mini-post-name">{post.name}</div>
                    <div className="mini-post-preview">{post.content.substring(0, 60)}...</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="upcoming-posts">
            <h3>🔜 Upcoming Posts</h3>
            {upcomingPosts.length === 0 ? (
              <p className="no-posts">No upcoming scheduled posts</p>
            ) : (
              <div className="upcoming-posts-list">
                {upcomingPosts.map(post => (
                  <div key={post.id} className="upcoming-post" onClick={() => onEditPost(post)}>
                    <div className="upcoming-date">
                      {new Date(post.scheduledDate!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="upcoming-content">
                      <span className="upcoming-platform" style={{ color: getPlatformColor(post.platform) }}>
                        {post.platform}
                      </span>
                      <div className="upcoming-name">{post.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="calendar-stats">
          <h4>📊 This Month</h4>
          <div className="stat-item">
            <span className="stat-label">Total Posts:</span>
            <span className="stat-value">
              {state.templates.filter(p => {
                if (!p.scheduledDate) return false;
                const d = new Date(p.scheduledDate);
                return d.getMonth() === currentDate.getMonth() &&
                       d.getFullYear() === currentDate.getFullYear();
              }).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Scheduled:</span>
            <span className="stat-value">
              {state.templates.filter(p => p.status === 'scheduled').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Published:</span>
            <span className="stat-value">
              {state.templates.filter(p => p.status === 'published').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
