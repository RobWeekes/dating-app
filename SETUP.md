# Project Setup Guide

## Frontend Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Update `.env` with your local configuration if needed.

### Running the Application

Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/          # Reusable React components
├── pages/               # Page-level components
├── redux/               # Redux state management
│   ├── slices/         # Redux Toolkit slices
│   ├── store.js        # Redux store configuration
│   └── selectors.js    # Memoized selectors
├── routes/             # Route definitions
├── services/           # API services
├── utils/              # Utility functions
├── styles/             # CSS files
├── constants/          # Application constants
├── App.js              # Main App component
└── index.js            # Entry point

server/                 # Backend Node/Express server
├── config/             # Database configuration
├── models/             # Sequelize models
├── migrations/         # Database migrations
├── seeders/            # Database seeders
├── routes/             # API routes
├── controllers/        # Route handlers
└── middleware/         # Express middleware
```

## Redux State Structure

The application uses Redux with the following slices:

### User Slice

- `profile`: User profile information
- `questionnaire`: User's questionnaire responses
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `error`: Error messages

### Preferences Slice

- `ageRange`: Min and max age preferences
- `location`: Location preference
- `interests`: Array of interest tags
- `isLoading`: Loading state
- `error`: Error messages

### UI Slice

- `currentPage`: Current page/view
- `isModalOpen`: Modal visibility state
- `modalType`: Type of modal shown
- `notification`: Notification message and type
- `sidebarOpen`: Sidebar visibility
- `isLoading`: Loading state

## Styles

Global styles are in `src/styles/global.css`. The styling uses CSS custom properties (variables) for theming:

- Primary color: `--primary-color` (#ff6b6b)
- Secondary color: `--secondary-color` (#4ecdc4)
- Mobile-first responsive design with breakpoints at 600px and 1024px

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## Next Steps

1. Install backend dependencies and set up database
2. Create Sequelize models and migrations
3. Set up Express API routes
4. Implement page components with forms
5. Connect Redux actions to API calls

## Documentation

Refer to `.copilot-instructions.md` for detailed development guidelines including:

- Redux patterns
- Component best practices
- Mobile responsiveness guidelines
- Database management with Sequelize
