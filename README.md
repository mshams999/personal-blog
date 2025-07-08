# 🌟 Mohamed Shams - Personal Blog & Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/bc1d1f65-001a-47ce-bdf8-49af4610de64/deploy-status)](https://app.netlify.com/projects/mohamedshams155/deploys)

A beautifully designed personal blog and portfolio website for Dr. Mohamed Shams Abdelaziz, Emergency Medicine Doctor. Built with modern web technologies featuring a clean, responsive design with dark/light mode support, blog functionality, newsletter integration, and professional CV presentation.

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
- **TinaCMS integration** for easy content management

### 📧 Integrations
- **Newsletter signup** with Firebase/Resend integration
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

### Content & CMS
- **TinaCMS** - Git-based content management
- **MDX** - Markdown with React components
- **JSON-based content** - Easy content management

### Integrations
- **Firebase** - Analytics and backend services
- **Google Analytics 4** - Website analytics
- **Resend** - Email delivery service
- **Disqus** - Comment system

## 📦 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git
- Code editor (VS Code recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/mshams999/personal-blog.git
cd personal-blog

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your API keys in .env file
# See guides/SECURITY_GUIDE.md for details

# Start development server
npm run dev
```

### Development with TinaCMS

```bash
# Start development with TinaCMS
npm run tina:dev

# Access the CMS admin interface
# Visit: http://localhost:5173/admin
```

## 📁 Project Structure

```
personal-blog/
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── data/              # Content and configuration
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API integrations
│   └── utils/             # Utility functions
├── public/                # Static assets
├── guides/                # Detailed documentation
├── tina/                  # TinaCMS configuration
└── functions/             # Firebase Cloud Functions
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with your API credentials:

```bash
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id

# TinaCMS (for content management)
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token

# Disqus (Optional)
REACT_APP_DISQUS_SHORTNAME=your_disqus_shortname
```

## 📖 Documentation

For detailed setup and configuration guides, see the [`guides/`](./guides/) directory:

- **[Security Guide](./guides/SECURITY_GUIDE.md)** - Environment variables and API keys
- **[TinaCMS Setup](./guides/TINACMS_SETUP_GUIDE.md)** - Content management system
- **[Deployment Guide](./guides/DEPLOYMENT_GUIDE.md)** - Deploy to Netlify/Vercel
- **[Firebase Setup](./guides/FIREBASE_SETUP_GUIDE.md)** - Analytics and backend
- **[Newsletter Setup](./guides/NEWSLETTER_TROUBLESHOOTING.md)** - Email integration
- **[Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md)** - Development best practices

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run tina:dev` - Start development with TinaCMS
- `npm run tina:build` - Build TinaCMS
- `npm run tina:admin` - Start TinaCMS admin interface

## 🌐 Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch. For manual deployment:

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Set up environment variables in your hosting dashboard

## 👨‍⚕️ Author

**Dr. Mohamed Shams Abdelaziz**
- Emergency Medicine Doctor
- Location: Saudi Arabia, Turaif
- Email: [shamsmohamed155@gmail.com](mailto:shamsmohamed155@gmail.com)
- LinkedIn: [mohamedshamsms](https://www.linkedin.com/in/mohamedshamsms/)
- GitHub: [mshams999](https://github.com/mshams999)
- Twitter: [MohamedShams936](https://x.com/MohamedShams936)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help with:
- Setting up the development environment
- Configuring integrations
- Deploying the site
- Content management

Please refer to the documentation in the [`guides/`](./guides/) directory or open an issue.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Content management powered by [TinaCMS](https://tina.io/)
- Deployed on [Netlify](https://netlify.com/)

---

⭐ Star this repository if you find it helpful!