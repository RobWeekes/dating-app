# STYLE_GUIDE.md

> **Product tone:** fun, sleek, modern, sexy  
> **Platform:** React 19 + plain CSS + CSS Modules  
> **Responsive strategy:** mobile-first with breakpoints at `600px` and `1024px`

---

## Design North Star

This dating app should feel:

- **Warm, not cold**
- **Premium, not stuffy**
- **Playful, not childish**
- **Sexy, not sleazy**
- **Clear, not cluttered**
- **Confident, not loud**

The UI should quickly create three emotions:

1. **Attraction** — rich photography, flattering color, bold CTA moments  
2. **Trust** — clean layout, readable forms, clear safety cues  
3. **Momentum** — users should always know the next best action:  
   **create profile → answer prompts → set preferences → discover people**

---

## Competitive Pattern Synthesis: What the Top Dating Apps Do Well

| App | Signature palette cues | Visual personality | UX pattern worth borrowing |
|---|---|---|---|
| **Tinder** | Hot pink/coral gradients (`#FD297B`, `#FF5864`, `#FF655B`) | Fast, bold, swipe-first, dopamine-driven | Immediate action, giant cards, strong gradient CTA, simple decision loops |
| **Bumble** | Yellow + black (`#FBCB0A`, `#1F1F1F`) | Friendly, confident, optimistic | High-contrast CTAs, safety/trust messaging, simple onboarding |
| **Hinge** | Black/white with warm editorial accents | Intentional, mature, conversation-led | Prompt-based profiles, thoughtful spacing, "designed to be deleted" clarity |
| **Match** | Trust blue/white (`#1A31F6` approx.) | Serious, reliable, relationship-oriented | Testimonials, guided signup, credibility-first conversion |
| **OkCupid** | Bold magenta/purple/ink (`#FF1D8E`, `#6A00FF`) | Expressive, inclusive, identity-forward | Questionnaires, self-expression, profile depth, inclusive UX |
| **Feeld** | Black/stone/lilac | Dark, sensual, premium, exploratory | Dark mode as a core aesthetic, intimacy through restraint, identity flexibility |
| **Coffee Meets Bagel** | Warm neutrals + indigo/plum (`#4650B1`) | Curated, calm, intentional | Small daily rewards, less clutter, relationship-focused pacing |
| **Happn** | Teal/blue/white | Fresh, local, serendipitous | Place-based context, "you crossed paths" storytelling |
| **The League** | Midnight/navy + gold | Exclusive, polished, aspirational | Premium spacing, luxury feel, scarcity cues |
| **Badoo** | Purple/violet/white | Social, lively, broad-market | Verification, video/social energy, approachable UI |

### Shared patterns across successful dating products

Top dating apps consistently use:

- **Photo-first card layouts**
- **One obvious CTA per screen**
- **Rounded corners and soft shadows**
- **Strong signature brand color**
- **Micro-interactions for swipes, likes, matches, and form progress**
- **Profile depth without heavy upfront friction**
- **Progressive disclosure** instead of giant forms
- **Safety and authenticity cues** close to conversion moments

---

# 1. Color Palettes & Gradients

## 1.1 Competitive insights

### What works in this category
- **Warm brights** drive energy and attraction: Tinder, OkCupid, Bumble
- **Dark, moody surfaces** create sensuality and premium feel: Feeld, The League
- **Blue and neutral systems** increase trust for more serious dating: Match, Happn
- **Color should guide action**, not flood every surface

### Recommended direction for this app
Use a palette that combines:

- **rose / coral warmth** for flirtation and energy
- **deep purple / plum** for premium sophistication
- **midnight backgrounds** for contrast and mood
- **soft blush neutrals** so photography stays center stage

---

## 1.2 Recommended core palette

### Light theme tokens

| Role | Token | Hex | Usage |
|---|---|---:|---|
| Primary | `--color-primary` | `#D6336C` | Main CTA, important actions, active states |
| Secondary | `--color-secondary` | `#8B5CF6` | Secondary actions, premium accents, links |
| Accent | `--color-accent` | `#FFB547` | Highlights, badges, subtle premium touches |
| Support Coral | `--color-coral` | `#FF7A59` | Hero gradients, reaction states, illustrations |
| Canvas | `--color-bg` | `#FFF8FA` | App background |
| Soft Surface | `--color-bg-soft` | `#F8F1FF` | Panels, questionnaire sections |
| Surface | `--color-surface` | `#FFFFFF` | Cards, sheets, modals, inputs |
| Surface Alt | `--color-surface-2` | `#FFF1F5` | Hover/tint backgrounds |
| Border | `--color-border` | `#E9DFF2` | Input borders, dividers |
| Text Strong | `--color-text` | `#1D1027` | Headlines, primary text |
| Text Default | `--color-text-2` | `#3F3050` | Body copy |
| Text Muted | `--color-text-muted` | `#6E6480` | Secondary labels, helper text |
| Success | `--color-success` | `#18B67A` | Success states, verified-positive moments |
| Error | `--color-error` | `#E54867` | Errors, destructive states |
| Warning | `--color-warning` | `#FFB547` | Warnings, incomplete profile nudges |
| Info | `--color-info` | `#4F8CFF` | Info badges, subtle system notices |

### Dark theme tokens

| Role | Token | Hex |
|---|---|---:|
| Primary | `--color-primary` | `#F0567E` |
| Secondary | `--color-secondary` | `#A97CFF` |
| Accent | `--color-accent` | `#FFD166` |
| Coral | `--color-coral` | `#FF8A6B` |
| Canvas | `--color-bg` | `#0C0813` |
| Soft Surface | `--color-bg-soft` | `#151022` |
| Surface | `--color-surface` | `#1A1328` |
| Surface Alt | `--color-surface-2` | `#221935` |
| Border | `--color-border` | `#312543` |
| Text Strong | `--color-text` | `#FAF7FF` |
| Text Default | `--color-text-2` | `#E5DDF2` |
| Text Muted | `--color-text-muted` | `#AA9EBB` |
| Success | `--color-success` | `#34D399` |
| Error | `--color-error` | `#FF6B81` |
| Warning | `--color-warning` | `#FFC86B` |
| Info | `--color-info` | `#7AA8FF` |

---

## 1.3 Recommended gradients

### Hero gradient
For landing screens, onboarding headers, profile completion banners:

```css
--gradient-hero: linear-gradient(
  135deg,
  #ff7a59 0%,
  #d6336c 38%,
  #8b5cf6 72%,
  #24113d 100%
);
```

### Primary CTA gradient
Use sparingly on the **main action only**:

```css
--gradient-cta: linear-gradient(
  135deg,
  #c92e66 0%,
  #7c3aed 100%
);
```

### Premium / membership gradient
For upsell cards, premium tags, "boost" states:

```css
--gradient-premium: linear-gradient(
  135deg,
  #b88a2f 0%,
  #ffd166 35%,
  #8b5cf6 100%
);
```

### Match celebration gradient
For hearts, confetti bursts, match modal accents:

```css
--gradient-match: linear-gradient(
  135deg,
  #ff7a59 0%,
  #ff5d8f 45%,
  #9b6bff 100%
);
```

### Soft glow background
For empty states and feature sections:

```css
--gradient-glow:
  radial-gradient(circle at top left, rgba(255, 122, 89, 0.18), transparent 38%),
  radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.16), transparent 42%);
```

---

## 1.4 Color usage rules

- Keep the UI **60% neutral surfaces**, **30% photography/media**, **10% saturated accents**
- Don't put saturated gradients behind long body text
- Reserve the strongest pink/purple gradients for:
  - main CTA
  - hero moments
  - match moments
  - profile completion nudges
- Use amber/gold only as a **premium accent**, not the base brand color
- Dark mode should feel **midnight**, not pure black

---

# 2. Typography

## 2.1 What top apps tend to do

Most major dating apps use one of two patterns:

1. **Bold modern sans-serif for speed and clarity** — Tinder, Bumble, Badoo, Match
2. **Clean sans with editorial styling** — Hinge, Feeld, The League

The category pattern is clear: prioritize **readability**, use **large bold headlines**, keep body text clean, occasionally add an editorial accent for brand mood.

---

## 2.2 Recommended font system

### Primary recommendation
- **Headings / buttons / navigation:** `Plus Jakarta Sans`
- **Body / forms / UI copy:** `Inter`
- **Optional editorial accent (hero only):** `Fraunces`

### Why this works
- **Plus Jakarta Sans** feels modern, warm, slightly fashion-forward
- **Inter** is highly readable in forms, settings, questionnaires, and profile metadata
- **Fraunces** adds a selective "premium / sexy editorial" tone without making the app feel slow

### Usage rule
Use **only two fonts by default**: `Plus Jakarta Sans` + `Inter`

Only use `Fraunces` for: splash headlines, campaign pages, testimonials — not inside forms or dense profile UI.

---

## 2.3 Type scale

### Mobile-first type scale

| Style | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| Display | `40px` | 700 | 1.05 | Hero headings |
| H1 | `32px` | 700 | 1.1 | Screen titles |
| H2 | `26px` | 700 | 1.15 | Section headers |
| H3 | `22px` | 700 | 1.2 | Card and module titles |
| H4 | `18px` | 700 | 1.25 | Subsection headers |
| Body L | `18px` | 400/500 | 1.55 | Intro text |
| Body | `16px` | 400/500 | 1.55 | Standard copy |
| Body S | `14px` | 400/500 | 1.5 | Secondary text |
| Label | `13px` | 600 | 1.3 | Field labels, chips |
| Caption | `12px` | 500 | 1.3 | Metadata |
| Button | `16px` | 700 | 1 | All CTAs |

### Tablet adjustments (`min-width: 600px`)
- Display: `48px`, H1: `40px`, H2: `32px`, H3: `24px`

### Desktop adjustments (`min-width: 1024px`)
- Display: `56px`, H1: `48px`, H2: `36px`, H3: `28px`

---

## 2.4 Typography rules

- Headings: **tight and bold**
- Body text: **open and airy**
- Avoid centered paragraphs longer than 2 lines
- Use **sentence case**, not all caps, for most UI
- Buttons: **short, benefit-oriented, direct**

### Good CTA copy
- `Create my profile`
- `Show me people nearby`
- `Save and continue`
- `See my matches`
- `Answer 3 quick questions`

### Avoid
- `Submit`, `Proceed`, `Complete`, `Next step` (unless supported by clear context)

---

## 2.5 CSS example

```css
:root {
  --font-heading: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-accent: "Fraunces", Georgia, serif;

  --fs-display: 2.5rem;
  --fs-h1: 2rem;
  --fs-h2: 1.625rem;
  --fs-h3: 1.375rem;
  --fs-body: 1rem;
  --fs-body-sm: 0.875rem;
  --fs-label: 0.8125rem;
}

@media (min-width: 600px) {
  :root {
    --fs-display: 3rem;
    --fs-h1: 2.5rem;
    --fs-h2: 2rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --fs-display: 3.5rem;
    --fs-h1: 3rem;
    --fs-h2: 2.25rem;
  }
}
```

---

# 3. Layout & Spacing

## 3.1 Grid system

| Breakpoint | Columns | Gutter |
|---|---:|---:|
| Mobile (<600px) | 4 | `16px` |
| Tablet (600–1024px) | 8 | `24px` |
| Desktop (>1024px) | 12 | `32px` |

### Container widths

| Container | Max width | Use |
|---|---:|---|
| Full app shell | `1280px` | Desktop app frame |
| Content readable | `720px` | Settings, questionnaire, text-heavy pages |
| Form container | `560px` | Signup/profile flow |
| Discovery deck | `420px–480px` | Swipe card stack |
| Modal/sheet | `520px` | Dialogs, premium prompts |

---

## 3.2 Breakpoints

```css
/* mobile-first */
@media (min-width: 600px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

### Behavior by breakpoint

**Mobile:** full-width CTAs, stacked content, bottom navigation, swipe-first deck, sticky footer actions

**Tablet:** centered deck + details pane, two-column questionnaire layouts, more breathing room

**Desktop:** discovery deck + side panel, multi-column profile details, persistent navigation, hover states

---

## 3.3 Spacing scale (4px base)

| Token | Value |
|---|---:|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |

---

## 3.4 Radius system

| Token | Value | Use |
|---|---:|---|
| `--radius-sm` | `12px` | chips, small controls |
| `--radius-md` | `16px` | inputs, buttons |
| `--radius-lg` | `20px` | cards |
| `--radius-xl` | `24px` | large cards, sheets |
| `--radius-pill` | `999px` | CTAs, filters, tags |

---

## 3.5 Profile layout recommendations

### Swipe card
- Aspect ratio: **4:5**
- Card width: `min(100%, 420px)` on mobile
- Layered stack: top card + 1–2 peeking cards behind
- Bottom content overlay with name, age, location, quick tags

### Full profile page sections
1. Photo carousel
2. Name, age, pronouns
3. Verification + last active
4. Bio / headline
5. Prompt cards
6. Interests tags
7. Lifestyle tags
8. Relationship intent
9. Preferences overlap
10. Action footer

### Desktop discovery layout
- Left: filters/preferences
- Center: swipe deck
- Right: expanded profile preview or active conversation teaser

---

# 4. Buttons & CTAs

## 4.1 What top dating apps do well

- Large, obvious, emotionally clear CTAs
- Usually **one primary CTA per screen**
- Close to the thumb on mobile
- They don't overwhelm with equal-weight buttons

## 4.2 CTA strategy

### Rule of one
Each screen should have **1 primary action**, optional **1 secondary action**. Low-importance links should look like links, not buttons.

### CTA copy formula: Verb + emotional outcome
- `Start matching`
- `Build my profile`
- `Answer 3 quick questions`
- `Find my vibe`

---

## 4.3 Button variants

| Variant | Style | Use |
|---|---|---|
| Primary | Gradient fill + white text | Main conversion action |
| Secondary | Soft tinted surface + dark text + border | Supporting action |
| Ghost | Transparent background | Tertiary action |
| Danger | Subtle red tint or red outline | Destructive action |
| Icon Circle | Circular button with shadow | Swipe actions (like/pass/save) |

### Shared specs
- Height: `52px`
- Padding: `20px–24px`
- Radius: `999px`
- Font: `16px / 700`
- Transition: `180ms`
- Full width on mobile for main conversion buttons

---

## 4.4 Button CSS example

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 52px;
  padding: 0 1.25rem;
  border: 0;
  border-radius: 999px;
  font: 700 1rem/1 var(--font-heading);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    opacity 180ms ease,
    background 180ms ease;
  cursor: pointer;
}

.primary {
  color: #fff;
  background: var(--gradient-cta);
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.22);
}

.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(124, 58, 237, 0.28);
}

.primary:active {
  transform: translateY(0) scale(0.98);
}

.secondary {
  color: var(--color-text);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
}

.ghost {
  color: var(--color-text-2);
  background: transparent;
}

.danger {
  color: var(--color-error);
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--color-error) 35%, transparent);
}
```

---

# 5. Cards & Profile Components

## 5.1 Card design principles

Dating products win on **people, not chrome**. Cards should frame people beautifully without feeling busy.

- Generous image real estate
- Strong photo overlay for readability
- Quick-scan metadata
- One or two delightful details
- Clear action affordance

---

## 5.2 Profile card anatomy

### Swipe card
1. **Hero image** (75–80%)
2. **Subtle top-right badge(s):** `Verified`, `New`, `Active today`
3. **Bottom gradient overlay**
4. **Name + age**
5. **Location / distance**
6. **Intent or vibe chip:** e.g., `Long-term`, `Open-minded`, `Coffee date?`
7. **1–3 interest chips**
8. **Prompt teaser**

---

## 5.3 Card style tokens

```css
--shadow-card: 0 18px 50px rgba(29, 16, 39, 0.14);
```

Photo overlay for text legibility:
```css
background: linear-gradient(
  180deg,
  rgba(12, 8, 19, 0) 38%,
  rgba(12, 8, 19, 0.78) 100%
);
```

| Property | Recommendation |
|---|---|
| Radius | `24px` |
| Surface | White or dark elevated surface |
| Shadow | Soft, diffuse, not hard black |
| Border | Optional subtle border in light mode |
| Card stack | 2 peeking layers max |

---

## 5.4 Prompt cards

Prompt cards are one of the best patterns in dating UX because they:
- reveal personality
- reduce "hey" conversations
- make profiles feel fuller without long bios

Style: surface color tint, 16–20px padding, bold prompt label, readable answer size.

---

## 5.5 Badges & status indicators

| Badge | Color treatment |
|---|---|
| Verified | Green or blue tint |
| Premium/top pick | Amber or purple tint |
| Online now | Green dot |
| Intent match | Rose/purple tinted pill |
| New here | Soft blue pill |

Badge styling: small pills, 28–32px height, semi-opaque surfaces on images.

---

## 5.6 Swipe interface

- Show slight rotation and motion as users drag
- Show accept/reject overlays during swipe
- Keep swipe threshold forgiving
- Buttons should mirror swipe actions for accessibility

### Action buttons
- Pass, Like, Super-like / Spark, Save / Revisit (optional)
- Mobile: floating circular buttons below card
- Desktop: allow both drag and keyboard/button control

---

# 6. Animations & Micro-interactions

## 6.1 Motion principles

Motion should feel: **smooth, light, romantic, rewarding** — never cartoonish or noisy. Think **luxury app**, not arcade game.

---

## 6.2 Timing

| Token | Value | Use |
|---|---:|---|
| `--dur-fast` | `140ms` | hover/focus |
| `--dur-med` | `220ms` | buttons, cards, chips |
| `--dur-slow` | `420ms` | modals, drawers, match moments |
| `--dur-celebrate` | `700ms–900ms` | match celebration |

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-smooth: cubic-bezier(0.2, 0.8, 0.2, 1);
```

---

## 6.3 Recommended micro-interactions

| Interaction | Behavior |
|---|---|
| **Swipe feedback** | Card rotates 4–6deg, overlay stamp appears (LIKE/PASS), background glow shifts |
| **Match celebration** | Modal scales in, avatars slide together, soft burst/confetti/hearts |
| **Button hover** | Lift 1–2px |
| **Button active** | `scale(0.98)` |
| **Card hover** | Slight lift on desktop |
| **Image hover** | `scale(1.02)` max, keep subtle |
| **Loading** | Shimmering skeletons, blurred preview cards |
| **Success** | Field checks animate in, progress meter ticks up |

---

## 6.4 CSS animation examples

```css
@keyframes matchPop {
  0% { transform: scale(0.92); opacity: 0; }
  60% { transform: scale(1.04); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 rgba(214, 51, 108, 0); }
  50% { box-shadow: 0 0 24px rgba(214, 51, 108, 0.26); }
}
```

---

## 6.5 Motion accessibility

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 7. Form Design

## 7.1 Form philosophy

Long forms are necessary in dating, but they should feel like **self-expression** and **progress**, not admin work. A great dating form feels like building your vibe, not completing paperwork.

---

## 7.2 Input styles

### Text inputs
- Height: `52px`
- Radius: `16px`
- Background: `var(--color-surface)`
- Border: `1px solid var(--color-border)`
- Padding: `0 16px`
- Focus ring: visible and brand-colored
- Labels: **outside** the field for clarity

### Focus state
```css
outline: 3px solid color-mix(in srgb, var(--color-secondary) 25%, transparent);
outline-offset: 2px;
```

---

## 7.3 Questionnaire controls

| Control | Best for |
|---|---|
| **Multi-select chips** | Interests, hobbies, values, love languages, ideal date types |
| **Sliders / range** | Age range, distance, energy/preference scales |
| **Likert scales** | "How important is this?", lifestyle preferences |
| **Radio cards** | Relationship intent, living situation, communication style |
| **Photo upload** | Put early — increases investment and momentum |

### Likert recommended style
- 5-card horizontal choice group
- Large tap targets
- Descriptive anchors: `Not at all` · `A little` · `Neutral` · `Important` · `Very important`

---

## 7.4 Make long forms feel engaging

### Recommended pattern
- 1–3 questions per screen on mobile
- Sticky bottom CTA
- Clear progress indicator
- Autosave all steps
- Show estimated time remaining
- Allow skip for non-essential items
- Mix interaction types to reduce fatigue

### Good progression examples
- `Step 3 of 7`
- `You're 61% profile-ready`
- `2 more answers to improve your matches`
- `People with 4+ photos get more likes`

---

## 7.5 Validation style

- Validate inline, not all at submit time
- Error text should be short and human

### Good error copy
- `Add at least one photo to keep going`
- `Tell people a little more about yourself`
- `Choose at least 3 interests`

### Avoid
- `Invalid input`, `Form error`, `Submission failed`

---

# 8. Onboarding & Conversion UX

## 8.1 What the best apps do psychologically

| App | Strategy |
|---|---|
| **Tinder** | Instant momentum through low friction and immediate discovery fantasy |
| **Bumble** | Trust and direction through empowerment, safety, clear positioning |
| **Hinge** | Better conversations by getting users to reveal personality early |
| **Match** | Credibility, testimonials, serious-intent signaling |
| **OkCupid** | Makes users feel seen through identity depth and questionnaires |
| **Feeld** | Belonging and curiosity through inclusive language and sensual restraint |
| **Coffee Meets Bagel** | Curation and scarcity to make matches feel higher value |
| **Happn** | Local proximity turned into a romantic story |
| **The League** | Exclusivity and polish to create aspiration |
| **Badoo** | Social proof, liveliness, authenticity via verification/video |

---

## 8.2 Recommended onboarding funnel

### Stage 1: Hook — create desire fast
- One gorgeous hero image/gradient + faces
- Bold headline: `Meet people you'll actually want to text back`
- One primary CTA
- Trust line under CTA

### Stage 2: Fast signup — remove friction
- Google / Apple / email
- Minimal first step
- Explain why profile details improve matches

### Stage 3: Emotional investment — make users care
- Photo, first name, age, identity basics, relationship intent

### Stage 4: Self-expression — personality and conversation hooks
- 3 prompts, interests, vibe / date style, preferences

### Stage 5: Questionnaire + preferences — improve quality
- Grouped questions, progress, optional skip, preview rewards

### Stage 6: Reward reveal — show payoff
- Polished profile preview
- First discovery deck
- Blurred teaser of nearby people before final completion

### Stage 7: Completion nudges — increase quality
- Nudge for more photos, finish questionnaire, verify profile
- Tie completion to better match visibility

---

## 8.3 Conversion rules

- Put the **main CTA at the bottom** on mobile
- Only ask for what matters **now**
- Reward every burst of effort
- Show users their profile improving in real time
- Tie completion to outcomes: better visibility, better matches, more replies

### Example nudge copy
- `Add 2 more photos to get seen more`
- `Answer 3 quick questions to improve your match quality`
- `Profiles with prompts start better conversations`

---

## 8.4 Engagement psychology — use ethically

### Effective
- Progress and momentum
- Anticipation
- Self-expression
- Social proof
- Identity reinforcement
- Clarity of next step

### Avoid
- Fake urgency
- Dark patterns
- Hiding core features too aggressively
- Manipulative shame copy

The app should be **captivating**, but still respectful.

---

# 9. Dark Mode

## 9.1 Dark mode philosophy

For a dating app, dark mode should feel: **intimate, flattering, luxe, late-night, cinematic**. Use **midnight plum surfaces**, not flat black.

---

## 9.2 Dark mode rules

- Never use pure `#000000` as the main canvas
- Raise surface layers slightly with purple/plum undertones
- Increase photo overlays for text legibility
- Keep saturated accents bright, but not neon
- Use soft glows, not harsh shadows

### Good dark backgrounds
- `#0C0813`, `#151022`, `#1A1328`

### Avoid
- Cold blue-black everywhere
- Stark white cards on near-black
- Neon gradients that feel gaming-app-like

---

## 9.3 Dark mode adjustments by component

| Component | Adjustment |
|---|---|
| **Buttons** | Gradient stays vibrant, shadows become softer glow, borders slightly brighter |
| **Cards** | Surface: dark elevated tone, border: subtle plum line, shadow: ambient |
| **Inputs** | Dark elevated fill, stronger focus ring, muted placeholders |
| **Photos** | Stronger gradient overlay, avoid darkening skin tones, keep highlights warm |

---

# 10. CSS Best Practices for React

## 10.1 Use CSS Modules

For this project, **CSS Modules are the right default**.

### Why CSS Modules fit
- No runtime styling cost
- Easy co-location with components
- Predictable scoping
- Simple theming with CSS custom properties
- Great for React 19
- Lighter and simpler than styled-components for this use case

### Recommendation
- **CSS Modules for component styles**
- **Global token files for theme, spacing, typography, reset**

---

## 10.2 Recommended style architecture

```
src/
  styles/
    tokens.css          /* design tokens */
    theme.css           /* light/dark themes */
    base.css            /* reset, global typography */
    utilities.css       /* common utilities */
  components/
    Button/
      Button.js
      Button.module.css
    ProfileCard/
      ProfileCard.js
      ProfileCard.module.css
```

---

## 10.3 CSS custom properties for all design tokens

```css
:root {
  --color-primary: #d6336c;
  --color-secondary: #8b5cf6;
  --space-4: 16px;
  --radius-lg: 20px;
  --shadow-card: 0 18px 50px rgba(29, 16, 39, 0.14);
}

:root[data-theme="dark"] {
  --color-bg: #0c0813;
  --color-surface: #1a1328;
  --color-text: #faf7ff;
}
```

---

## 10.4 Responsive patterns

### Prefer
- Mobile-first media queries
- `clamp()` for fluid typography
- `aspect-ratio` for media
- `min()`, `max()`, `minmax()`
- CSS Grid for layout, Flexbox for alignment
- `object-fit: cover`
- `position: sticky` for onboarding CTAs and filters

```css
.card {
  width: min(100%, 420px);
  aspect-ratio: 4 / 5;
}
```

---

## 10.5 Performance tips

- Animate only `transform` and `opacity`
- Avoid heavy blur effects on many stacked cards
- Limit layered box-shadows
- Lazy-load profile images
- Use responsive image sizes
- Use `content-visibility: auto;` where appropriate
- Keep CSS selectors shallow

---

## 10.6 Accessibility guardrails

- Maintain AA contrast for text and controls
- Make all swipe actions available by button
- Use `:focus-visible`
- Minimum touch targets: `44px`
- Never rely only on color to indicate status
- Respect `prefers-reduced-motion`
- Labels must remain visible for forms
- Ensure dark mode text contrast stays strong on imagery

---

## 10.7 Useful CSS patterns

### Focus-visible
```css
:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-secondary) 28%, transparent);
  outline-offset: 2px;
}
```

### Bottom mobile CTA
```css
.footerCta {
  position: sticky;
  bottom: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
  backdrop-filter: blur(12px);
}
```

### Safe image cards
```css
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

---

# 11. Recommended Resources

## Fonts
- **Plus Jakarta Sans** — https://fonts.google.com/specimen/Plus+Jakarta+Sans
- **Inter** — https://fonts.google.com/specimen/Inter
- **Fraunces** — https://fonts.google.com/specimen/Fraunces

## Icons
- **Lucide** — https://lucide.dev/
- **Phosphor Icons** — https://phosphoricons.com/
- **Heroicons** — https://heroicons.com/

## Motion / Animation
- **Motion for React** — https://motion.dev/
- **AutoAnimate** — https://auto-animate.formkit.com/
- **LottieFiles** — https://lottiefiles.com/

## Carousel / Swipe Helpers
- **Embla Carousel** — https://www.embla-carousel.com/
- **Swiper** — https://swiperjs.com/

## Colors / Design Tokens
- **Open Props** — https://open-props.style/
- **Radix Colors** — https://www.radix-ui.com/colors
- **Coolors Contrast Checker** — https://coolors.co/contrast-checker
- **WebAIM Contrast Checker** — https://webaim.org/resources/contrastchecker/

## Design Inspiration / Pattern Libraries
- **Mobbin** — https://mobbin.com/
- **pttrns** — https://www.pttrns.com/
- **Dribbble** — https://dribbble.com/
- **Behance** — https://www.behance.net/

## Design System / Component Workflow
- **Storybook** — https://storybook.js.org/
- **Radix Primitives** — https://www.radix-ui.com/primitives

## Form UX Helpers
- **React Hook Form** — https://react-hook-form.com/
- **Zod** — https://zod.dev/

---

# Quick UI Recipe

If you want a default visual formula that works immediately:

| Element | Recommendation |
|---|---|
| **Background** | Soft blush white (light), midnight plum (dark) |
| **Primary CTA** | Rose → purple gradient pill |
| **Cards** | White/dark elevated surfaces, `24px` radius |
| **Typography** | Plus Jakarta Sans headings, Inter body |
| **Profile cards** | 4:5 aspect, photo-first, bottom gradient overlay, 1 prompt teaser |
| **Forms** | 1–3 questions per screen, sticky CTA, visible progress |
| **Animations** | Soft, sub-250ms for UI, 700ms max for celebrations |
| **Navigation** | Bottom-first on mobile, side/supporting on desktop |
| **Mood** | Warm gradients + generous whitespace + flattering dark surfaces |

---

# Final Principle

> A dating app UI should not feel like a dashboard.
>
> It should feel:
> - a little cinematic
> - a little editorial
> - very easy to use
> - and always moving the user toward the next emotional payoff
>
> **Design for chemistry, but ship with clarity.**
