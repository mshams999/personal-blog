# 🌟 Mohamed Shams - Personal Blog & Portfolio

A beautifully designed personal blog and portfolio website built with modern web technologies. Features a clean, responsive design with dark/light mode support, blog functionality, newsletter integration, and professional CV presentation.

## ✨ Features

### 🎨 Design & UI
- **Modern, clean design** with beautiful typography
- **Dark/Light mode toggle** with smooth transitions
- **Fully responsive** - looks great on all devices
- **Smooth animations** and hover effects
- **Professional color scheme** with blue accents

### 📝 Blog Functionality
- **Featured posts carousel** with auto-sliding
- **Masonry-style post grid** with varying card sizes
- **Individual post pages** with full content
- **Category and tag system** for organization
- **Reading time estimation** for better UX
- **Search functionality** (ready for implementation)

### 📧 Integrations
- **MailChimp Newsletter** - GDPR compliant signup form
- **Disqus Comments** - Community engagement on posts
- **Google Analytics** - Visitor tracking and insights
- **Social media links** - Professional networking

### 💼 Professional Features
- **Interactive CV/Resume page** with modern layout
- **Contact information** and professional details
- **Skills and experience** showcase
- **Training and certifications** display

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon system

### Content & Data
- **MDX** - Markdown with React components
- **JSON-based content** - Easy content management
- **Date-fns** - Date formatting and manipulation

### Integrations
- **Google Analytics 4** - Website analytics
- **MailChimp API** - Email marketing
- **Disqus** - Comment system

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Git
- Code editor (VS Code recommended)

### Local Development
\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/mohamed-shams-blog.git
cd mohamed-shams-blog

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your API keys in .env file
# - MailChimp credentials
# - Google Analytics Measurement ID
# - Disqus shortname (optional)

# Start development server
npm run dev
\`\`\`

### Environment Configuration
Create a \`.env\` file with your API credentials:
\`\`\`bash
# MailChimp Configuration
REACT_APP_MAILCHIMP_API_KEY=your_mailchimp_api_key
REACT_APP_MAILCHIMP_SERVER_PREFIX=your_server_prefix
REACT_APP_MAILCHIMP_AUDIENCE_ID=your_audience_id
REACT_APP_MAILCHIMP_SIGNUP_URL=your_signup_url

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Disqus (Optional)
REACT_APP_DISQUS_SHORTNAME=your_disqus_shortname
\`\`\`

## 🌐 Deployment

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: \`npm run build\`
3. Set publish directory: \`dist\`
4. Add environment variables in the hosting platform

### Custom Domain Setup
1. Add your domain in hosting platform settings
2. Configure DNS records with your domain provider
3. Enable HTTPS (usually automatic)

## 📊 Analytics & Tracking

### Google Analytics
- Automatic page view tracking
- Custom event tracking for user interactions
- Newsletter signup conversion tracking
- Blog post engagement metrics

### Available Events
- Blog post views and interactions
- Newsletter subscription attempts
- CV page visits and downloads
- External link clicks
- Search queries (when implemented)

## 🔧 Configuration

### Content Management
- **Blog posts**: Add MDX files to \`public/content/posts/\`
- **Site metadata**: Edit \`src/data/info.json\`
- **Navigation**: Update navigation array in info.json
- **Categories**: Modify categories in info.json

### Customization
- **Colors**: Update Tailwind config for brand colors
- **Typography**: Modify font families in CSS
- **Layout**: Adjust component structures
- **Animations**: Customize transition durations

## 📁 Project Structure

\`\`\`
├── public/
│   ├── content/posts/       # Blog post MDX files
│   ├── pictures/           # Images and media
│   └── vite.svg           # Favicon
├── src/
│   ├── components/        # React components
│   │   ├── AuthorBio.jsx     # Author information
│   │   ├── Carousel.jsx      # Featured posts carousel
│   │   ├── DisqusComments.jsx # Comment system
│   │   ├── Footer.jsx        # Site footer
│   │   ├── Header.jsx        # Site header
│   │   ├── Layout.jsx        # Page layout wrapper
│   │   ├── Newsletter.jsx    # Email signup form
│   │   ├── PostCard.jsx      # Blog post cards
│   │   └── SearchBox.jsx     # Search functionality
│   ├── config/            # Configuration files
│   │   ├── analytics.js      # Google Analytics config
│   │   ├── disqus.js        # Disqus configuration
│   │   └── mailchimp.js     # MailChimp integration
│   ├── contexts/          # React contexts
│   │   ├── DataContext.jsx   # Blog data management
│   │   └── ThemeContext.jsx  # Dark/light mode
│   ├── data/              # Content and configuration
│   │   └── info.json        # Site metadata and content
│   ├── hooks/             # Custom React hooks
│   │   └── useAnalytics.js  # Analytics tracking
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx     # Home page with post grid
│   │   ├── SinglePostPage.jsx # Individual post view
│   │   ├── CVPage.jsx       # CV/Resume page
│   │   └── StyleGuidePage.jsx # Design system
│   ├── utils/             # Utility functions
│   │   └── search.js        # Search functionality
│   ├── App.jsx            # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles and Tailwind
└── package.json          # Dependencies and scripts
\`\`\`

## 🛠️ Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## 🔒 Security & Privacy

- **Environment variables** for sensitive data
- **GDPR-compliant** newsletter signup
- **IP anonymization** in Google Analytics
- **Secure API integrations**
- **No hardcoded credentials** in source code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍⚕️ Author

**Dr. Mohamed Shams Abdelaziz**
- Emergency Medicine Doctor
- Location: Saudi Arabia, Turaif
- Email: shamsmohamed155@gmail.com
- LinkedIn: [mohamedshamsms](https://www.linkedin.com/in/mohamedshamsms/)
- GitHub: [mshams999](https://github.com/mshams999)

## 🤝 Contributing

While this is a personal website, suggestions and improvements are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 🆘 Support

If you encounter any issues or have questions:
1. Check the setup guides in the repository
2. Review the troubleshooting sections
3. Open an issue on GitHub

---

Built with ❤️ using React, Vite, and Tailwind CSS
