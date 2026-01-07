# Mobile App Setup Guide

Your Social Media Manager is now a **Progressive Web App (PWA)** that can be installed on your phone like a native app!

## 📱 Installing on Your Phone

### iPhone (iOS Safari)

1. Open Safari on your iPhone
2. Navigate to your app URL
3. Tap the **Share** button (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"** in the top right corner
6. The app icon will appear on your home screen!

### Android (Chrome)

1. Open Chrome on your Android device
2. Navigate to your app URL
3. Tap the **three dots** menu (⋮) in the top right
4. Tap **"Add to Home Screen"** or **"Install App"**
5. Confirm by tapping **"Add"** or **"Install"**
6. The app icon will appear on your home screen!

### Android (Samsung Internet)

1. Open Samsung Internet browser
2. Navigate to your app URL
3. Tap the **three lines** menu
4. Tap **"Add page to"** → **"Home screen"**
5. The app will be installed

## ✨ Mobile Features

### Touch-Optimized Interface
- **44px minimum touch targets** for all buttons
- Larger form inputs prevent accidental zooming on iOS
- Swipeable tabs for easy navigation
- Full-screen modals on mobile
- Responsive grid layouts

### Offline Support
- Works without internet connection
- Local data storage in your browser
- Service worker caches app for offline use

### Mobile-Specific Optimizations
- **Portrait & Landscape** support
- **Safe area** support for notched displays
- Touch feedback on buttons
- No accidental zoom on input fields
- Optimized for one-handed use

### Platform-Specific Features
- **iOS**: Splash screen support, status bar theming
- **Android**: Install prompt, theme color in task switcher
- **Both**: Push notification support (future feature)

## 🎨 Customization

### Change App Icon
Replace `/public/icon.svg` with your custom icon. Requirements:
- Square dimensions (512x512 recommended)
- SVG or PNG format
- For best results, use a 1:1 aspect ratio

### Generate PNG Icons from SVG
```bash
# Install imagemagick (if not installed)
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generate icons
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png
```

### Update App Name
Edit `/public/manifest.json`:
- `name`: Full app name
- `short_name`: Short name (max 12 chars for iOS)
- `description`: App description

## 🚀 Deployment Tips

### For Mobile Access

1. **Deploy to a web server** (Netlify, Vercel, GitHub Pages, etc.)
2. **HTTPS is required** for PWA features to work
3. Share the URL with your phone
4. Follow installation steps above

### Local Testing on Phone

1. **Start dev server**: `npm run dev`
2. **Find your local IP**:
   - Mac: System Preferences → Network
   - Windows: `ipconfig`
   - Linux: `ip addr show`
3. **Access from phone**: `http://YOUR_IP:5173`
4. Make sure phone is on **same WiFi network**

Example: `http://192.168.1.100:5173`

## 📊 Mobile Performance

### Responsive Breakpoints
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px
- **Landscape**: Special handling for mobile landscape

### Tested On
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Samsung Internet 14+
- ✅ iOS Chrome
- ✅ Android Firefox

## 🔧 Troubleshooting

### App not installing
- Make sure you're using **HTTPS** (required for PWA)
- Clear browser cache and try again
- Check that manifest.json is accessible

### Offline mode not working
- Check browser console for service worker errors
- Make sure service worker is registered
- Try clearing cache and re-installing

### iOS issues
- Safari only supports PWAs, other iOS browsers won't show install prompt
- Make sure all icons are specified in manifest
- Check that viewport meta tag is correct

### Android issues
- Chrome requires HTTPS for install prompt
- Check that manifest.json is properly formatted
- Ensure theme colors are valid hex codes

## 💡 Tips for Best Mobile Experience

1. **Add to home screen** for fastest access
2. **Enable notifications** (when prompted) for future features
3. **Use landscape mode** for easier typing on smaller devices
4. **Swipe to navigate** tabs on mobile
5. **Pull down to refresh** data (future feature)

## 🔐 Privacy & Data

- All data is stored **locally on your device**
- No data sent to external servers
- Export data regularly as backup
- Clearing browser data will delete app data

## 📱 Future Mobile Features

Planned enhancements:
- [ ] Push notifications for scheduled posts
- [ ] Camera integration for photos
- [ ] Share sheet integration
- [ ] Haptic feedback
- [ ] Dark mode
- [ ] Biometric authentication

---

**Need help?** Check the browser console for any errors or issues.
