# Ruki - Personal Blog

A beautifully designed personal blog application built with React, Tailwind CSS, and MDX support.

## Features

- 🎨 **Modern Design**: Clean, minimalist interface with light/dark mode support
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🌙 **Dark Mode**: Automatic theme switching with manual toggle
- 📝 **MDX Support**: Write content in Markdown with React components
- ⚡ **Fast**: Built with Vite for optimal performance
- 🎯 **SEO Friendly**: Semantic HTML and proper meta tags
- 🔧 **Customizable**: Easy to modify colors, fonts, and layout

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **MDX** - Markdown with React components
- **React Router** - Client-side routing
- **Lucide Icons** - Beautiful icon library
- **date-fns** - Date manipulation library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ruki-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   ├── Layout.jsx      # Page layout wrapper
│   ├── PostCard.jsx    # Blog post card
│   └── AuthorBio.jsx   # Author information
├── contexts/           # React Context providers
│   ├── DataContext.jsx # Blog data management
│   └── ThemeContext.jsx # Theme management
├── data/              # Static data files
│   └── info.json      # Blog configuration and content
├── pages/             # Page components
│   ├── HomePage.jsx   # Home page with post grid
│   ├── SinglePostPage.jsx # Individual post view
│   ├── CVPage.jsx     # CV/Resume page
│   └── StyleGuidePage.jsx # Design system showcase
├── App.jsx            # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles and Tailwind imports
```

## Configuration

### Site Metadata

Edit `src/data/info.json` to customize:

- Site title and description
- Author information
- Social media links
- Navigation menu
- Blog posts and categories

### Styling

The design system is built with Tailwind CSS. Key customizations:

- **Colors**: Primary rose/pink palette with dark mode support
- **Fonts**: Inter for body text, Nunito for headings
- **Components**: Reusable button, card, and form styles

### Content Management

Blog posts are defined in `src/data/info.json` with the following structure:

```json
{
  "id": "post-1",
  "slug": "post-url-slug",
  "title": "Post Title",
  "excerpt": "Brief description...",
  "date": "2025-07-01T10:00:00Z",
  "readTime": 5,
  "featuredImage": "https://example.com/image.jpg",
  "authorId": "author-1",
  "categoryId": "cat-1",
  "tags": ["tag1", "tag2"],
  "mdxContentPath": "/content/posts/post-1.mdx"
}
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: {
    50: '#FFF9F9',
    500: '#F43F5E',
    // ... other shades
  }
}
```

### Fonts

Update the font imports in `src/index.css` and modify the Tailwind config:

```javascript
fontFamily: {
  'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  'heading': ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
}
```

### Layout

Components are built with responsive design principles:

- Mobile-first approach
- Flexible grid systems
- Smooth animations and transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the repository.

---

Built with ❤️ using React and Tailwind CSS
