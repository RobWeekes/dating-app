# Directory Summary

✅ Frontend folders: components/, pages/, redux/, routes/, services/, utils/, styles/, constants/
✅ Backend folders: config, models, migrations, seeders, routes, controllers, middleware

Redux Configuration

3 Redux Slices with actions and reducers:
userSlice.js - Profile, questionnaire, authentication
preferencesSlice.js - Age range, location, interests
uiSlice.js - Current page, modals, notifications
Redux Store - Configured with Redux Toolkit
Memoized Selectors - Using createSelector for optimized state access

Utilities & Services

validation.js - Email, age, date validation functions
api.js - Generic API fetch wrapper with endpoints for user profile, preferences, questionnaire

Components (Reusable building blocks)

Layout.js - Main layout wrapper
Button.js - Reusable button component
FormInput.js - Form input wrapper
Notification.js - Connected notification display

Pages (Scaffolded)

Home.js - Landing page
Questionnaire.js - Questionnaire page
Profile.js - User profile page
Preferences.js - Dating preferences page

Configuration Files

index.js - API endpoints, page names, validation messages
.env.example - Environment variables template
global.css - Mobile-first responsive styles with CSS variables
SETUP.md - Project setup and structure documentation

Updates to Existing Files

✅ index.js - Integrated Redux Provider
✅ App.js - Simplified to basic structure

# Directory Structure

```
dating-app/
├── frontend/              # React frontend application
├── backend/               # Node/Express backend server
├── .copilot-instructions.md
├── SETUP.md
├── DIRECTORY_STRUCTURE.md (this file)
├── package.json
└── README.md
```

## Frontend Directory

```
frontend/
├── public/
│   ├── index.html        # Main HTML entry point
│   ├── manifest.json     # PWA manifest
│   └── robots.txt        # SEO robots file
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Layout.js
│   │   ├── Button.js
│   │   ├── FormInput.js
│   │   └── Notification.js
│   ├── pages/            # Page-level components
│   │   ├── Home.js
│   │   ├── Questionnaire.js
│   │   ├── Profile.js
│   │   └── Preferences.js
│   ├── redux/            # Redux state management
│   │   ├── slices/       # Redux Toolkit slices
│   │   │   ├── userSlice.js
│   │   │   ├── preferencesSlice.js
│   │   │   └── uiSlice.js
│   │   ├── store.js      # Redux store configuration
│   │   └── selectors.js  # Memoized selectors
│   ├── routes/           # Route definitions
│   │   └── index.js
│   ├── services/         # API services and calls
│   │   └── api.js
│   ├── utils/            # Utility functions
│   │   └── validation.js
│   ├── styles/           # Global CSS files
│   │   └── global.css
│   ├── constants/        # Application constants
│   │   └── index.js
│   ├── App.js            # Main App component
│   ├── App.css           # App component styles
│   ├── App.test.js       # App component tests
│   ├── index.js          # React entry point (Redux Provider)
│   ├── index.css         # Global styles
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   └── logo.svg
├── package.json
├── .env.example          # Environment variables template
├── .gitignore
└── README.md
```

## Backend Directory

```
backend/
├── config/
│   └── database.js       # Sequelize connection configuration
├── models/               # Sequelize ORM models
│   ├── User.js
│   ├── Questionnaire.js
│   ├── Preference.js
│   ├── Answer.js
│   └── index.js
├── migrations/           # Database migration files
│   ├── YYYYMMDDHHMMSS-create-user.js
│   ├── YYYYMMDDHHMMSS-create-questionnaire.js
│   └── ...
├── seeders/              # Database seed files
│   ├── YYYYMMDDHHMMSS-seed-demo-users.js
│   ├── YYYYMMDDHHMMSS-seed-questionnaire-templates.js
│   └── ...
├── routes/               # API route handlers
│   ├── users.js
│   ├── questionnaires.js
│   ├── preferences.js
│   └── index.js
├── controllers/          # Route handler logic
│   ├── userController.js
│   ├── questionnaireController.js
│   ├── preferenceController.js
│   └── answerController.js
├── middleware/           # Express middleware
│   ├── errorHandler.js
│   ├── authentication.js
│   └── validation.js
├── server.js             # Main server entry point
├── package.json
├── .env.example          # Environment variables template
├── .sequelizerc           # Sequelize CLI configuration
├── .gitignore
└── README.md
```

## Key Directories Explained

### Frontend Structure

#### `src/components/`

Reusable React components that can be used across different pages. Each component should be:

- Focused on a single responsibility
- Preferably under 300 lines of code
- Exported as a default export

#### `src/pages/`

Page-level components that represent full pages/routes. These typically:

- Use Redux hooks for state
- Compose smaller components
- Handle page-specific logic

#### `src/redux/`

Centralized state management using Redux Toolkit:

- **slices/**: Each slice manages a specific part of state (user, preferences, ui)
- **store.js**: Combines all slices into a single store
- **selectors.js**: Memoized selectors for efficient state access

#### `src/services/`

API communication layer:

- Generic fetch wrapper
- API endpoint functions
- Error handling

#### `src/utils/`

Pure utility functions:

- Validation functions
- Formatting utilities
- Helper functions

#### `src/styles/`

Global and component CSS:

- Mobile-first responsive design
- CSS variables for theming
- Component-specific CSS modules (optional)

#### `src/constants/`

Application-wide constants:

- API endpoints
- Validation messages
- Page names
- Modal types

### Backend Structure

#### `config/`

Configuration files for database connections and environment setup.

#### `models/`

Sequelize model definitions for database tables:

- One model per file
- Associations between models
- Validations at model level

#### `migrations/`

Database migration files for schema management:

- Version-controlled database changes
- Reversible with `down()` methods
- Never modify executed migrations

#### `seeders/`

Database seed files for initial/demo data:

- Development and testing data
- Separate files for different entities
- Run in dependency order

#### `routes/`

API endpoint definitions:

- Group related endpoints
- Use proper HTTP methods
- Use controllers for logic

#### `controllers/`

Business logic for API routes:

- Keep logic out of route files
- One controller per resource type
- Use async/await for database operations

#### `middleware/`

Express middleware functions:

- Error handling
- Authentication
- Request validation
- CORS, logging, etc.

## Naming Conventions

### Files

- Components: `PascalCase.js` (e.g., `UserProfile.js`)
- Utils: `camelCase.js` (e.g., `validation.js`)
- Redux slices: `{name}Slice.js` (e.g., `userSlice.js`)
- Controllers: `{name}Controller.js` (e.g., `userController.js`)

### Directories

- All directories: `lowercase` (e.g., `components`, `services`)

### Import Paths

- Relative paths for same directory siblings
- Absolute paths from `src/` root for cross-directory imports
- Example: `import Layout from 'components/Layout';`

## File Placement Rules

### Where should a new file go?

**Component** → `src/components/` (if reusable) or `src/pages/` (if page-specific)

**Utility Function** → `src/utils/`

**API Call** → `src/services/api.js`

**Redux Logic** → `src/redux/slices/` (new slice) or existing slice

**Constant** → `src/constants/index.js`

**Page** → `src/pages/`

**Backend Model** → `backend/models/`

**Database Migration** → `backend/migrations/` (auto-generated)

**Database Seeder** → `backend/seeders/` (auto-generated)

**API Route** → `backend/routes/`

**API Logic** → `backend/controllers/`

**Middleware** → `backend/middleware/`

## Best Practices

1. **Keep it DRY**: Extract reusable code into utilities or shared components
2. **Single Responsibility**: Each file/component should have one clear purpose
3. **Organize by Feature**: Group related code together (routes, controllers, models)
4. **Use Descriptive Names**: File names should clearly describe their purpose
5. **Follow Conventions**: Stick to naming conventions defined in `.copilot-instructions.md`
6. **Environment Variables**: Use `.env` files for configuration, never hardcode secrets
7. **Documentation**: Add JSDoc comments to complex functions and components

## Development Tips

- Keep migrations and seeders in version control
- Never run migrations on production without testing
- Use Redux selectors consistently throughout components
- Keep components under 300 lines of code
- Test on mobile and desktop regularly
- Refer to `.copilot-instructions.md` for detailed guidelines
