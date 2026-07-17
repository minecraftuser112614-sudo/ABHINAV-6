# ⚔️ ABHINAV TOOLS AND BOTS

A modern, animated dashboard for sharing and managing tools with a beautiful Admin Panel interface.

## 🌟 Features

### Public Dashboard
- ✅ Browse all uploaded tools and files
- ✅ Search functionality with real-time filtering
- ✅ Download tools directly
- ✅ View README files in modal popup
- ✅ Beautiful, animated background with Solo Leveling theme
- ✅ Responsive design for all devices

### Admin Panel
- ✅ Password-protected access (Password: `abhinav22456`)
- ✅ Upload files with descriptions
- ✅ Add README content for each tool
- ✅ Manage and delete uploaded files
- ✅ Configure social media links (Instagram & Discord)
- ✅ Beautiful admin interface with sidebar navigation

### Design Features
- 🎨 Modern gradient UI with purple and cyan theme
- ✨ Animated particle background
- 🌙 Dark mode design
- 📱 Fully responsive layout
- ⚡ Smooth transitions and animations

## 📋 Getting Started

### Files Structure
```
├── index.html      # Home page with User/Admin options
├── user.html       # Public dashboard
├── admin.html      # Admin panel
├── styles.css      # All styling
├── script.js       # Core functionality
└── README.md       # Documentation
```

### How to Use

1. **Open the application**: Open `index.html` in your browser
2. **Choose your role**:
   - **User**: Click "Enter as User" to browse tools
   - **Admin**: Click "Admin Panel" and enter password `abhinav22456`

### User Features
- Search for tools by name or keywords
- Sort by name or date
- Download files
- Read README documentation

### Admin Features
1. **Upload File**: Add new tools with:
   - File name
   - Description
   - Actual file upload
   - README content

2. **Manage Files**: View and delete uploaded files

3. **Manage README**: View all README files

4. **Social Links**: Add Instagram and Discord links

## 🔐 Admin Panel Password

**Default Password**: `abhinav22456`

Change this password by editing the `ADMIN_PASSWORD` variable in `script.js`

## 💾 Data Storage

- All data is stored in browser's `localStorage`
- Tools include: name, description, README, file data, and date
- Data persists across browser sessions

## 🎨 Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary: #6f42c1;
    --secondary: #00d4ff;
    --danger: #ff1744;
    /* ... more colors ... */
}
```

### Change Admin Password
Edit in `script.js`:
```javascript
const ADMIN_PASSWORD = 'your-new-password';
```

## 📱 Responsive Design

- Desktop (1024px+): Full layout with sidebar
- Tablet (768px - 1023px): Adjusted layout
- Mobile (below 768px): Stacked layout

## 🚀 Deployment

### GitHub Pages
1. Push files to GitHub repository
2. Go to Settings → Pages
3. Select main branch as source
4. Your site will be available at `username.github.io/repo-name`

### Other Hosting
- Netlify
- Vercel
- Any static hosting service

## 🌐 Social Links

Admin can configure social media links in the Admin Panel under "Social Links" section.

## 📝 Markdown Support in README

README files support basic Markdown:
- `# Heading 1`
- `## Heading 2`
- `**Bold text**`
- `*Italic text*`
- `` `Code` ``

## ⚙️ Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## 🎯 Features Coming Soon

- Backend API integration for cloud storage
- User authentication system
- File preview before download
- Rating system for tools
- Comments section
- Admin dashboard analytics

## 📄 License

Free to use and modify for personal or commercial projects.

## 👤 Author

**ABHINAV** - Created with ❤️

---

**Happy Tool Sharing! 🚀**