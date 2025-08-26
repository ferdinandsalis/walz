# Development Guidelines

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 22+ (latest LTS)
- **npm**: 8+ (comes with Node.js)
- **Git**: Latest version
- **mise**: For tool management (optional but recommended)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd walz

# Install dependencies
npm install

# Set up Playwright browsers (for E2E testing)
npm run setup

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 Development Commands

### Core Commands
```bash
# Development
npm run dev              # Start development server with hot reload
npm run build           # Build production application
npm start               # Start production server

# Code Quality  
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run typecheck       # Run TypeScript checking

# Testing
npm test                # Run unit tests (watch mode)
npm run test:e2e        # Run E2E tests (UI mode)
npm run test:e2e:run    # Run E2E tests (headless)
npm run coverage        # Generate test coverage report

# Validation
npm run validate        # Run all checks (tests, lint, typecheck, e2e)
```

### Sanity CMS Commands
```bash
# Access Sanity Studio
# Navigate to /studio in your browser when dev server is running

# Generate TypeScript types from Sanity schema
sanity typegen generate

# Deploy Sanity Studio
sanity deploy
```

## 🏗️ Project Structure

### Key Directories
```
app/
├── components/          # Reusable UI components
│   ├── ui/             # Base design system components
│   └── *.tsx          # Feature-specific components
├── routes/             # File-based routing (flat routes)
├── sanity/            # CMS configuration and schemas
├── styles/            # Global CSS and themes
└── utils/             # Shared utilities and helpers

public/                # Static assets
├── fonts/            # Custom web fonts (MuseoSans)
├── images/           # Optimized images
└── downloads/        # PDF documents and forms

tests/                 # E2E and unit tests
docs/                 # Project documentation
```

## 🎨 Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Use strict TypeScript
interface Props {
  title: string
  isVisible?: boolean
}

// ✅ Use proper prop types
export function Component({ title, isVisible = false }: Props) {
  return <div>{title}</div>
}

// ✅ Use type assertions carefully
const data = response as ApiResponse

// ❌ Avoid 'any' type
const badData: any = response
```

### Component Structure
```typescript
// ✅ Recommended component structure
import { useState } from 'react'
import { Link } from 'react-router'
import { cn } from '#app/utils/misc.tsx'

interface ComponentProps {
  className?: string
  // ... other props
}

export function Component({ className, ...props }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState(false)
  
  // Event handlers
  const handleClick = () => {
    setState(!state)
  }
  
  // Render
  return (
    <div className={cn('base-styles', className)}>
      {/* content */}
    </div>
  )
}
```

### CSS/Tailwind Guidelines
```typescript
// ✅ Use cn() utility for conditional classes
import { cn } from '#app/utils/misc.tsx'

const className = cn(
  'base-classes',
  {
    'conditional-class': condition,
    'another-class': anotherCondition
  }
)

// ✅ Group Tailwind classes logically
const classes = cn(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'p-4 mb-6',
  // Typography
  'text-lg font-bold',
  // Colors
  'bg-white text-gray-900',
  // Interactive states
  'hover:bg-gray-100 focus:ring-2'
)
```

### File Naming Conventions
```
// Components
component-name.tsx       # kebab-case acceptable for complex names

// Routes  
_index.tsx              # Index routes
_layout.tsx             # Layout routes  
$slug.tsx               # Dynamic routes
route-name+/            # Route groups (folders end with +)

// Utilities
kebab-case.ts           # kebab-case for multi-word files

// Constants
UPPER_CASE.ts           # For constant files
```

## 🛣️ Routing Conventions

### Flat Routes Pattern
```
routes/
├── _index/                    # /
├── about.tsx                  # /about
├── blog+/                     # Layout for /blog/*
│   ├── _index.tsx            # /blog
│   └── $slug.tsx             # /blog/:slug
└── admin+/                   # Layout for /admin/*
    ├── _layout.tsx          # Shared admin layout
    ├── dashboard.tsx        # /admin/dashboard
    └── users+/              # Nested layout
        ├── _index.tsx       # /admin/users
        └── $id.tsx          # /admin/users/:id
```

### Route Component Structure
```typescript
// Route with data loading
import { loadQuery } from '@sanity/react-loader'
import { useLoaderData } from 'react-router'
import { RouteQuerySchema, routeQuery } from './route.query.ts'

// Loader function
export async function loader() {
  const data = await loadQuery(routeQuery)
  return RouteQuerySchema.parse(data)
}

// Meta function  
export function meta() {
  return [
    { title: 'Page Title | Walz' },
    { name: 'description', content: 'Page description' }
  ]
}

// Component
export default function Route() {
  const data = useLoaderData<typeof loader>()
  
  return (
    <div>
      {/* Route content */}
    </div>
  )
}
```

## 📊 Sanity CMS Development

### Schema Development
```typescript
// app/sanity/schema/example.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'example',
  title: 'Example Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title', 
      type: 'string',
      validation: Rule => Rule.required().min(10).max(80)
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt'
    }
  }
})
```

### GROQ Query Development
```typescript
// app/routes/example/example.query.ts
import { groq } from 'groq'
import { z } from 'zod'

export const exampleQuery = groq`
  *[_type == "example" && published == true] {
    _id,
    title,
    slug,
    publishedAt,
    "imageUrl": image.asset->url
  } | order(publishedAt desc)
`

export const ExampleQuerySchema = z.array(z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string()
  }),
  publishedAt: z.string(),
  imageUrl: z.string().optional()
}))

export type ExampleQuery = z.infer<typeof ExampleQuerySchema>
```

## 🧪 Testing Guidelines

### Unit Testing with Vitest
```typescript
// app/utils/example.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './date-utils.ts'

describe('formatDate', () => {
  it('formats German dates correctly', () => {
    expect(formatDate('2023-12-25')).toBe('25. Dezember 2023')
  })
  
  it('handles invalid dates', () => {
    expect(formatDate('invalid')).toBe('')
  })
})
```

### E2E Testing with Playwright
```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('user can navigate to admission page', async ({ page }) => {
    await page.goto('/')
    
    await page.click('nav a[href="/aufnahme"]')
    await expect(page).toHaveURL('/aufnahme')
    
    await expect(page.getByRole('heading', { 
      name: 'Aufnahme' 
    })).toBeVisible()
  })
})
```

## 🎯 Performance Guidelines

### Code Splitting
```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent.tsx'))

export function Route() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Image Optimization
```typescript
// Use Sanity image optimization
import imageUrlBuilder from '@sanity/image-url'
import { sanityConfig } from '#app/sanity/project-details.ts'

const urlFor = imageUrlBuilder(sanityConfig).image

// Generate optimized image URLs
const optimizedUrl = urlFor(image)
  .width(800)
  .height(600)
  .format('webp')
  .quality(85)
  .url()
```

## 🔒 Security Guidelines

### Form Handling
```typescript
// Always use honeypot protection
import { honeypot } from '#app/utils/honeypot.server.ts'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  
  // Validate honeypot
  honeypot.check(formData)
  
  // Process form data
  const email = formData.get('email')
  // ... validation and processing
}
```

### Environment Variables
```typescript
// Use proper env validation
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  SECRET_KEY: z.string().min(32)
})

export const env = EnvSchema.parse(process.env)
```

## 🚫 Common Pitfalls to Avoid

### ❌ Don't
- Use `any` type in TypeScript
- Commit sensitive data or API keys
- Skip TypeScript checking (`// @ts-ignore`)
- Use inline styles instead of Tailwind classes
- Forget to add loading states for async operations
- Ignore accessibility considerations

### ✅ Do  
- Use strict TypeScript throughout
- Validate all external data with Zod schemas
- Test critical user paths with E2E tests
- Follow the established file naming conventions
- Use semantic HTML and proper ARIA labels
- Keep components small and focused

## 🔄 Git Workflow

### Branch Naming
```bash
feature/add-newsletter-signup
fix/mobile-navigation-bug  
chore/update-dependencies
docs/add-api-documentation
```

### Commit Messages
```bash
# Good commit messages
feat: add newsletter subscription form
fix: resolve mobile navigation toggle issue
docs: update API documentation
chore: update dependencies to latest versions

# Follow conventional commits format
<type>: <description>
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and test locally
3. Run `npm run validate` before committing
4. Push branch and create PR
5. Ensure CI passes
6. Request review from team members
7. Merge after approval

## 📚 Additional Resources

- [React Router v7 Documentation](https://reactrouter.com)
- [Sanity CMS Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Playwright Testing Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
