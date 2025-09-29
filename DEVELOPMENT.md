# Bhargav Achary's Personal Website - Development Guide

## Overview
This is a Jekyll-based personal website and blog using the Chirpy theme, showcasing work in hardware development, computer architecture, and content creation.

## Quick Start

### Prerequisites
- Ruby (>= 2.7)
- Bundler
- Git

### Local Development
```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build
```

## Site Configuration

### Analytics Setup
To enable Google Analytics:
1. Create a Google Analytics 4 property
2. Get your GA4 ID (format: G-XXXXXXXXXX)
3. Add it to `_config.yml`:
   ```yaml
   analytics:
     google:
       id: G-XXXXXXXXXX
   ```

### Comments Setup (Giscus)
1. Visit [giscus.app](https://giscus.app)
2. Enable Discussions on your GitHub repo
3. Configure giscus and get the repo_id and category_id
4. Update `_config.yml` with the generated values

### Avatar Setup
1. Add your profile image to `assets/img/` directory
2. Update `_config.yml`:
   ```yaml
   avatar: /assets/img/your-avatar.jpg
   ```

## Content Guidelines

### Blog Posts
- Place in `_posts/` directory
- Use format: `YYYY-MM-DD-title.md`
- Include proper front matter:
  ```yaml
  ---
  layout: post
  title: "Your Post Title"
  date: YYYY-MM-DD
  categories: [category1, category2]
  tags: [tag1, tag2]
  ---
  ```

### Pages
- Static pages go in `_tabs/` directory
- Follow existing format with proper front matter

## Deployment
- Automatically deployed via GitHub Pages on push to `main` branch
- Site available at: https://bhargavarch.github.io

## Theme Documentation
For advanced customization, refer to the [Chirpy theme documentation](https://github.com/cotes2020/jekyll-theme-chirpy).

## Roadmap
- [ ] Add portfolio/projects section
- [ ] Create technical tutorial series
- [ ] Add photography gallery
- [ ] Implement search functionality
- [ ] Add newsletter signup
