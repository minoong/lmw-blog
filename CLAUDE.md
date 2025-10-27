# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal tech blog built with Next.js 16 (App Router) and MDX, inspired by Nextra's blog theme. Features a dark/light theme system, MDX-based content management, and a scroll-aware navigation header.

## Development Commands

```bash
# Install dependencies (required - this project uses pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint code
pnpm lint
```

## Architecture

### MDX Content System

All content is file-based using MDX format. The content system is centralized in `src/lib/blog.ts`:

- **Blog posts**: `src/content/blog/*.mdx` - Sorted by date, supports tags and categories
- **Projects**: `src/content/projects/*.mdx` - Portfolio projects with GitHub/demo links
- **Static pages**: MDX pages in `src/app/about/` and `src/content/career.mdx`

Key functions in `src/lib/blog.ts`:
- `getBlogPosts()` - Returns all posts sorted by date
- `getBlogPost(slug)` - Fetches single post
- `getProjects()` - Returns all projects
- `getAllTags()` - Extracts unique tags from all posts
- `getPostsByTag(tag)` - Filters posts by tag

All MDX files use gray-matter for frontmatter parsing. Required frontmatter fields vary by content type (see README.md examples).

### MDX Rendering Pipeline

1. **Custom Components**: `mdx-components.tsx` defines styled components for all MDX elements (headings, links, code blocks, etc.)
2. **Rehype/Remark Plugins**:
   - `rehype-highlight` for syntax highlighting (GitHub Dark theme)
   - `rehype-slug` and `rehype-autolink-headings` for automatic heading IDs and anchor links
   - `remark-gfm` for GitHub Flavored Markdown
3. **Blog Post Rendering**: Uses `next-mdx-remote/rsc` in `src/app/blog/[slug]/page.tsx`
4. **Table of Contents**: `TableOfContents.tsx` uses IntersectionObserver to track active headings and highlight them in the sidebar

### Theme System

Dark/light mode implementation using `next-themes`:
- `ThemeProvider` wraps the app in `layout.tsx` with `suppressHydrationWarning` on `<html>` to prevent flash
- All components use Tailwind's `dark:` prefix for dark mode styles
- Color system: Blue accent colors (`blue-600/blue-400`) with gray backgrounds (`gray-50/gray-950`)
- Theme toggle button in Navigation component

### Navigation Behavior

The Navigation component uses a custom `useSpyElem` hook (`src/lib/useSpyElem.ts`) for scroll-aware behavior:
- **Fixed positioning** with dynamic `marginTop` - slides up when scrolling down, slides back when scrolling up
- **Threshold**: Only hides after scrolling past configurable threshold (currently 15px)
- **Smooth transitions**: Uses `transition-[margin-top] duration-300 ease-in-out`
- Layout compensation: Main content has `pt-24` to prevent overlap with fixed nav

The hook tracks scroll direction, transition points, and calculates margin dynamically. It returns `ref` and `marginTop` values.

### Routing Structure

App Router pages:
- `/` - Home page showcasing recent posts and projects
- `/about` - About page (MDX)
- `/career` - Career history with table of contents sidebar
- `/projects` - Project showcase grid
- `/blog` - Blog listing with tag filtering
- `/blog/[slug]` - Individual blog post with code highlighting and ToC
- `/blog/tags/[tag]` - Posts filtered by tag
- `/sitemap.ts` and `/robots.ts` - SEO optimization

### Styling Approach

- **Tailwind CSS v4** with custom config in `tailwind.config.ts`
- Dark mode: `class` strategy (not `media`)
- Typography: Geist Sans (body) and Geist Mono (code)
- Consistent card styling: `rounded-xl border bg-white dark:bg-gray-800` with hover effects
- Gradient text for branding: `bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`

### ESLint Configuration

Strict import ordering and type safety rules in `eslint.config.mjs`:
- `@typescript-eslint/consistent-type-imports` - Use `type` imports for types
- `import/order` - Enforced order: builtin → external → internal (`@/*`) → parent/sibling
- `newlines-between: 'always'` - Blank lines between import groups
- Prettier integration with `eslint-plugin-prettier`

## Key Conventions

1. **Content Files**: Always use `.mdx` extension in `src/content/`
2. **Component Imports**: Use `@/` alias for absolute imports from `src/`
3. **Type Imports**: Separate type imports using `import type` syntax
4. **Dark Mode**: Always add dark mode variants when styling with Tailwind
5. **Fixed Navigation**: Main content needs top padding (`pt-24`) to account for fixed header
6. **Date Formatting**: Use `date-fns` for consistent date display (`format()` function)

## Adding New Content

### Blog Post
Create `src/content/blog/post-name.mdx`:
```mdx
---
title: "Post Title"
date: "2025-01-20"
description: "Post description"
tags: ["Next.js", "React"]
category: "frontend"
---

# Content here
```

### Project
Create `src/content/projects/project-name.mdx`:
```mdx
---
title: "Project Name"
description: "Project description"
tags: ["React", "TypeScript"]
github: "https://github.com/username/repo"
link: "https://demo.com"
---

Project details...
```

## Common Modifications

- **Navigation items**: Edit `navItems` array in `src/components/layout/Navigation.tsx`
- **Theme colors**: Modify `src/app/globals.css`
- **MDX styling**: Update `mdx-components.tsx`
- **Site metadata**: Update `src/app/layout.tsx` and domain in `sitemap.ts`/`robots.ts`
