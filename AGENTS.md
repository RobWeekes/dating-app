# Dating App Development Guidelines

## Project Overview

A responsive React-based dating application that allows users to:

- Fill out personality and dating-related questionnaires
- Edit their own profile details
- Manage and edit their dating preferences
- Find compatible matches based on questionnaire responses and automated scoring services

## Technology Stack

- **Frontend Framework**: React 19.x
- **State Management**: Redux Toolkit
- **Language**: JavaScript (ES6+) - NO TypeScript
- **Styling**: CSS (mobile-first responsive design)
- **Testing**: Jest & React Testing Library
- **Build Tool**: Vite or Create React App (react-scripts)
- **Backend Database**: Sequelize ORM with PostgreSQL/MySQL
- **API**: REST API (Express.js recommended)

# Directory Structure

dating-app/
├── frontend/ # React frontend application
├── backend/ # Node/Express backend server
├── AGENTS.md
├── SETUP.md
├── package.json
└── README.md

Ignore other markdown files in root, some are obsolete

## Frontend Directory
note file structure

## Backend Directory
note file structure

## Important Notes

- Use **JavaScript only** - no TypeScript
- Maintain scalability in folder structure
- Keep Redux slice logic focused and DRY
- Test responsiveness during development
- Follow single responsibility principle (SRP)

## Core Principles

### 1. DRY (Don't Repeat Yourself)

- Extract common functionality into reusable components and utilities
- Use Redux slices to centralize state logic
- Create custom hooks for repeated logic patterns
- Implement shared selectors for state access

### 2. KISS (Keep It Simple, Stupid)

- Keep components focused on a single responsibility
- Avoid prop drilling - use Redux for global state
- Use simple, readable variable and function names
- Prefer straightforward solutions over complex abstractions

### 3. Best Practices

- Implement solutions with scalability efficiency for tens of millions of users
- Use functional components with hooks exclusively
- Implement proper error handling and loading states
- Follow React naming conventions (PascalCase for components)
- Use meaningful commit messages
- Write self-documenting code with clear intent
- Write markdown documents only when requested

## Redux State Management Structure

### Slices to Create:

1. **userSlice** - User authentication, profile data (name, age, bio, photos, etc.)
2. **questionnaireSlice** - User's questionnaire responses (personality, dating goals, interests)
3. **preferencesSlice** - Dating preferences (age range, location, interests filters)
4. **uiSlice** - UI state (loading, modals, notifications, current page)
5. **matchesSlice** - Matched profiles and match interactions (optional for future)

### State Organization:

```javascript
{
  user: {
    id: string,
    profile: { name, age, bio, photos, location, ... },
    questionnaire: { responses: {...} },
    isLoading: boolean,
    error: string | null
  },
  preferences: {
    ageRange: { min, max },
    location: string,
    interests: string[],
    isLoading: boolean,
    error: string | null
  },
  ui: {
    currentPage: string,
    isModalOpen: boolean,
    notification: { type, message } | null,
    isLoading: boolean
  }
}
````

## Routing Structure

- `/` - Home/Dashboard
- `/questionnaire` - Personality & dating questionnaire
- `/profile` - User profile view and edit
- `/profile/edit` - Edit profile details
- `/preferences` - Edit dating preferences
- `/settings` - App settings (future)
- `/matches` - Matched profiles (future)

## Component Guidelines

### Component Size

- Keep components under 300 lines of code
- Extract smaller sub-components when it makes sense
- Use composition over inheritance

### Props Pattern

- Prefer Redux hooks (`useSelector`, `useDispatch`) over props for global state
- Use props only for component-specific configuration
- Destructure props for clarity

### Hooks

- Use built-in hooks: `useState`, `useEffect`, `useCallback`, `useMemo`
- Create custom hooks for repeated logic (e.g., `useFormState`, `useFetch`)
- Place hooks at the top level of functional components

## Code Style Guidelines

### Naming Conventions

- Components: `PascalCase` (e.g., `UserProfile`, `QuestionnaireForm`)
- Functions/Variables: `camelCase` (e.g., `getUserData`, `isValid`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_AGE_RANGE`, `API_BASE_URL`)
- Redux slices: `camelCase` action names (e.g., `setUserProfile`, `updatePreferences`)

### File Naming

- Components: Match component name (e.g., `UserProfile.js`)
- Redux slices: `{name}Slice.js` (e.g., `userSlice.js`)
- Utilities: Descriptive names (e.g., `dateValidation.js`, `formHelpers.js`)

### Formatting

- Use 2-space indentation
- Use meaningful variable names - avoid abbreviations unless standard
- Add JSDoc comments for complex functions
- Prefer const over let, avoid var

## Redux Patterns to Follow

### Action Creators

- Use Redux Toolkit's `createSlice` (actions auto-generated)
- Keep logic simple in reducers
- Complex async logic belongs in thunks

### Selectors

- Create memoized selectors in `selectors.js` using `createSelector`
- Use selectors consistently throughout the app
- Never access state directly in components outside of hooks

### Example Pattern:

```javascript
// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUserProfile, setLoading } = userSlice.actions;
export default userSlice.reducer;
```

## Database Management with Sequelize

### Setup & Configuration

- **ORM**: Sequelize for database abstraction
- **Database**: PostgreSQL or MySQL (recommended: PostgreSQL)
- **Config File**: `server/config/database.js` - Contains database connection settings
- **Environment Variables**: Use `.env` file for database credentials

### Migration Strategy

#### Creating Migrations

- Use `npx sequelize-cli migration:generate --name=<migration-name>`
- Naming convention: `YYYYMMDDHHMMSS-<description>` (auto-generated by Sequelize)
- Example: `20250115120000-create-user.js`
- Include both `up()` (apply changes) and `down()` (revert changes) methods
- Ensure migrations are idempotent and reversible

#### Migration Files

- Path: `server/migrations/`
- Create a new migration file for each model in the proper sequence
- Edit existing migration files for small changes, instead of adding new migrations (development mode)
- Always test `up()` and `down()` migrations locally

#### Common Migration Format Example (shortened)

```javascript
// Migration: Create Users table
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
```

### Seeding Strategy

#### Creating Seed Files

- Use `npx sequelize-cli seed:generate --name=<seed-name>`
- Naming convention: Similar to migrations with descriptive names
- Example: `20250115120000-seed-demo-users.js`
- Location: `server/seeders/`

#### Seed File Format Example (shortened)

```javascript
// Seeder: Initial demo user data
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        email: "user1@example.com",
        firstName: "John",
        lastName: "Doe",
        age: 28,
        bio: "Adventure enthusiast and coffee lover",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
```

#### Seed Management Best Practices

- Use seeders for development/testing data only
- Create separate seed files for different entities (users, preferences, questionnaires)
- Include realistic sample data that covers edge cases
- Run seeders in logical order (dependencies first)
- Use `npx sequelize-cli db:seed:all` to run all seeders
- Use `npx sequelize-cli db:seed:undo:all` to rollback all seeders

### Sequelize Models

#### Model Definition Principles

- Define models in `server/models/`
- One model per file (e.g., `User.js`, `Questionnaire.js`)
- File naming: PascalCase matching model name
- Use descriptive field names and data types
- Include validations at model level
- Define associations (relationships) between models

#### Core Models

**User** - Profile information (email, name, age, bio, photos, location, etc.)
**Questionnaire** - various personality & dating questionnaires (links to User, 1-to-many: 1 user, many questionnaires)
**Question** - questionnaire questions (links to Questionnaire, 1-to-many: 1 questionnaire, many questions)
**Answer** - Individual questionnaire answers (links to Questionnaire, 1-to-many: 1 questionnaire, many answers)
**Preference** - User's dating preferences (age range, interests, location range, etc. 1-to-1)

### Database Workflow

#### Adding & Updating Features

Maintain and edit 1 migration file for each schema column.
How to run migration: `npx sequelize-cli db:migrate`
How to run seeder: `npx sequelize-cli db:seed:all` or target specific seeder

#### Reverting Changes

- Undo last migration: `npx sequelize-cli db:migrate:undo`
- Undo all migrations: `npx sequelize-cli db:migrate:undo:all`
- Undo all seeders: `npx sequelize-cli db:seed:undo:all`

## Mobile Responsiveness

### Breakpoints

- Mobile: < 600px
- Tablet: 600px - 1024px
- Desktop: > 1024px

### Mobile-First Approach

- Write styles for mobile first
- Use CSS media queries for larger screens
- Test on multiple devices

### CSS Modules

- Use CSS Modules for component-specific styles
- Name: `ComponentName.module.css`
- Keeps styles scoped and prevents conflicts

## Testing Guidelines

- Write tests for utility functions and custom hooks
- Test Redux slices and selectors
- Use React Testing Library for component tests
- Aim for meaningful tests, not 100% coverage

## Performance Optimization

- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references in dependencies
- Lazy load pages with React.lazy() and Suspense
- Memoize selectors with `createSelector`
- Avoid unnecessary re-renders with proper hook dependencies
