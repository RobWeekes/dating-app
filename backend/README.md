# Dating App Backend

Backend API for the Dating App built with Express.js and Sequelize ORM.

## Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL (or MySQL)
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

3. Update `.env` with your database credentials

### Database Setup

Create migrations:

```bash
npm run migrate
```

Seed initial data:

```bash
npm run seed
```

### Running the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will be available at `http://localhost:3001/api`

## Database Models

- **User** - User profile information
- **Questionnaire** - User's personality and dating questionnaire responses
- **Preference** - User's dating preferences and match filters
- **Answer** - Individual questionnaire question responses

## API Routes

Routes will be added to the `routes/` folder following REST conventions:

- `/api/users` - User management
- `/api/questionnaires` - Questionnaire endpoints
- `/api/preferences` - Preferences endpoints

## Development Commands

- `npm run dev` - Start development server with hot-reload
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run migrate:undo:all` - Undo all migrations
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo all seeders
- `npm test` - Run tests

## Documentation

Refer to `AGENTS.md` in the root directory for detailed development guidelines.
