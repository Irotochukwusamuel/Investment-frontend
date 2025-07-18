# Pure React Components Migration Guide

This directory contains pure React components that can replace shadcn/ui components without any dependencies on Radix UI.

## Available Components

- `Button` - Replaces `@/components/ui/button`
- `Input` - Replaces `@/components/ui/input`
- `Card` - Replaces `@/components/ui/card`
- `Badge` - Replaces `@/components/ui/badge`
- `Label` - Replaces `@/components/ui/label`
- `Progress` - Replaces `@/components/ui/progress`
- `Skeleton` - Replaces `@/components/ui/skeleton`

## Migration Steps

### Step 1: Import Pure Components

Instead of:
```tsx
import { Button } from '@/components/ui/button'
```

Use:
```tsx
import { Button } from '@/components/pure'
```

### Step 2: Replace Imports

Find and replace these imports in your files:

```tsx
// OLD (shadcn/ui)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

// NEW (pure React)
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Label,
  Progress,
  Skeleton
} from '@/components/pure'
```

### Step 3: Component Usage

The pure components have the same API as shadcn/ui components:

```tsx
// Button usage
<Button variant="default" size="lg">
  Click me
</Button>

// Card usage
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// Input usage
<Input placeholder="Enter text" />

// Badge usage
<Badge variant="secondary">Status</Badge>
```

## Benefits

1. **No Radix UI dependency** - Pure React components
2. **Smaller bundle size** - No external UI library dependencies
3. **Full control** - Customize components as needed
4. **Same API** - Drop-in replacement for shadcn/ui components

## Gradual Migration

You can migrate components one by one:

1. Start with simple components (Button, Input, Badge)
2. Move to complex components (Card, Progress)
3. Finally remove shadcn/ui and Radix UI dependencies

## Notes

- These components maintain the same styling as shadcn/ui
- All components are fully typed with TypeScript
- Components use the same Tailwind CSS classes
- Accessibility features are maintained where possible 