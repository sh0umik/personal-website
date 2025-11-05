# Personal Portfolio Website

A modern, responsive portfolio website built with Next.js 16, TypeScript, and Tailwind CSS. Features a blog section, projects showcase, and comprehensive CV display.

🔗 **Live Site**: [https://sh0umik.github.io/personal-website](https://sh0umik.github.io/personal-website)

## Features

- ✅ Next.js 16 with Static Site Generation (SSG)
- ✅ TypeScript support
- ✅ Tailwind CSS with custom theme system
- ✅ Dark/Light mode with system preference detection
- ✅ Responsive design (mobile-first)
- ✅ Print-friendly styles
- ✅ Keyboard shortcuts (Cmd/Ctrl + K)
- ✅ SEO optimized with meta tags, sitemap, and robots.txt
- ✅ Blog section with markdown support
- ✅ Projects showcase
- ✅ Publications section

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown**: Marked
- **Icons**: Iconify React
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# or with npm
npm install
```

### Development

```bash
# Start development server
pnpm dev

# or with npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production (static export)
pnpm build

# The static files will be in the /out directory
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Home page
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing page
│   │   │   ├── [slug]/page.tsx     # Individual blog post page
│   │   │   └── content/            # Markdown blog posts
│   │   ├── projects/
│   │   │   └── page.tsx            # Projects showcase page
│   │   ├── globals.css             # Global styles and theme variables
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   ├── robots.ts               # Robots.txt configuration
│   │   └── manifest.ts             # PWA manifest
│   ├── components/
│   │   ├── icons/                   # Icon components
│   │   ├── sections/               # Section components (Hero, About, etc.)
│   │   ├── Section.tsx             # Reusable section wrapper
│   │   ├── ThemeSwitch.tsx         # Theme switcher component
│   │   ├── KeyboardManager.tsx     # Keyboard shortcuts handler
│   │   └── Navigation.tsx          # Navigation component
│   └── data/
│       ├── cv.json                 # Portfolio/CV data
│       └── projects.json           # Projects data
├── public/                         # Static assets (images, PDFs, etc.)
├── scripts/                        # Utility scripts (blog scraping, etc.)
└── .github/workflows/               # GitHub Actions workflows
```

## Customization

### Updating Portfolio Data

Edit `src/data/cv.json` to update your portfolio information including:
- Personal information
- Work experience
- Education
- Skills
- Publications

### Updating Projects

Edit `src/data/projects.json` to add or modify projects displayed on the projects page.

### Adding Blog Posts

1. Create a markdown file in `src/app/blog/content/`
2. Add metadata to `getBlogMetadata()` function in `src/app/blog/[slug]/page.tsx`
3. Update sitemap metadata in `src/app/sitemap.ts`

### Themes

Themes are configured in `src/app/globals.css` using CSS custom properties. Available themes:

- Default theme (orange)
- Blue theme
- Red theme
- Green theme
- Cyber theme
- Dark mode variants for all themes

## Deployment

This project is configured for GitHub Pages deployment using GitHub Actions.

### Automatic Deployment

1. Push to the `master` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. The site will be available at `https://sh0umik.github.io/personal-website`

### Manual Deployment

```bash
# Build static files
pnpm build

# The /out directory contains the static site
# Deploy the contents of /out to your hosting provider
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Fahim Shariar Shoumik**

- Website: [shoumik.me](http://shoumik.me)
- GitHub: [@sh0umik](https://github.com/sh0umik)
- LinkedIn: [fahimshariar](https://linkedin.com/in/fahimshariar)
