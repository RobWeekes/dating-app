# Frontend Routes

This document summarizes all routes available in the dating app frontend.

## Route Structure

The frontend uses React Router v6 with nested routes. All routes render within the persistent `Layout` component which provides the navbar and navigation.

## Available Routes

### Home

- **Path:** `/`
- **Component:** `Home`
- **Purpose:** Landing page with navigation links to other sections
- **Navbar Link:** "Home"

### Questionnaire

- **Path:** `/questionnaire`
- **Component:** `Questionnaire`
- **Purpose:** User fills out dating questionnaire (personality type, interests, dating goals, relationship type)
- **Navbar Link:** "Questionnaire"

### Profile

- **Path:** `/profile`
- **Component:** `Profile`
- **Purpose:** View user profile information
- **Navbar Link:** "Profile"

### Profile Edit

- **Path:** `/profile/edit`
- **Component:** `Profile` (same component handles both view and edit)
- **Purpose:** Edit user profile details (email, first name, last name, age, bio, location, photo)
- **Access:** Via edit button on profile page or direct URL

### Preferences

- **Path:** `/preferences`
- **Component:** `Preferences`
- **Purpose:** Set dating preferences (age range, location, interests, relationship type)
- **Navbar Link:** "Preferences"

## Layout Structure

The `Layout` component is the root element for all routes and includes:

- **Navbar** with app branding (💕 Dating App)
- **Navigation Menu** with links to Home, Questionnaire, Profile, and Preferences
- **Outlet** where child route components render

## Navigation

Navigation between routes uses React Router's `Link` component from `react-router-dom`, ensuring no full page reloads and smooth transitions.

## API Integration

All route components connect to the backend API through:

- Redux actions for state management
- API service layer (`frontend/src/services/api.js`) for HTTP requests
- Proxy configuration (`http://localhost:3001`) for API requests

## Route Handlers Features

All API route handlers include:

- ✓ Proper error handling with try-catch blocks and status codes
- ✓ Validation of required fields before processing
- ✓ Unique constraint checking (emails, one questionnaire/preference per user)
- ✓ Foreign key relationships with cascading deletes
- ✓ HTTP status codes (201 for creation, 404 for not found, 409 for conflicts, 500 for errors)
- ✓ Sequelize ORM queries with proper includes for related data
- ✓ Consistent JSON response format with error messages
- ✓ Support for partial updates (PUT requests handle optional fields)
- ✓ Query parameter support for filtering by user ID
