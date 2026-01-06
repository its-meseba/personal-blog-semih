# Understood Errors

This file documents errors encountered during development and the lessons learned to prevent them in the future.

## General Rules

### 1. Next.js Route Groups
- Route groups use parentheses like `(post)` - these don't appear in URLs
- Files should be named `page.mdx` or `page.tsx` not `page.ts` for route handlers

### 2. MDX Metadata Exports
- MDX files in Next.js App Router use `export const metadata = {...}` pattern
- Not YAML frontmatter like in `content/` folder MDX files
