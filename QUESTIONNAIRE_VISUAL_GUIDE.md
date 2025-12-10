# Compatibility Questionnaire - Visual & User Flow Guide

A guide to the user experience and visual flow of the questionnaire system.

---

## User Flow Diagram

```
┌─────────────────────────────────────────────┐
│ User visits /compatibility-questionnaire    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
   ┌───────────────────────────────┐
   │ CompatibilityQuestionnaire    │
   │ Selector - Choose Type        │
   │                               │
   │ [Casual Dating Card]          │
   │ [Long-Term/Marriage Card]     │
   └──────────────┬────────────────┘
                   │ Click type
                   ▼
   ┌───────────────────────────────┐
   │ Select Questionnaire Length   │
   │                               │
   │ [Quick - 10 min]              │
   │ [Detailed - 25 min]           │
   │ [Comprehensive - 45 min]      │
   │                               │
   │ [← Back]                      │
   └──────────────┬────────────────┘
                   │ Click length
                   ▼
   ┌───────────────────────────────┐
   │ Fill Out Questionnaire        │
   │                               │
   │ Question 1: [Radio Options]   │
   │ Question 2: [Radio Options]   │
   │ ...                           │
   │                               │
   │ [Submit] [Cancel] [Previous*] │
   │ *Only on multi-step forms     │
   └──────────────┬────────────────┘
                   │ Submit
                   ▼
   ┌───────────────────────────────┐
   │ Success - Data Submitted      │
   │                               │
   │ Redirect to /profile          │
   │ Show match recommendations    │
   └───────────────────────────────┘
```

---

## Screen 1: Questionnaire Type Selection

### Desktop View (1024px+)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          Compatibility Questionnaires                      ║
║                                                            ║
║   Find compatible partners that match your relationship    ║
║                      goals                                 ║
║                                                            ║
║  ┌──────────────────────┐  ┌──────────────────────┐       ║
║  │   💫                 │  │   💕                 │       ║
║  │                      │  │                      │       ║
║  │   Casual / Short-    │  │   Long-Term /        │       ║
║  │   Term Dating        │  │   Marriage           │       ║
║  │                      │  │                      │       ║
║  │ Find compatible      │  │ Find compatible      │       ║
║  │ partners for casual  │  │ partners for serious,│       ║
║  │ dating and short-    │  │ long-term & marriage │       ║
║  │ term relationships   │  │ relationships        │       ║
║  │                      │  │                      │       ║
║  │  [Choose Casual]     │  │ [Choose Long-Term]   │       ║
║  └──────────────────────┘  └──────────────────────┘       ║
║                                                            ║
║                        [Cancel]                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Mobile View (480px)

```
╔═══════════════════════════════════════╗
║                                       ║
║   Compatibility Questionnaires        ║
║                                       ║
║   Find compatible partners...         ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │   💫                            │  ║
║  │                                 │  ║
║  │   Casual / Short-Term Dating    │  ║
║  │                                 │  ║
║  │   Find compatible partners...   │  ║
║  │                                 │  ║
║  │   [Choose Casual]               │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │   💕                            │  ║
║  │                                 │  ║
║  │   Long-Term / Marriage          │  ║
║  │                                 │  ║
║  │   Find compatible partners...   │  ║
║  │                                 │  ║
║  │   [Choose Long-Term]            │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║          [Cancel]                     ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## Screen 2: Questionnaire Length Selection

### Desktop View (1024px+)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  ← Back    Casual / Short-Term Dating                     ║
║                                                            ║
║     Choose a questionnaire length based on how much       ║
║     detail you want to provide                             ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Quick (10 questions)                           5 min │ ║
║  │                                                      │ ║
║  │ Essential questions about compatibility. Takes      │ ║
║  │ ~5 minutes.                                         │ ║
║  │                                                      │ ║
║  │                        [Start Questionnaire]        │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Detailed (25 questions)                       15 min │ ║
║  │                                                      │ ║
║  │ Comprehensive assessment of casual dating           │ ║
║  │ compatibility. Takes ~15 minutes.                   │ ║
║  │                                                      │ ║
║  │                        [Start Questionnaire]        │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Comprehensive (50 questions)                  25 min │ ║
║  │                                                      │ ║
║  │ Complete compatibility profile. Takes ~25 minutes.  │ ║
║  │                                                      │ ║
║  │                        [Start Questionnaire]        │ ║
║  │                            [Coming Soon]            │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║                        [Cancel]                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Mobile View (480px)

```
╔═══════════════════════════════════════╗
║ ← Back                                ║
║ Casual / Short-Term Dating            ║
║                                       ║
║ Choose a length...                    ║
║                                       ║
║ ┌─────────────────────────────────┐  ║
║ │ Quick (10 questions)     5 min  │  ║
║ │                                 │  ║
║ │ Essential questions about...    │  ║
║ │                                 │  ║
║ │  [Start Questionnaire]          │  ║
║ └─────────────────────────────────┘  ║
║                                       ║
║ ┌─────────────────────────────────┐  ║
║ │ Detailed (25 questions)  15 min │  ║
║ │                                 │  ║
║ │ Comprehensive assessment of...  │  ║
║ │                                 │  ║
║ │  [Start Questionnaire]          │  ║
║ └─────────────────────────────────┘  ║
║                                       ║
║ ┌─────────────────────────────────┐  ║
║ │ Comprehensive (50...)   25 min  │  ║
║ │                                 │  ║
║ │ Complete compatibility...       │  ║
║ │                                 │  ║
║ │  [Coming Soon]                  │  ║
║ └─────────────────────────────────┘  ║
║                                       ║
║        [Cancel]                       ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## Screen 3: Short Questionnaire (10 Questions)

### Desktop View (1024px+)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          Casual Dating Compatibility (Quick)              ║
║                                                            ║
║    10 essential questions about short-term relationship   ║
║                         compatibility                     ║
║                                                            ║
║  ────────────────────────────────────────────────────────  ║
║                                                            ║
║  PHYSICAL INTIMACY & ATTRACTION                           ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ How important is physical chemistry and sexual       │ ║
║  │ attraction in a potential partner?                   │ ║
║  │                                                      │ ║
║  │ ◉ Essential                                          │ ║
║  │ ○ Very important                                    │ ║
║  │ ○ Somewhat important                                │ ║
║  │ ○ Not very important                                │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ What is your preferred frequency of physical        │ ║
║  │ intimacy?                                            │ ║
║  │                                                      │ ║
║  │ ○ Very frequent (multiple times weekly)             │ ║
║  │ ◉ Regular (1-2 times weekly)                        │ ║
║  │ ○ Moderate (1-2 times monthly)                      │ ║
║  │ ○ No preference                                     │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ... more questions ...                                   ║
║                                                            ║
║  ────────────────────────────────────────────────────────  ║
║                                                            ║
║         [Submit Questionnaire] [Cancel]                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Mobile View (480px)

```
╔═══════════════════════════════════════╗
║                                       ║
║ Casual Dating Compatibility (Quick)   ║
║                                       ║
║ 10 essential questions...             ║
║                                       ║
║ PHYSICAL INTIMACY & ATTRACTION        ║
║                                       ║
║ ┌─────────────────────────────────┐  ║
║ │ How important is physical       │  ║
║ │ chemistry and sexual attraction?│  ║
║ │                                 │  ║
║ │ ◉ Essential                     │  ║
║ │ ○ Very important                │  ║
║ │ ○ Somewhat important            │  ║
║ │ ○ Not very important            │  ║
║ └─────────────────────────────────┘  ║
║                                       ║
║ ┌─────────────────────────────────┐  ║
║ │ What is your preferred          │  ║
║ │ frequency of physical intimacy? │  ║
║ │                                 │  ║
║ │ ○ Very frequent                 │  ║
║ │ ◉ Regular (1-2 times weekly)    │  ║
║ │ ○ Moderate                      │  ║
║ │ ○ No preference                 │  ║
║ └─────────────────────────────────┘  ║
║                                       ║
║ ... more questions ...                ║
║                                       ║
║   [Submit] [Cancel]                   ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## Screen 4: Medium Questionnaire (25 Questions) - Multi-Step

### Desktop View - Step 1/5 (1024px+)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          Casual Dating Compatibility                      ║
║                                                            ║
║    25 questions about short-term relationship compat.     ║
║                                                            ║
║  Progress: ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  20%        ║
║                                                            ║
║  Section 1 of 5                                            ║
║                                                            ║
║  PHYSICAL INTIMACY & ATTRACTION                           ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ How important is sexual chemistry in your dating    │ ║
║  │ decisions?                                           │ ║
║  │                                                      │ ║
║  │ ◉ Must/Essential                                    │ ║
║  │ ○ Should/Very important                            │ ║
║  │ ○ Could/Nice to have                               │ ║
║  │ ○ Not important                                    │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ... 4 more questions on this section ...                 ║
║                                                            ║
║  ────────────────────────────────────────────────────────  ║
║                                                            ║
║              [Previous] [Next] [Cancel]                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Mobile View - Step 1/5 (480px)

```
╔═══════════════════════════════════════╗
║                                       ║
║ Casual Dating Compatibility           ║
║                                       ║
║ 25 questions about short-term compat. ║
║                                       ║
║ ████░░░░░░░░░░░░░░ 20%                ║
║ Section 1 of 5                        ║
║                                       ║
║ PHYSICAL INTIMACY & ATTRACTION        ║
║                                       ║
║ ┌─────────────────────────────────┐  ║
║ │ How important is sexual         │  ║
║ │ chemistry?                      │  ║
║ │                                 │  ║
║ │ ◉ Must/Essential                │  ║
║ │ ○ Should/Very important         │  ║
║ │ ○ Could/Nice to have            │  ║
║ │ ○ Not important                 │  ║
║ └─────────────────────────────────┘  ║
║                                       ║
║ ┌─────────────────────────────────┐  ║
║ │ What's your preferred frequency?│  ║
║ │                                 │  ║
║ │ ... options ...                 │  ║
║ │                                 │  ║
║ └─────────────────────────────────┘  ║
║                                       ║
║ [Previous] [Next] [Cancel]            ║
║                                       ║
╚═══════════════════════════════════════╝
```

### Desktop View - Final Step (5/5) (1024px+)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          Casual Dating Compatibility                      ║
║                                                            ║
║    25 questions about short-term relationship compat.     ║
║                                                            ║
║  Progress: ████████████████████████████████████████ 100%  ║
║                                                            ║
║  Section 5 of 5                                            ║
║                                                            ║
║  HONESTY, EXPECTATIONS & GROWTH                           ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ How comfortable are you being upfront about what    │ ║
║  │ you want from dating?                               │ ║
║  │                                                      │ ║
║  │ ◉ Very comfortable—I'm clear about my intentions    │ ║
║  │ ○ Somewhat comfortable                             │ ║
║  │ ○ Uncomfortable but willing                        │ ║
║  │ ○ Prefer to let things develop naturally           │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ... 4 more questions on this section ...                 ║
║                                                            ║
║  ────────────────────────────────────────────────────────  ║
║                                                            ║
║         [Previous] [Submit Questionnaire] [Cancel]        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Form Validation State

### Valid Form - Desktop (1024px+)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  Question: How important is...                            ║
║                                                            ║
║  ◉ Essential                                              ║
║  ○ Very important                                         ║
║  ○ Somewhat important                                     ║
║  ○ Not important                                          ║
║                                                            ║
║  ✓ All fields filled                                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Invalid Form - Desktop (1024px+)

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  Question: How important is...                            ║
║                                                            ║
║  ○ Essential                                              ║
║  ○ Very important                                         ║
║  ○ Somewhat important                                     ║
║  ○ Not important                                          ║
║                                                            ║
║  ⚠ Required                                               ║
║  (Text in red)                                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Question Type Examples

### Radio Button Group (Single Select)

```
How important is...?

◉ Essential
○ Very important
○ Somewhat important
○ Not important
```

### With Selection

```
How important is...?

○ Essential
◉ Very important
○ Somewhat important
○ Not important
```

---

## Color Scheme

### Primary Colors
- **Primary:** `#667eea` (Purple-blue) - Used for active selections, primary buttons
- **Secondary:** `#764ba2` (Purple) - Used for hover states, accents
- **Background:** `#ffffff` (White) - Card and form background
- **Lighter Background:** `#f9f9f9` (Off-white) - Section background

### Text Colors
- **Primary Text:** `#333333` (Dark gray) - Headlines, labels
- **Secondary Text:** `#666666` (Gray) - Body text, descriptions
- **Disabled Text:** `#999999` (Light gray) - Disabled states

### Status Colors
- **Error:** `#e74c3c` (Red) - Error messages, invalid inputs
- **Success:** `#27ae60` (Green) - Success messages
- **Border:** `#e0e0e0` (Light gray) - Input borders

---

## Responsive Breakpoints

### Desktop (1024px+)
- Full width layout
- Grid layouts for cards
- Side-by-side buttons
- Larger font sizes

### Tablet (768px - 1023px)
- Adjusted padding
- Single column layouts
- Wrapped buttons
- Medium font sizes

### Mobile (480px - 767px)
- Full-width elements
- Large touch targets
- Stacked layout
- Smaller font sizes
- Simplified spacing

### Extra Small (< 480px)
- Maximum 1 column
- Large buttons (48px minimum height)
- Minimum 16px font sizes
- Generous padding

---

## Progress Bar Visualization

### Short Form (No Progress Bar)
```
Single page form - no progress tracking
```

### Medium Form (5 Sections)
```
Step 1: ████░░░░░░░░░░░░░░░░░░░░░░  20%
Step 2: ████████░░░░░░░░░░░░░░░░░░  40%
Step 3: ████████████░░░░░░░░░░░░░░  60%
Step 4: ████████████████░░░░░░░░░░  80%
Step 5: ████████████████████░░░░░░  100%
```

---

## Button States

### Default
```
[Button Text]
Background: #667eea
Text: white
Cursor: pointer
```

### Hover
```
[Button Text]
Background: #764ba2
Text: white
Cursor: pointer
Transform: translateY(-2px)
Box-shadow: 0 4px 12px rgba(0,0,0,0.15)
```

### Disabled/Loading
```
[Submitting...]
Background: #667eea
Text: white
Opacity: 0.6
Cursor: not-allowed
Disabled: true
```

### Pressed
```
[Button Text]
Background: #764ba2
Text: white
Transform: translateY(0)
Box-shadow: 0 2px 4px rgba(0,0,0,0.1)
```

---

## Navigation Flow

```
Type Selection Screen
         │
         ├─ Casual
         │    │
         │    ├─ Short (10Q) → Questionnaire
         │    ├─ Medium (25Q) → Questionnaire
         │    └─ Long (50Q) → Coming Soon
         │
         └─ Long-Term
              │
              ├─ Short (15Q) → Questionnaire
              ├─ Medium (35Q) → Coming Soon
              └─ Long (100Q) → Coming Soon
```

---

## Estimated User Experience Timeline

```
User Action          Time      Screen
─────────────────────────────────────────
Load page            0s        Type selector
Click type           0.1s      Length selector
Click length         0.1s      Questionnaire
Read intro           3s        Questionnaire
Fill Q1              8s        Same screen
Fill Q2              8s        Same screen
...
Fill Final Q         8s        Same screen / final screen
Review answers       3s        Same screen
Click Submit         0.1s      Success/redirect
─────────────────────────────────────────
Total - Short:       ~5 min
Total - Medium:      ~15 min
Total - Long:        ~45 min
```

---

## Accessibility Features

### Visual
```
✓ High contrast (WCAG AA compliant)
✓ Clear focus indicators
✓ Large touch targets (48px minimum)
✓ Clear error messages
```

### Interaction
```
✓ Keyboard navigation
✓ Tab order correct
✓ Proper form labels
✓ Required field indicators
```

### Content
```
✓ Clear question wording
✓ Helpful descriptions
✓ Grouped related questions
✓ Progress indicators
```

---

## Summary

The visual design creates a:
- ✓ Clean, modern appearance
- ✓ Clear progression through questions
- ✓ Mobile-first responsive design
- ✓ Professional and trustworthy feel
- ✓ Easy-to-use questionnaire flow

All designed to encourage completion and accurate responses.
