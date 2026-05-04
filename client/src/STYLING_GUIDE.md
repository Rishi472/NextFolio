# NEXXTFOLIO Styling Guidelines

## 🎨 Design System Overview

This document outlines the design system and styling guidelines for the Nextfolio application.

## Color Palette

### Primary Colors
- **Indigo-600**: `#4F46E5` - Primary brand color for main CTAs and accents
- **Purple-600**: `#7C3AED` - Secondary brand color for gradients
- **Cyan-400**: `#06B6D4` - Accent color used in hero gradients

### Neutral Colors
- **Slate-50**: `#F8FAFC` - Light background
- **Slate-900**: `#0F172A` - Dark text and backgrounds
- **White**: `#FFFFFF` - Cards and light sections
- **Gray-600**: `#4B5563` - Secondary text

### Semantic Colors
- **Success**: Green-500 (`#10B981`)
- **Warning**: Yellow-500 (`#F59E0B`)
- **Error**: Red-500 (`#EF4444`)
- **Info**: Blue-500 (`#3B82F6`)

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Heading Hierarchy
```
H1: text-4xl font-bold      (36px, bold)
H2: text-3xl font-bold      (30px, bold)
H3: text-2xl font-bold      (24px, bold)
H4: text-xl font-bold       (20px, bold)
H5: text-lg font-semibold   (18px, semibold)
H6: text-base font-semibold (16px, semibold)
```

### Body Text
```
Large: text-lg              (18px)
Base:  text-base            (16px)
Small: text-sm              (14px)
Tiny:  text-xs              (12px)
```

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing Scale

Standard Tailwind spacing scale (in `0.25rem` increments):
```
0: 0
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
6: 1.5rem (24px)
8: 2rem (32px)
12: 3rem (48px)
16: 4rem (64px)
```

**Common usage:**
- Component padding: `p-4` or `p-6`
- Section spacing: `mb-8` or `mb-12`
- Element gaps: `gap-2` or `gap-4`

## Border Radius

```
Rounded-lg: 0.5rem (8px)    - Buttons, inputs
Rounded-xl: 0.75rem (12px)  - Cards, larger components
Rounded-2xl: 1rem (16px)    - Feature cards, sections
Rounded-full: 9999px        - Badges, circles
```

## Shadows

### Soft Shadows (recommended for UI)
```
shadow-soft-sm: 0 1px 2px rgba(15, 23, 42, 0.05)
shadow-soft-md: 0 4px 6px -1px rgba(15, 23, 42, 0.1)
shadow-soft-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.1)
shadow-glass: 0 8px 32px rgba(31, 38, 135, 0.15)
```

### Usage Guidelines
- **Small elements**: `shadow-soft-sm`
- **Cards at rest**: `shadow-soft-md`
- **Cards on hover**: `shadow-soft-lg`
- **Glass effect**: `shadow-glass`

## Gradients

### Brand Gradient
```css
background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
```
Used for: Buttons, CTAs, hero sections

### Hero Gradient
```css
background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 50%, #7c3aed 100%);
```
Used for: Large background sections, portfolio hero

### Subtle Gradient
```css
background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
```
Used for: Secondary sections, light backgrounds

## Component Styling Patterns

### Button Pattern
```jsx
className={`
  px-4 py-2 rounded-lg font-semibold
  transition-all duration-300
  hover:shadow-lg hover:scale-105
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
`}
```

### Card Pattern
```jsx
className={`
  rounded-2xl overflow-hidden
  bg-white border border-indigo-100
  shadow-soft-md
  hover:shadow-soft-lg transition-all
`}
```

### Glass Effect Pattern
```jsx
className={`
  bg-white/80 backdrop-blur-lg
  border border-white/20
  rounded-2xl
`}
```

### Input Pattern
```jsx
className={`
  w-full px-4 py-2.5 rounded-lg
  border-2 border-indigo-200
  focus:border-indigo-600
  focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-30
  transition-all duration-300
`}
```

## Animations

### Available Animations
```css
animate-fade-in       /* 0.3s ease-in-out */
animate-slide-up      /* 0.3s ease-out */
animate-pulse-soft    /* 2s infinite */
animate-float         /* 3s ease-in-out infinite */
```

### Usage
```jsx
<div className="animate-fade-in">Content fades in</div>
<div className="animate-slide-up">Content slides up</div>
<div className="animate-float">Content floats smoothly</div>
```

### Custom Animation Pattern
```css
@keyframes customAnimation {
  0% { /* start state */ }
  100% { /* end state */ }
}

.animate-custom {
  animation: customAnimation 1s ease-in-out;
}
```

## Responsive Design Breakpoints

```
Mobile:  < 640px (no prefix)
Tablet:  ≥ 640px (sm:)
Desktop: ≥ 768px (md:)
Wide:    ≥ 1024px (lg:)
Ultra:   ≥ 1280px (xl:)
```

### Mobile-First Pattern
```jsx
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## Accessibility Guidelines

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Use `text-gray-900` or `text-slate-900` for primary text
- Use `text-gray-600` or `text-gray-500` for secondary text

### Focus States
```css
focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #4f46e5;
}
```

### Disabled States
- Reduce opacity: `disabled:opacity-50`
- Change cursor: `disabled:cursor-not-allowed`

### Alt Text & Labels
- Always provide `alt` for images
- Always provide `label` for inputs
- Use `aria-label` for icon-only buttons

## State Styling

### Hover
```jsx
className="hover:shadow-lg hover:scale-105 transition-all"
```

### Active/Pressed
```jsx
className="active:scale-95"
```

### Disabled
```jsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### Focus
```jsx
className="focus:ring-2 focus:ring-indigo-600"
```

### Loading
```jsx
className="animate-pulse-soft"
```

## Dark Mode (Future)

When implementing dark mode:
- Use `dark:` prefix for dark mode classes
- Create CSS variables for dynamic theming
- Maintain 4.5:1 contrast ratio in both modes

Example:
```jsx
className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
```

## Common Patterns

### Full Width Button
```jsx
<Button className="w-full">Submit</Button>
```

### Icon + Text Button
```jsx
<Button>
  <Save className="w-4 h-4 mr-2" />
  Save Changes
</Button>
```

### Grid with Gaps
```jsx
<div className="grid grid-cols-2 gap-4">
  {/* Items */}
</div>
```

### Centered Content
```jsx
<div className="flex flex-col items-center justify-center">
  {/* Content */}
</div>
```

### Truncated Text
```jsx
<p className="truncate">Long text that will be cut off...</p>
<p className="line-clamp-2">Text limited to 2 lines...</p>
```

### Skeleton/Loading
```jsx
<div className="animate-pulse-soft bg-gray-200 h-12 rounded-lg"></div>
```

## Performance Tips

1. **Use Tailwind classes** instead of custom CSS where possible
2. **Avoid inline styles** - use Tailwind utilities
3. **Use CSS classes** for animations - more efficient than JavaScript
4. **Lazy load** large images and components
5. **Minimize custom CSS** - rely on Tailwind's optimized output

## File Organization

- Global styles: `index.css`
- Component styles: Inline Tailwind classes in components
- Design tokens: `tailwind.config.js`
- Custom animations: Keyframes in `index.css`

## Consistency Checklist

Before committing code:
- [ ] All buttons use standard variants
- [ ] All cards use consistent shadows and borders
- [ ] All inputs follow input pattern
- [ ] Proper spacing between components
- [ ] Hover states implemented
- [ ] Focus states visible
- [ ] Animations smooth and performant
- [ ] Mobile responsive tested
- [ ] Color contrast verified
- [ ] No hardcoded colors (use design tokens)

---

For questions or suggestions, refer to component examples in `src/COMPONENT_GUIDE.md`.
