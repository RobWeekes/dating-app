# Questionnaire Feature - Visual Architecture & Flow

## Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    Questionnaire Page                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Header: "Your Questionnaire" / "Complete Questionnaire"    │ │
│  │ [Edit] Button (if in view mode)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    VIEW MODE                                │ │
│  │  (if questionnaire exists)                                 │ │
│  │                                                             │ │
│  │  • Personality Type: Introvert                             │ │
│  │  • Dating Goal: Long-term relationship                     │ │
│  │  • Relationship Type: Monogamous                           │ │
│  │  • Interests: [Travel] [Fitness] [Art & Music]            │ │
│  │  • Ideal Date: Coffee date at a cafe...                   │ │
│  │  • 5-Year Goals: Settled down and traveling...            │ │
│  │  • About You: I love adventure...                          │ │
│  │                                                             │ │
│  │              [Edit Button] [Delete Button]                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    EDIT MODE                                │ │
│  │  (form for new or updating questionnaire)                  │ │
│  │                                                             │ │
│  │  1. Personality Type:      [Dropdown: Introvert/Ambivert/Extrovert]
│  │                             🔴 Error message if needed      │ │
│  │                                                             │ │
│  │  2. Dating Goal:           [Dropdown: Long-term/Casual/Friendship]
│  │                             🔴 Error message if needed      │ │
│  │                                                             │ │
│  │  3. Relationship Type:     [Dropdown: Monogamous/Open/Not sure]
│  │                             🔴 Error message if needed      │ │
│  │                                                             │ │
│  │  4. Interests:             ☐ Travel  ☐ Fitness ☐ Art      │ │
│  │     (min 3)                ☐ Music   ☐ Reading ☐ Outdoor   │ │
│  │                             ☐ Movies  ☐ Gaming  ☐ Sports   │ │
│  │                             ☐ Photo   ☐ Volunteer ☐ Meditate
│  │                             Selected: 4/12                  │ │
│  │                             🔴 Error: select at least 3     │ │
│  │                                                             │ │
│  │  5. Ideal First Date:                                       │ │
│  │     [TextArea________________                              │ │
│  │      ________________________]                              │ │
│  │     🔴 Error message if empty                              │ │
│  │                                                             │ │
│  │  6. Where in 5 Years:                                       │ │
│  │     [TextArea________________                              │ │
│  │      ________________________]                              │ │
│  │     🔴 Error message if empty                              │ │
│  │                                                             │ │
│  │  7. About You:                                              │ │
│  │     [TextArea________________                              │ │
│  │      ________________________]                              │ │
│  │     🔴 Error message if empty                              │ │
│  │                                                             │ │
│  │              [Submit/Update] [Cancel]                      │ │
│  │                                                             │ │
│  │  ⚠️ Errors shown in red, cleared on typing                │ │
│  │  💬 Submit button shows "Submitting..." during API call   │ │
│  │  ⏱️  Redirects to /profile on success                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## User Interaction Flow

```
┌─────────────────────────────────────┐
│   User Navigates to Questionnaire   │
│      /questionnaire Route           │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Component    │
        │ Mount        │
        └──────┬───────┘
               │
               ▼ useEffect triggers
        ┌──────────────────────────────┐
        │ fetchAPI GET                 │
        │ /questionnaires/user/:userId │
        └──────┬───────────────┬───────┘
               │               │
        ┌──────▼────┐   ┌──────▼────────┐
        │ Data      │   │ 404 Error     │
        │ Found     │   │ (New User)    │
        └──────┬────┘   └──────┬────────┘
               │               │
        ┌──────▼────────┐    ┌──▼──────────┐
        │ SHOW VIEW MODE│    │ SHOW FORM   │
        │ with Edit btn │    │ (EDIT MODE) │
        └──────┬────────┘    └──┬──────────┘
               │                │
        ┌──────▼────────┐    ┌──▼──────────┐
        │ User Clicks   │    │ User Fills  │
        │ [Edit]        │    │ Form Fields │
        └──────┬────────┘    └──┬──────────┘
               │                │
        ┌──────▼────────────────▼──┐
        │  SWITCH TO EDIT MODE     │
        │  Form shows with data    │
        └──────┬─────────────────┬─┘
               │                 │
        ┌──────▼─┐        ┌──────▼────────┐
        │ User   │        │ User Clicks   │
        │ Edits  │        │ [Submit/Update]
        │ Form   │        └──────┬────────┘
        └──────┬─┘               │
               │         ┌───────▼────────┐
               │         │ Validate Form  │
               │         └───┬──────┬─────┘
               │             │      │
               │       ┌─────▼─┐ ┌──▼────────┐
               │       │ Valid │ │Invalid    │
               │       │ Data  │ │Data       │
               │       └─────┬─┘ └──┬────────┘
               │             │      │
               │             │    ┌─▼──────────────┐
               │             │    │ Show Errors    │
               │             │    │ Red Text on    │
               │             │    │ Invalid Fields │
               │             │    └─┬──────────────┘
               │             │      │
               │             │    ┌─▼──────────┐
               │             │    │ User Fixes │
               │             │    │ Form       │
               │             │    └─┬──────────┘
               │             │      │
               │             └──────┘
               │             (loops back)
               │
        ┌──────▼────────┐
        │ API Call      │
        │ POST/PUT      │
        │ /questionnaires
        └──────┬─────────┘
               │
        ┌──────▼────────────┐
        │ Response          │
        │ Saved to Database │
        └──────┬─────────────┘
               │
        ┌──────▼────────┐
        │ Redux Dispatch│
        │ Store Data    │
        └──────┬────────┘
               │
        ┌──────▼────────┐
        │ Navigate to   │
        │ /profile      │
        │ (1 sec delay) │
        └───────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Redux Store                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ user                                                     │   │
│  │ ├─ profile: { id, email, firstName, ... }              │   │
│  │ ├─ questionnaire: { id, userId, personality, ... }    │   │
│  │ ├─ isLoading: boolean                                  │   │
│  │ ├─ error: string | null                                │   │
│  │ └─ isAuthenticated: boolean                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│         ▲                                 ▲                      │
│         │                                 │                      │
│    Dispatch                           useSelector               │
│    Actions                            Hooks                     │
│         │                                 │                      │
└─────────┼─────────────────────────────────┼──────────────────────┘
          │                                 │
          │                                 │
    ┌─────┴──────────────────┐   ┌─────────┴──────────────┐
    │   Questionnaire.js      │   │  Questionnaire.js      │
    │   Component             │   │  Component             │
    │                         │   │                        │
    │ Actions Dispatched:     │   │ Selectors Used:        │
    │ • setUserQuestionnaire()│   │ • selectUserProfile    │
    │ • setLoading(true)      │   │ • selectUserQuestionnaire
    │ • setError(message)     │   │ • selectIsUserLoading  │
    │                         │   │ • selectUserError      │
    └─────────────────────────┘   └────────────────────────┘
          │                                 ▲
          │                                 │
          │                    useEffect Hook
          │                    - Fetch data on mount
          │                    - Populate form
          │                    - Load initial state
          │
    handleChange()
    Updates formData state
    (local component state)
          │
    handleSubmit()
    Validates & calls API
          │
    API Response
    Dispatch to Redux
```

## API Data Flow

```
┌────────────────────────────────┐
│   React Frontend               │
│   (Questionnaire Component)    │
└────────────┬───────────────────┘
             │
        ┌────▼─────┐
        │  FormData │ ← Local component state
        │  object   │
        └────┬─────┘
             │
     ┌───────▼──────────┐
     │  Validation      │
     │  Check All Rules │
     └───────┬──────────┘
             │
     ┌───────▼──────────────────────┐
     │  fetchAPI()                  │
     │  serializes to JSON          │
     └───────┬──────────────────────┘
             │
    ┌────────▼────────────────────────────┐
    │  HTTP Request                      │
    │  Method: POST (new) or PUT (update)│
    │  URL: /questionnaires or /:id      │
    │  Body: JSON questionnaire data     │
    └────────┬─────────────────────────┘
             │
    ┌────────▼────────────────────────┐
    │  Express Backend                │
    │  /routes/questionnaires.js      │
    └────────┬───────────────────────┘
             │
    ┌────────▼────────────────────────┐
    │  Sequelize Model                │
    │  Questionnaire.create()         │
    │  or                             │
    │  Questionnaire.update()         │
    └────────┬───────────────────────┘
             │
    ┌────────▼────────────────────────┐
    │  SQLite Database                │
    │  INSERT or UPDATE statement     │
    │  (/backend/dating_app.db)      │
    └────────┬───────────────────────┘
             │
    ┌────────▼────────────────────────┐
    │  HTTP Response                  │
    │  Status: 201 (create)           │
    │  Status: 200 (update)           │
    │  Body: Full questionnaire JSON  │
    └────────┬───────────────────────┘
             │
    ┌────────▼─────────────────────────┐
    │  Redux Dispatch                 │
    │  setUserQuestionnaire(response)  │
    │  Update Redux store             │
    └────────┬─────────────────────────┘
             │
    ┌────────▼──────────────────┐
    │  Component Re-render      │
    │  Display saved data       │
    │  Switch to View Mode      │
    └────────┬──────────────────┘
             │
    ┌────────▼──────────────────┐
    │  Navigate to /profile     │
    │  (setTimeout 1 second)    │
    └───────────────────────────┘
```

## Form Validation Logic

```
User Submits Form
       │
       ▼
┌──────────────────────────────────┐
│  Validate All Fields             │
└──────┬──────────────────────────┘
       │
   ┌───┴─────────────────────────────────────────┐
   │                                               │
   ▼                                               ▼
Check Email              Check Name
│                         │
├─ Not empty?             ├─ First name provided?
├─ Valid format?          ├─ Last name provided?
│                         │
▼                         ▼
   │                     │
   │                     │
   └──────────┬──────────┘
              │
              ▼
      Check Personality Type
      │
      ├─ Option selected?
      │
      ▼
      Check Dating Goal
      │
      ├─ Option selected?
      │
      ▼
      Check Relationship Type
      │
      ├─ Option selected?
      │
      ▼
      Check Interests
      │
      ├─ At least 3 selected?
      ├─ If <3: ERROR "Choose at least 3 interests"
      │
      ▼
      Check Text Fields (3x)
      │
      ├─ Not empty?
      ├─ Not just whitespace?
      ├─ If empty: ERROR for each field
      │
      ▼
┌──────────────────────────┐
│  All Checks Passed?      │
└────┬────────────┬────────┘
     │            │
  ✓ YES        ✗ NO
     │            │
     │     ┌──────▼──────────┐
     │     │ Display All     │
     │     │ Error Messages  │
     │     │ In Red Text     │
     │     └──────┬──────────┘
     │            │
     │     ┌──────▼──────────┐
     │     │ Disable Submit  │
     │     │ Button          │
     │     └──────┬──────────┘
     │            │
     │     ┌──────▼──────────┐
     │     │ Wait for User   │
     │     │ to Fix Form     │
     │     └──────┬──────────┘
     │            │
     │            └─→ User Starts Typing
     │                │
     │            ┌───▼────────────┐
     │            │ Clear Error on │
     │            │ That Field     │
     │            │ (Real-time)    │
     │            └────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Enable Submit Button     │
│ Proceed with API Call    │
└──────────────────────────┘
```

## Responsive Breakpoints

```
DESKTOP (>1024px)                 TABLET (600-1024px)              MOBILE (<600px)
┌─────────────────────┐            ┌──────────────────┐           ┌────────────┐
│ "Your Questionnaire"│            │"Your Questionnaire│          │"Complete   │
│         [Edit]      │            │        [Edit]    │          │Questionnaire
├─────────────────────┤            ├──────────────────┤          ├────────────┤
│                     │            │                  │          │            │
│ Question 1 - Select │            │ Question 1 ...   │          │ Question 1 │
│ [Dropdown.......]   │            │ [Dropdown...]    │          │ [Dropdown] │
│                     │            │                  │          │            │
│ Question 4 - Checkbox (2 cols)   │ Checkbox (2cols) │          │ Checkbox   │
│ ☐Travel  ☐Fitness  │            │ ☐Travel ☐Fitness│          │ (1 column) │
│ ☐Art&Mus ☐Reading  │            │ ☐Art    ☐Reading│          │ ☐ Travel   │
│ ☐Outdoor ☐Movies   │            │ ☐Outdoor ☐Movies│          │ ☐ Fitness  │
│ Selected: 4/12      │            │ Selected: 4/12   │          │ ☐ Art&Mus  │
│                     │            │                  │          │ ☐ Reading  │
│ Question 5 - Text   │            │ Question 5 - Text│          │ ☐ Outdoor  │
│ [TextArea........]  │            │ [TextArea....]   │          │ ☐ Movies   │
│ [...............]   │            │ [.............]  │          │ [TextArea] │
│                     │            │                  │          │ [.......]  │
│ [Submit]  [Cancel]  │            │ [Submit][Cancel] │          │ [Submit]   │
│                     │            │                  │          │ [Cancel]   │
└─────────────────────┘            └──────────────────┘          └────────────┘
```

## Error Handling Flow

```
API Call or Validation Error
       │
   ┌───▼──────────────────┐
   │ Error Type?          │
   └───┬─────────────────┬┘
       │                 │
Validation Error      API Error
       │                 │
       ▼                 ▼
┌─────────────────┐ ┌──────────────┐
│ setFormErrors   │ │ dispatch     │
│ object with     │ │ setError()   │
│ field:message   │ │ redux action │
└────────┬────────┘ └────────┬─────┘
         │                   │
    ┌────▼─────────────────┬─▼──┐
    │ Render Error Display │   │
    └────┬─────────────────┼──┬┘
         │                 │  │
    ┌────▼──────────┐   ┌──▼─▼────────┐
    │ Red text      │   │ Error banner │
    │ under each    │   │ at top of    │
    │ field         │   │ form with    │
    │               │   │ message      │
    │ "Email invalid"   │ "Failed to   │
    │ "Name required"   │ save data"   │
    └────┬──────────┘   └──┬───────────┘
         │                 │
    ┌────▼─────────────────▼──┐
    │ User Sees What's Wrong   │
    │ Can Take Action          │
    └────┬──────────────────────┘
         │
    ┌────▼─────────────────────────┐
    │ User Fixes Field Value       │
    │ Starts Typing in Error Field │
    └────┬──────────────────────────┘
         │
    ┌────▼─────────────────────────┐
    │ Error Clears in Real-time    │
    │ (formErrors state updated)   │
    │ No page refresh needed       │
    └────┬──────────────────────────┘
         │
    ┌────▼─────────────────────────┐
    │ User Can Submit Again        │
    │ Submit button re-enabled     │
    └──────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────┐
│          Questionnaires Table               │
├─────────────────────────────────────────────┤
│ Field              │ Type      │ Required   │
├────────────────────┼───────────┼────────────┤
│ id                 │ INTEGER   │ PK         │
│ userId             │ INTEGER   │ FK, UNIQUE │
│ personalityType    │ STRING    │ YES        │
│ interests          │ JSON[]    │ YES        │
│ datingGoal         │ STRING    │ YES        │
│ relationshipType   │ STRING    │ YES        │
│ responses          │ JSON{}    │ YES        │
│   - idealDate      │ STRING    │            │
│   - fiveYearGoal   │ STRING    │            │
│   - aboutYou       │ STRING    │            │
│ createdAt          │ TIMESTAMP │ Auto       │
│ updatedAt          │ TIMESTAMP │ Auto       │
└─────────────────────────────────────────────┘
         │
         └──→ Each user has ONE questionnaire
              (enforced by UNIQUE userId)
```

---

**Visual Guide Generated**: 2025-11-20
**Questionnaire Feature**: Complete and Ready for Testing
