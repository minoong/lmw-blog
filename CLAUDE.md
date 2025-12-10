# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal tech blog built with Next.js 16 (App Router) and MDX, inspired by Nextra's blog theme. Features a dark/light theme system, MDX-based content management, scroll-aware navigation, Firebase analytics, Sentry error monitoring, and interactive Mermaid diagrams.

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

- **Blog posts**: `src/content/blog/*.mdx` - Sorted by date, supports tags, categories, and project linking
- **Toy Projects**: `src/content/toy-projects/*.mdx` - Personal side projects with links, GitHub, and related blog posts
- **Work Projects**: `src/content/projects/*.mdx` - Professional work projects with company info and custom ordering
- **Static pages**: MDX pages in `src/app/about/` and `src/app/career/`

Key types in `src/lib/blog.ts`:
- `Post` - Blog post with optional project link
- `ToyProject` - Personal projects with multiple links, priority sorting
- `WorkProject` - Professional projects with company, dates, and order
- `ProjectLink` - Prioritized external links for toy projects

Key functions in `src/lib/blog.ts`:
- `getBlogPosts()` - Returns all posts sorted by date (newest first)
- `getBlogPost(slug)` - Fetches single post
- `getToyProjects()` - Returns all personal projects with sorted links
- `getWorkProjects()` - Returns work projects sorted by company priority and order
- `getToyProject(slug)` - Fetches single toy project
- `getWorkProject(slug)` - Fetches single work project
- `getAllTags()` - Extracts unique tags from blog posts
- `getPostsByTag(tag)` - Filters posts by tag
- `getPostsByProject(projectSlug)` - Gets posts linked to a toy project
- `getAllProjectTags()` - Tags from both toy and work projects
- `getAllCompanies()` - Unique companies from work projects
- `getWorkProjectsByCompany(company)` - Filters work projects by company

All MDX files use gray-matter for frontmatter parsing. Required frontmatter fields vary by content type (see examples below).

### MDX Rendering Pipeline

1. **Custom Components**: Inline in `src/app/blog/[slug]/page.tsx` MDXRemote components prop
   - `pre` component detects `language-mermaid` code blocks and renders Mermaid diagrams
   - `a` component handles base path for internal links
   - `img` component handles base path for images and adds responsive styling
2. **Rehype/Remark Plugins**:
   - `rehype-highlight` for syntax highlighting (GitHub Dark theme)
   - `rehype-slug` and `rehype-autolink-headings` for automatic heading IDs and anchor links
   - `remark-gfm` for GitHub Flavored Markdown (tables, task lists, strikethrough)
3. **Blog Post Rendering**: Uses `next-mdx-remote/rsc` in `src/app/blog/[slug]/page.tsx`
4. **Table of Contents**: `TableOfContents.tsx` uses IntersectionObserver to track active headings and highlight them in the sidebar
5. **Mermaid Diagrams**:
   - Detected via `language-mermaid` code blocks
   - Rendered by `Mermaid.tsx` component with zoom/pan/pinch controls
   - Theme-aware (switches between light/dark based on system theme)
   - Uses `react-zoom-pan-pinch` for interactive controls

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
- `/about` - About page (static)
- `/career` - Career history with table of contents sidebar
- `/projects` - Work projects showcase (professional portfolio)
- `/projects/[slug]` - Individual work project detail page
- `/toy-projects` - Personal side projects showcase
- `/toy-projects/[slug]` - Individual toy project detail page
- `/blog` - Blog listing with tag filtering
- `/blog/[slug]` - Individual blog post with code highlighting, ToC, and related project links
- `/blog/tags/[tag]` - Posts filtered by tag (not yet implemented)
- `/sitemap.ts` and `/robots.ts` - SEO optimization

### Styling Approach

- **Tailwind CSS v4** with custom config in `tailwind.config.ts`
- Dark mode: `class` strategy (not `media`)
- Typography: Geist Sans (body) and Geist Mono (code)
- Consistent card styling: `rounded-xl border bg-white dark:bg-gray-800` with hover effects
- Gradient text for branding: `bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`

### Analytics & Monitoring

1. **Firebase Analytics** (`src/components/analytics/FirebaseAnalytics.tsx`):
   - Client-side component tracking page views
   - Only runs in production environment (`process.env.NODE_ENV === 'production'`)
   - Logs page path, search params, and title
   - Uses Next.js `usePathname` and `useSearchParams` hooks
   - Initialized via `initAnalytics()` from `src/lib/firebase.ts`

2. **Sentry Error Monitoring**:
   - `@sentry/nextjs` integration for error tracking
   - Configured in `instrumentation-client.ts`
   - Captures client-side errors and performance metrics

### UI Components & Enhancements

1. **ScrollProgressIndicator** (`src/components/ui/ScrollProgressIndicator.tsx`):
   - Shows reading progress at top of page
   - Uses Motion library's `useScroll` hook
   - Gradient progress bar (blue to purple)
   - Positioned at `top-16` below navigation

2. **ScrollToTopButton** (`src/components/ui/ScrollToTopButton.tsx`):
   - Floating button at bottom-right
   - Appears after scrolling 300px
   - Smooth scroll animation
   - Uses `lucide-react` ArrowUp icon

3. **MobileDrawer** (`src/components/layout/MobileDrawer.tsx`):
   - Responsive mobile navigation menu
   - Slide-in drawer for screens < lg breakpoint
   - Shares same nav items as desktop

4. **HamburgerIcon** (`src/components/layout/HamburgerIcon.tsx`):
   - Animated hamburger menu icon
   - Transforms between hamburger and X states

### Constants & Configuration

`src/lib/constants.ts` centralizes configuration:

```typescript
// Base path for production builds (GitHub Pages support)
basePath = '/lmw-blog' (production) or '' (development)

// Company priority for work project sorting (higher = shows first)
COMPANY_PRIORITY = {
  '코웨이': 3,
  '티몬': 2,
  '유채널': 1
}

// Company logo paths
COMPANY_LOGOS = {
  '코웨이': '/logo/coway.svg',
  '티몬': '/logo/tmon.svg',
  '유채널': '/logo/uchannel.png'
}
```

Work projects are sorted first by company priority, then by `order` field within same company.

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
4. **Dark Mode**: Always add dark mode variants when styling with Tailwind (use `dark:` prefix)
5. **Fixed Navigation**: Main content needs top padding (`pt-24`) to account for fixed header
6. **Date Formatting**: Use `date-fns` for consistent date display (`format()` function)
7. **Base Paths**: Use `basePath` from `src/lib/constants.ts` for internal links/images in MDX
8. **Project Types**: Distinguish between toy projects (personal) and work projects (professional)
9. **Blog-Project Linking**: Link blog posts to toy projects via `project` field in frontmatter
10. **Mermaid Diagrams**: Use `mermaid` language tag in code blocks for interactive diagrams
11. **Company Sorting**: Work projects auto-sort by company priority + order field
12. **Analytics**: All analytics/tracking code must check for production environment

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
project: "toy-project-slug"  # Optional: links to toy project
---

# Content here

Use Mermaid diagrams with:

\```mermaid
graph TD
  A[Start] --> B[End]
\```
```

### Toy Project
Create `src/content/toy-projects/project-name.mdx`:
```mdx
---
title: "Project Name"
description: "Short project description"
tags: ["React", "TypeScript"]
github: "https://github.com/username/repo"  # Optional
image: "/images/project.png"  # Optional
links:  # Optional: multiple prioritized links
  - url: "https://demo.com"
    label: "Live Demo"
    priority: 1
  - url: "https://docs.com"
    label: "Documentation"
    priority: 2
relatedPosts: ["blog-post-slug-1", "blog-post-slug-2"]  # Optional
---

Detailed project description in MDX...
```

### Work Project
Create `src/content/projects/work-project-name.mdx`:
```mdx
---
title: "Work Project Name"
description: "Project description"
tags: ["React", "TypeScript"]
company: "코웨이"  # Must match COMPANY_PRIORITY key
startDate: "2024-01-01"
endDate: "2024-12-31"  # Optional: omit for ongoing
order: 1  # Higher numbers appear first within same company
---

Work project details...
```

## Common Modifications

- **Navigation items**: Edit `navItems` array in `src/components/layout/Navigation.tsx` (line 13)
- **Theme colors**: Modify `src/app/globals.css`
- **MDX components**: Update components in `src/app/blog/[slug]/page.tsx` MDXRemote (lines 190-219)
- **Site metadata**: Update `src/app/layout.tsx` (lines 22-33) and domain in `sitemap.ts`/`robots.ts`
- **Company priorities**: Edit `COMPANY_PRIORITY` in `src/lib/constants.ts`
- **Company logos**: Add logo files to `/public/logo/` and update `COMPANY_LOGOS` in constants
- **Base path**: Change `basePath` in `src/lib/constants.ts` for different deployment environments
- **Analytics**: Configure Firebase in `src/lib/firebase.ts`
- **Scroll behavior**: Adjust `NAV_HEIGHT` (line 23) and `threshold` (line 27) in Navigation.tsx

## Dependencies & Libraries

Key packages and their purposes:

**Core Framework:**
- `next@16.0.7` - App Router with React 19
- `react@19.2.0` / `react-dom@19.2.0` - UI library
- `typescript@^5` - Type safety

**MDX & Content:**
- `@mdx-js/loader` / `@mdx-js/react` / `@next/mdx` - MDX support
- `next-mdx-remote@^5.0.0` - Remote MDX rendering
- `gray-matter@^4.0.3` - Frontmatter parsing
- `rehype-highlight@^7.0.2` - Code syntax highlighting
- `rehype-slug@^6.0.0` / `rehype-autolink-headings@^7.1.0` - Heading anchors
- `remark-gfm@^4.0.1` - GitHub Flavored Markdown
- `highlight.js@^11.11.1` - Syntax highlighting themes

**UI & Styling:**
- `tailwindcss@^4` - Utility-first CSS
- `next-themes@^0.4.6` - Theme switching
- `lucide-react@^0.552.0` - Icon library
- `motion@^12.23.24` - Animation library (formerly Framer Motion)

**Features:**
- `mermaid@^11.12.1` - Diagram rendering
- `react-zoom-pan-pinch@^3.7.0` - Interactive diagram controls
- `date-fns@^4.1.0` - Date formatting
- `react-fast-marquee@^1.6.5` - Marquee animations

**Analytics & Monitoring:**
- `firebase@^12.5.0` - Analytics integration
- `@sentry/nextjs@^10.25.0` - Error monitoring

**Development:**
- `eslint@^9` - Code linting
- `eslint-config-prettier` / `eslint-plugin-prettier` - Code formatting
- `eslint-plugin-import@^2.32.0` - Import ordering
- `prettier-plugin-tailwindcss@^0.7.1` - Tailwind class sorting

## File Structure Reference

```
src/
├── app/                          # Next.js App Router
│   ├── about/page.tsx           # About page
│   ├── career/page.tsx          # Career history
│   ├── projects/                # Work projects
│   │   ├── page.tsx            # Projects list
│   │   └── [slug]/page.tsx     # Project detail
│   ├── toy-projects/            # Personal projects
│   │   ├── page.tsx            # Toy projects list
│   │   └── [slug]/page.tsx     # Toy project detail
│   ├── blog/                    # Blog system
│   │   ├── page.tsx            # Blog list
│   │   └── [slug]/page.tsx     # Blog post detail (MDX rendering here)
│   ├── layout.tsx               # Root layout with analytics
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles & Tailwind
│   ├── sitemap.ts               # Dynamic sitemap generation
│   ├── robots.ts                # Robots.txt generation
│   └── global-error.tsx         # Global error boundary
├── components/
│   ├── analytics/
│   │   └── FirebaseAnalytics.tsx    # Page view tracking
│   ├── blog/
│   │   ├── BlogList.tsx             # Blog post cards
│   │   └── PostNavigation.tsx       # Prev/next post nav
│   ├── layout/
│   │   ├── Navigation.tsx           # Main navbar with scroll behavior
│   │   ├── MobileDrawer.tsx         # Mobile menu drawer
│   │   ├── HamburgerIcon.tsx        # Menu toggle icon
│   │   └── Footer.tsx               # Site footer
│   ├── mdx/
│   │   ├── Mermaid.tsx              # Interactive diagram renderer
│   │   └── TableOfContents.tsx      # Blog ToC sidebar
│   ├── projects/
│   │   ├── ProjectList.tsx          # Project cards
│   │   └── ProjectTechStack.tsx     # Tech stack display
│   ├── theme/
│   │   ├── ThemeProvider.tsx        # next-themes wrapper
│   │   └── ThemeToggle.tsx          # Theme switch button
│   └── ui/
│       ├── ScrollProgressIndicator.tsx  # Reading progress bar
│       └── ScrollToTopButton.tsx        # Back to top FAB
├── content/                      # MDX content files
│   ├── blog/*.mdx               # Blog posts
│   ├── toy-projects/*.mdx       # Personal projects
│   └── projects/*.mdx           # Work projects
├── lib/
│   ├── blog.ts                  # Content fetching & parsing
│   ├── constants.ts             # App constants (paths, priorities)
│   ├── firebase.ts              # Firebase initialization
│   └── useSpyElem.ts            # Scroll spy hook
└── instrumentation-client.ts    # Sentry client setup
```

## Blog-Project Integration

Blog posts can be linked to toy projects for cross-referencing:

1. **In Blog Post**: Add `project: "toy-project-slug"` to frontmatter
2. **Display**: Blog post shows related project card with links at top
3. **Fetching**: Use `getToyProject(post.project)` in blog detail page
4. **Reverse Lookup**: Use `getPostsByProject(projectSlug)` to find posts about a project

Example workflow:
```typescript
// In src/app/blog/[slug]/page.tsx
const post = getBlogPost(slug);
const relatedProject = post.project ? getToyProject(post.project) : null;

// Shows project card if linked
{relatedProject && <ProjectCard project={relatedProject} />}
```

## Troubleshooting

**MDX not rendering:**
- Check frontmatter formatting (YAML syntax)
- Verify file is in correct `src/content/` subdirectory
- Ensure `.mdx` extension

**Images not showing:**
- Use `basePath` from constants for internal images
- Images should be in `/public/` directory
- Reference as `/images/file.png` (leading slash)

**Mermaid diagrams not working:**
- Use triple backticks with `mermaid` language tag
- Check Mermaid syntax is valid
- Component only works in blog posts (not other MDX pages)

**Navigation not hiding on scroll:**
- Check `NAV_HEIGHT` matches actual nav height (h-16 = 64px)
- Verify `useSpyElem` hook is properly connected
- Ensure main content has `pt-24` padding

**Dark mode flashing:**
- Verify `suppressHydrationWarning` on `<html>` tag
- Check ThemeProvider wraps entire app
- Ensure `defaultTheme="system"` in ThemeProvider

**Work projects in wrong order:**
- Verify company name exactly matches `COMPANY_PRIORITY` key
- Check `order` field is a number (higher = first)
- Remember: company priority takes precedence over order
