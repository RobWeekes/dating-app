# Affinity UI Component Reference

## 🎨 Quick Visual Guide

### Color Palette Reference

```
PRIMARY: #D6336C (Rose/Pink)
  └─ Main CTAs, primary actions, active states

SECONDARY: #8B5CF6 (Purple)
  └─ Secondary actions, links, premium accents

ACCENT: #FFB547 (Gold/Amber)
  └─ Highlights, badges, premium touches

CORAL: #FF7A59 (Coral/Orange)
  └─ Hero sections, energy, attraction

SUCCESS: #18B67A (Teal/Green)
  └─ Success states, verified checkmarks

ERROR: #E54867 (Red-Pink)
  └─ Error messages, destructive actions

BG: #FFF8FA (Soft Blush)
  └─ Default page background

SURFACE: #FFFFFF (White)
  └─ Cards, modals, surfaces

TEXT: #1D1027 (Dark Purple)
  └─ Primary text, headlines

TEXT-2: #3F3050 (Purple-Gray)
  └─ Secondary text, body copy

TEXT-MUTED: #6E6480 (Muted Purple)
  └─ Helper text, disabled states
```

---

## 🧩 Component Usage Guide

### 1. **Header Component**
```jsx
import Header from '../components/Header';

// Used in Layout - renders automatically
<Header />

// Features:
// - Sticky positioning
// - Dynamic nav (different for auth/public)
// - Logo with Affinity branding
// - Sign up/Log in CTAs for public
// - Profile/Matches/etc for authenticated users
```

**CSS Variables**: Uses standard design tokens
**Responsive**: Mobile shows emoji only, desktop shows full "Affinity"

---

### 2. **Hero Component**
```jsx
import Hero from '../components/Hero';

<Hero
  title="Find Love Through Intelligence"
  subtitle="Advanced matching for real connections"
  cta1Text="Create Your Profile"
  cta1Link="/register"
  cta2Text="Already have an account?"
  cta2Link="/login"
  backgroundImage="https://images.unsplash.com/..."
/>

// Features:
// - Full-width section
// - Gradient overlay
// - Dual CTA buttons
// - Responsive height (600px desktop, 500px mobile)
// - Animated entrance
```

**Use Cases**:
- Landing page hero
- Feature section intro
- Match celebration moments

---

### 3. **FeatureCard Component**
```jsx
import FeatureCard from '../components/FeatureCard';

<FeatureCard
  icon="👤"
  title="Create Your Profile"
  description="Tell us about yourself and upload photos"
  link="/register"
/>

// Features:
// - Icon at top (emoji friendly)
// - Title and description
// - Optional "Learn more" link
// - Hover animations
// - Responsive grid layout
```

**Use Cases**:
- "How It Works" steps
- Feature showcase
- Benefit explanation

---

### 4. **TestimonialCard Component**
```jsx
import TestimonialCard from '../components/TestimonialCard';

<TestimonialCard
  quote="I found genuine connection through Affinity!"
  author="Sarah"
  matchedWith="Marcus"
  image="https://images.unsplash.com/..."
  rating={5}
/>

// Features:
// - Star rating display
// - Author photo with border
// - Matched with info
// - Quote styling
// - Hover effects
```

**Use Cases**:
- Social proof on landing
- Success stories
- Community testimonials

---

## 🎯 Button System

### Types

```jsx
// Primary CTA (gradient)
<button className="btn btn-primary">
  Sign Up Now
</button>

// Secondary (light background)
<button className="btn btn-secondary">
  Learn More
</button>

// Outline (border only)
<button className="btn btn-outline">
  Optional Action
</button>

// Ghost (transparent)
<button className="btn btn-ghost">
  Skip
</button>
```

### Sizes

```jsx
<button className="btn btn-lg">Large (Full width CTAs)</button>
<button className="btn">Regular (Default)</button>
<button className="btn btn-sm">Small (Secondary actions)</button>
```

### States

```css
Hover: Lifted, enhanced shadow
Active: Pressed down
Disabled: 60% opacity, not-allowed cursor
Focus: Outline with color focus
```

---

## 📝 Form Styling

### Standard Form Structure

```jsx
<div className="form-group">
  <label htmlFor="email">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="your@email.com"
    className="form-input"
  />
</div>
```

### Features
- 2px border on focus
- Smooth color transition
- Error state (red border, light pink background)
- 3px glow effect on focus
- Full-width responsive

### Variants

```jsx
// Textarea
<textarea className="form-textarea" />

// Select
<select className="form-select" />

// Checkbox/Radio (enhance as needed)
<input type="checkbox" />
```

---

## 🎨 Card System

```jsx
// Standard Card
<div className="card">
  <h3>Feature Title</h3>
  <p>Card content goes here</p>
</div>

// Elevated Card (more shadow)
<div className="card card-elevated">
  <p>Important content</p>
</div>
```

### Features
- Soft shadow
- 1px border
- Hover lift effect
- Border color change on hover

---

## 🔧 Layout Classes

```jsx
// Containers
<div className="container">           {/* max 1280px */}
<div className="container-sm">       {/* max 640px */}
<div className="container-md">       {/* max 896px */}

// Flexbox Utilities
<div className="flex">              {/* display: flex */}
<div className="flex-col">          {/* flex-direction: column */}
<div className="flex-center">       {/* centered */}
<div className="items-center">      {/* align-items: center */}
<div className="justify-center">    {/* justify-content: center */}
<div className="justify-between">   {/* justify-content: space-between */}

// Gaps
<div className="gap-md">            {/* gap: 1rem */}
<div className="gap-lg">            {/* gap: 1.5rem */}
```

---

## 📏 Spacing Tokens

```css
--spacing-xs:   0.25rem  (4px)
--spacing-sm:   0.5rem   (8px)
--spacing-md:   1rem     (16px)
--spacing-lg:   1.5rem   (24px)
--spacing-xl:   2rem     (32px)
--spacing-2xl:  3rem     (48px)
--spacing-3xl:  4rem     (64px)
```

### Usage
```jsx
<div className="mt-lg mb-xl">
  Margin top large, margin bottom extra-large
</div>

// All directions: mt-, mb-, ml-, mr-, m-
// Available modifiers: -xs, -sm, -md, -lg, -xl, -2xl, -3xl
```

---

## 🎬 Animations

### Built-in Animations

```css
/* Fade-in from bottom (Hero) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Float effect (Feature icons) */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Bounce (Under Construction icon) */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

### Transition Speeds
```css
--transition-fast:   150ms ease-in-out
--transition-base:   250ms ease-in-out
--transition-slow:   350ms ease-in-out
```

---

## 🎯 Responsive Breakpoints

```css
/* Mobile First (Mobile) */
Default for < 600px

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  /* Tablet specific styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop enhancements */
}
```

### Mobile Optimizations
- Stacked layouts
- Full-width cards
- Vertical nav
- Touch-friendly buttons (48px min)
- Larger text (prevent iOS zoom)

---

## 🎨 Gradient Reference

```css
/* Hero Gradient */
background: linear-gradient(
  135deg,
  #ff7a59 0%,    /* Coral */
  #d6336c 38%,   /* Rose */
  #8b5cf6 72%,   /* Purple */
  #24113d 100%   /* Deep Midnight */
);

/* CTA Gradient */
background: linear-gradient(
  135deg,
  #c92e66 0%,    /* Deep Rose */
  #7c3aed 100%   /* Purple */
);

/* Premium Gradient */
background: linear-gradient(
  135deg,
  #b88a2f 0%,    /* Gold */
  #ffd166 35%,   /* Light Gold */
  #8b5cf6 100%   /* Purple */
);

/* Match Celebration */
background: linear-gradient(
  135deg,
  #ff7a59 0%,      /* Coral */
  #ff5d8f 45%,     /* Pink */
  #9b6bff 100%     /* Light Purple */
);
```

---

## 📱 Common Patterns

### CTA with Secondary Action
```jsx
<div className="hero-actions">
  <a href="/register" className="btn btn-primary btn-lg">
    Main Action
  </a>
  <a href="/login" className="btn btn-outline btn-lg">
    Secondary Action
  </a>
</div>
```

### Feature Grid
```jsx
<div className="premium-grid">
  {/* auto-fit creates responsive columns */}
  <FeatureCard ... />
  <FeatureCard ... />
  <FeatureCard ... />
</div>
```

### Section with Title
```jsx
<section className="features-section">
  <div className="container">
    <h2>Premium Features</h2>
    <div className="premium-grid">
      {/* Content */}
    </div>
  </div>
</section>
```

---

## 🎨 Tips for Customization

### Change Primary Color
1. Update `--color-primary` in App.css
2. Update related gradients as needed
3. Test on all components

### Add New Button Variant
```css
.btn-custom {
  background: var(--gradient-premium);
  color: white;
  box-shadow: special-shadow;
}

.btn-custom:hover:not(:disabled) {
  transform: scale(1.05);
}
```

### Create New Section Type
```jsx
<section className="my-section">
  <div className="container">
    <h2>Section Title</h2>
    <div className="my-section-grid">
      {/* Content */}
    </div>
  </div>
</section>
```

---

## 🚀 Performance Notes

- **CSS Variables**: For consistent updates across app
- **CSS Modules**: Prevent style conflicts
- **Lazy Gradients**: Only applied where needed
- **Efficient Selectors**: Shallow nesting for faster rendering
- **Mobile-First**: Reduces mobile bundle size

---

## 📊 Component Stats

| Component | Lines | CSS | Reusable |
|-----------|-------|-----|----------|
| Header | 50 | Modular | 5+ uses |
| Hero | 25 | Flexible | Landing sections |
| FeatureCard | 20 | 1 hover effect | Any grid |
| TestimonialCard | 25 | Light styling | 3+ cards |
| Home | 300+ | Modular | Landing page |

---

## ✅ Quality Checklist

Before using components in production:

- [ ] Tested on mobile (< 600px)
- [ ] Tested on tablet (600-1024px)
- [ ] Tested on desktop (> 1024px)
- [ ] Color contrast meets WCAG AA
- [ ] Hover states clear and obvious
- [ ] Loading states handled
- [ ] Error states styled
- [ ] Images optimized
- [ ] Text is readable
- [ ] CTAs are obvious

---

## 📚 Reference

See `PREMIUM_UI_REDESIGN.md` for:
- Complete feature list
- File structure overview
- Next steps and roadmap
- Color usage guidelines
- Brand guidelines

---

**Happy building! 💘**
