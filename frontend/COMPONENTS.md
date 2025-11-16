# Frontend Components

This document provides detailed information about all frontend components in the dating app, with a focus on the Profile Edit feature implementation.

## Summary

1. Updated Profile.js - Full-featured profile component with:

   - View Mode: Displays user profile information with Edit button
   - Edit Mode: Form for updating all profile fields
   - Form validation (email format, age range 18-120, required fields)
   - Redux integration for state management
   - Error handling and loading states
   - Cancel button that resets form or navigates back
   - Dynamic routing between view and edit modes

2. FormInput.js -

   - Textarea for bio field
   - Error display and styling
   - Required field indicators
   - Min/max attributes for number inputs

3. Created profile.css - Styling with:
   - Profile view card layout with photo
   - Profile edit form with proper spacing
   - Error messages and validation feedback
   - Button styles (primary and secondary)
   - Mobile-first responsive design
   - 3 breakpoints: mobile (<600px), tablet (601-1024px), desktop (>1024px)

## Component Architecture

The frontend follows a component-based architecture with reusable components, page components, and layout components.

---

## Core Components

### Layout Component

**File:** `frontend/src/components/Layout.js`

The root layout component that wraps all pages and provides:

- Persistent navbar with app branding (💕 Dating App)
- Navigation menu with links to all routes
- React Router Outlet for nested route rendering
- Responsive design that adapts to mobile and desktop

---

### Button Component

**File:** `frontend/src/components/Button.js`

Reusable button component with:

- Support for `className`, `onClick`, `disabled`, `type` props
- Primary and secondary styling variants
- Loading states for async operations
- Keyboard accessibility

---

### FormInput Component

**File:** `frontend/src/components/FormInput.js`

Enhanced form input wrapper supporting:

- **Input Types**: text, email, password, number, url, textarea
- **Features**:
  - Error display and styling
  - Required field indicators (red asterisk)
  - Min/max attributes for number inputs
  - Placeholder support
  - Real-time validation feedback
- **Error Styling**: Red border and background highlight on validation errors
- **Textarea Support**: For multi-line fields like bio with configurable rows

**Props:**

```javascript
{
  label: string,              // Form field label
  name: string,               // Input name for form data
  type: string,               // Input type (default: 'text')
  value: string,              // Current input value
  onChange: function,         // Change handler
  placeholder: string,        // Placeholder text
  required: boolean,          // Show required indicator
  error: string,              // Error message to display
  min: number,                // Min value/length
  max: number                 // Max value/length
}
```

---

### Notification Component

**File:** `frontend/src/components/Notification.js`

Redux-connected notification display component for:

- Success messages
- Error alerts
- Info notifications
- Dismissible notifications

---

## Page Components

### Profile Page (Fully Implemented)

**File:** `frontend/src/pages/Profile.js`

Complete profile management feature with dual modes:

#### View Mode (`/profile`)

Displays user profile information:

- Profile photo (circular with border)
- User details (email, name, age, location, bio)
- Edit button to switch to edit mode
- Responsive grid layout for profile info

#### Edit Mode (`/profile/edit`)

Interactive form for updating profile:

- Email field with format validation
- First name and last name fields
- Age field with range validation (18-120)
- Location field
- Bio textarea
- Profile photo URL field
- Save and Cancel buttons

**Features:**

- **Form Validation**:
  - Email format validation
  - Required field checking
  - Age range validation (18-120)
  - Real-time error clearing on field changes
- **Redux Integration**:

  - `useSelector` to access user profile from Redux
  - `useDispatch` to update Redux store
  - Selectors: `selectUserProfile`, `selectUserLoading`, `selectUserError`
  - Actions: `setUserProfile`, `setLoading`, `setError`

- **State Management**:

  - Form data state for edit mode
  - Form errors state for validation
  - Submission state for loading indicators
  - Auto-initialization from Redux store

- **API Integration**:

  - Calls `updateUserProfile(userId, profileData)` on form submit
  - Handles API errors gracefully
  - Updates Redux store on successful update

- **Navigation**:

  - Route detection using `window.location.pathname`
  - Smooth transitions between view/edit modes
  - Cancel button navigates back to view mode

- **User Experience**:
  - Disabled buttons during submission
  - Loading indicators ("Saving...")
  - Error message display
  - Form reset on cancel
  - Responsive mobile layout

---

### Home Page

**File:** `frontend/src/pages/Home.js`

Landing page with:

- Navigation links to other sections
- App introduction and welcome message
- Call-to-action buttons

---

### Questionnaire Page

**File:** `frontend/src/pages/Questionnaire.js`

Placeholder for questionnaire feature:

- Personality type selection
- Interests selection
- Dating goals
- Relationship type preferences

---

### Preferences Page

**File:** `frontend/src/pages/Preferences.js`

Placeholder for user preferences feature:

- Age range selection
- Location and radius
- Interests filtering
- Relationship type preferences

---

## Styling

### Profile-Specific Styles

**File:** `frontend/src/styles/profile.css`

Complete styling for profile components:

#### Profile View Mode

- Card-based layout with shadow
- Circular profile photo with border
- Responsive grid for info groups
- Label styling with primary color
- Proper spacing and typography

#### Profile Edit Mode

- Form container with padding
- Input field styling with focus states
- Textarea with resizable height
- Error highlighting (red border)
- Error text display below fields
- Action buttons (Save/Cancel)

#### Responsive Breakpoints

- **Mobile** (<600px): Single column layout, full-width buttons, smaller spacing
- **Tablet** (601-1024px): Two-column grid for profile info
- **Desktop** (>1024px): Multi-column layout with max-width constraint

#### Button Styles

- **Primary Button**: Teal (#ff6b6b) with hover effects
- **Secondary Button**: Cyan (#4ecdc4) with hover effects
- Disabled state with reduced opacity
- Transition effects on hover

---

## Backend Integration

### Summary

1. API Service (api.js):

   - getUserProfile(userId) - Fetch user profile
   - updateUserProfile(userId, profileData) - Update profile via PUT request
   - Corrected endpoints to match actual routes

2. Backend Routes (routes/users.js):
   - PUT /api/users/:id - Update user with validation
   - Handles email uniqueness checking
   - All validations and error handling in place

Feature Flow:

1. User clicks "Edit Profile" button on profile view
2. Routes to /profile/edit
3. Form loads with current user data from Redux
4. User edits fields with real-time validation
5. On submit: API call updates backend → Redux state updates → Navigate back to view
6. Profile view displays updated information

### API Service Layer

**File:** `frontend/src/services/api.js`

Centralized API communication with:

#### User Profile Methods

- **`getUserProfile(userId)`**

  - GET `/api/users/:id`
  - Returns complete user profile with related data
  - Includes questionnaire and preference info

- **`updateUserProfile(userId, profileData)`**
  - PUT `/api/users/:id`
  - Updates user with fields: email, firstName, lastName, age, bio, location, profilePhotoUrl
  - Returns updated profile
  - Handles email uniqueness validation
  - Supports partial updates (optional fields)

#### Questionnaire Methods

- **`getUserQuestionnaire(userId)`**

  - GET `/api/questionnaires/user/:userId`
  - Retrieves user's questionnaire with all answers

- **`submitQuestionnaire(questionnaireData)`**
  - POST `/api/questionnaires`
  - Creates new questionnaire with userId, personalityType, interests, datingGoal, responses

#### Preferences Methods

- **`getUserPreferences(userId)`**

  - GET `/api/preferences/user/:userId`
  - Retrieves user's dating preferences

- **`updateUserPreferences(userId, preferencesData)`**
  - PUT `/api/preferences/user/:userId`
  - Updates preferences with minAge, maxAge, location, locationRadius, interests, relationshipType

#### Generic Fetch Wrapper

- **`fetchAPI(endpoint, options)`**
  - Centralized error handling
  - Automatic JSON parsing
  - Request/response logging
  - Supports all HTTP methods (GET, POST, PUT, DELETE)

---

## Backend Routes (Supporting Components)

### User Routes

**File:** `backend/routes/users.js`

CRUD operations for users:

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID with relationships
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user
- Email uniqueness validation
- Includes questionnaire and preference relationships

### Questionnaire Routes

**File:** `backend/routes/questionnaires.js`

Questionnaire management:

- `GET /api/questionnaires` - All questionnaires
- `GET /api/questionnaires/:id` - By ID with answers
- `GET /api/questionnaires/user/:userId` - By user ID
- `POST /api/questionnaires` - Create (one per user)
- `PUT /api/questionnaires/:id` - Update
- `DELETE /api/questionnaires/:id` - Delete
- `POST /api/questionnaires/:id/answers` - Add answers

### Preferences Routes

**File:** `backend/routes/preferences.js`

Preferences management:

- `GET /api/preferences` - All preferences
- `GET /api/preferences/:id` - By ID
- `GET /api/preferences/user/:userId` - By user ID (unique)
- `POST /api/preferences` - Create (one per user)
- `PUT /api/preferences/:id` - Update by ID
- `PUT /api/preferences/user/:userId` - Update by user
- `DELETE /api/preferences/:id` - Delete

---

## Redux Integration

### User Slice

**File:** `frontend/src/redux/slices/userSlice.js`

State management for user profile:

**State Structure:**

```javascript
{
  profile: { id, email, firstName, lastName, age, bio, location, profilePhotoUrl },
  questionnaire: { id, personalityType, interests, datingGoal, responses },
  loading: boolean,
  error: null | string,
  authenticated: boolean
}
```

**Actions:**

- `setUserProfile(profile)` - Update user profile
- `updateUserProfile(updates)` - Partial profile update
- `setUserQuestionnaire(questionnaire)` - Update questionnaire
- `updateUserQuestionnaire(updates)` - Partial questionnaire update
- `setLoading(boolean)` - Toggle loading state
- `setError(string)` - Set error message
- `setAuthenticated(boolean)` - Set authentication state
- `clearUserData()` - Clear all user data on logout

**Selectors:**

```javascript
selectUserProfile(state); // Full user profile
selectUserEmail(state); // User email
selectUserAge(state); // User age
selectUserQuestionnaire(state); // Questionnaire data
selectUserLoading(state); // Loading state
selectUserError(state); // Error message
selectIsAuthenticated(state); // Auth status
```

---

## Component Data Flow

### Profile Edit Feature Flow

1. **Initialization**

   - Component mounts
   - Redux selector retrieves user profile
   - Form state initializes with Redux data

2. **User Interaction**

   - User types in form fields
   - `handleInputChange` updates form state
   - Errors cleared from field on edit

3. **Validation**

   - Form submission triggers `validateForm()`
   - Email regex validation
   - Age range validation (18-120)
   - Required field checking
   - Errors displayed below fields

4. **API Call**

   - Valid form submitted to `updateUserProfile()`
   - Backend validates email uniqueness
   - Backend updates database

5. **Redux Update**

   - API response dispatches `setUserProfile()`
   - Redux store updates with new data
   - Component re-renders with new data

6. **Navigation**
   - Component navigates to `/profile` (view mode)
   - Profile view displays updated information

---

## Best Practices Implemented

✓ **Component Reusability**: FormInput, Button, and Notification are generic and reusable
✓ **Separation of Concerns**: Separate components, services, Redux slices
✓ **Error Handling**: Try-catch blocks, error states, user-friendly messages
✓ **Form Validation**: Client-side validation with server-side backup
✓ **Loading States**: Disabled buttons and loading indicators during async operations
✓ **Accessibility**: Labels, required indicators, proper semantic HTML
✓ **Responsive Design**: Mobile-first approach with multiple breakpoints
✓ **Redux Integration**: Memoized selectors for performance optimization
✓ **DRY Principle**: No repeated code, centralized API calls
✓ **Type Safety**: Consistent prop passing and data structures
