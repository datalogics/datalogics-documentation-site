# Datalogics Documentation Site

[![built with nuxt][nuxt-src]][nuxt-href]
[![License][license-src]][license-href]

A modern, beautifully designed documentation site for Datalogics PDF tools and APIs, built with Nuxt 3, shadcn-vue, and featuring an AI-powered assistant.

## 🐕 About

This is the official documentation site for Datalogics, showcasing our comprehensive suite of PDF development tools and APIs. The site features:

- **Adobe PDF Library** - Complete PDF creation, editing, and manipulation
- **Adobe PDF Converter** - High-quality PDF conversion tools
- **Adobe PDF Forms Extension** - Advanced form processing capabilities
- **PDF 2 Image SDK** - Convert PDFs to various image formats
- **PDF 2 Image** - Command-line PDF to image conversion
- **PDF Checker** - PDF validation and compliance checking
- **PDF Optimizer** - PDF compression and optimization
- **PDF Forms Flattener** - Flatten interactive PDF forms

## ✨ Features

- **Modern Design** - Built with shadcn-vue components and Tailwind CSS
- **AI Assistant** - Scout AI powered by Kapa.ai for intelligent documentation search
- **Dark Mode** - Full dark/light theme support
- **Responsive** - Optimized for desktop, tablet, and mobile devices
- **Search** - Fast, indexed search across all documentation
- **Code Highlighting** - Syntax highlighting for multiple programming languages
- **Interactive Components** - Tabs, accordions, callouts, and more
- **SEO Optimized** - Built-in SEO features and meta tags

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/datalogics/datalogics-documentation-site.git
   cd datalogics-documentation-site
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables
   ```bash
   # Create a .env file in the project root
   echo "KAPA_WEBSITE_ID=your_kapa_website_id_here" > .env
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🤖 Scout AI Setup

The documentation site includes Scout, an AI-powered assistant that helps users find answers in the documentation.

### Getting Your Kapa Website ID

1. Go to [https://kapa.ai](https://kapa.ai)
2. Sign up or log in to your account
3. Create a new project or select an existing one
4. Copy the website ID from your project settings
5. Add it to your `.env` file:
   ```env
   KAPA_WEBSITE_ID=your_actual_website_id_here
   ```

### Scout Features

- **Floating Button** - Always accessible in the bottom-right corner
- **Custom Styling** - Gradient outline with dog emoji and hover animations
- **Smart Search** - Searches across documentation, website, and knowledge base
- **Example Questions** - Pre-configured helpful questions to get users started
- **Mobile Responsive** - Optimized for all device sizes

## 📁 Project Structure

```
datalogics-documentation-site/
├── app/                    # App configuration
├── assets/                 # Static assets (CSS, images)
├── components/             # Vue components
│   ├── content/           # Content-specific components
│   ├── layout/            # Layout components
│   ├── ui/                # shadcn-vue UI components
│   └── ScoutButton.vue    # AI assistant button
├── content/               # Documentation content (Markdown)
│   ├── 1.adobe-pdf-library/
│   ├── 2.adobe-pdf-converter/
│   └── ...
├── plugins/               # Nuxt plugins
│   └── kapa.client.ts    # Scout AI integration
├── public/                # Public static files
└── nuxt.config.ts         # Nuxt configuration
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Adding Content

Documentation is written in Markdown and stored in the `content/` directory. Each section has its own folder with an `_dir.yml` file for configuration.

### Customizing Scout

The Scout AI button can be customized by modifying `components/ScoutButton.vue`:

```vue
<template>
  <!-- Floating button (default) -->
  <ScoutButton />

  <!-- Inline button -->
  <ScoutButton :floating="false" />

  <!-- Custom text -->
  <ScoutButton
    button-text="Ask AI"
    button-title="I'll help you find what you need!"
  />
</template>
```

## 🎨 Theming

The site uses a customizable theme system built on shadcn-vue. Colors, fonts, and other design tokens can be modified in:

- `assets/css/themes.css` - Theme variables
- `app.config.ts` - Site configuration
- `tailwind.config.ts` - Tailwind CSS configuration

## 📚 Documentation Sections

- **Adobe PDF Library** - Core PDF manipulation library
  - C++ API documentation
  - .NET API documentation
  - Java API documentation
  - Best practices and examples

- **Adobe PDF Converter** - PDF conversion tools
  - API reference
  - Release notes

- **Adobe PDF Forms Extension** - Form processing
  - User guide
  - Release notes

- **PDF 2 Image SDK** - Image conversion SDK
  - Implementation guide
  - Release notes

- **PDF 2 Image** - Command-line tool
  - Command syntax
  - Tutorials and examples

- **PDF Checker** - Validation tool
  - Usage guide
  - JSON profiles
  - Error codes

- **PDF Optimizer** - Compression tool
  - Command-line syntax
  - Optimization options

- **PDF Forms Flattener** - Form flattening
  - Command-line usage
  - Examples

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [Nuxt 3](https://nuxt.com/) - Vue.js framework
- [shadcn-vue](https://www.shadcn-vue.com/) - Beautiful UI components
- [Nuxt Content](https://content.nuxt.com/) - Content management
- [Kapa.ai](https://kapa.ai/) - AI-powered documentation search
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

Built with ❤️ by the Datalogics team

[nuxt-src]: https://img.shields.io/badge/Built%20With%20Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com/
[license-src]: https://img.shields.io/github/license/datalogics/datalogics-documentation-site.svg?style=flat&colorA=18181b&colorB=18181b
[license-href]: https://github.com/datalogics/datalogics-documentation-site/blob/main/LICENSE
