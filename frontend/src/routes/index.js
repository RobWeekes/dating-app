import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Questionnaires from '../pages/Questionnaires';
import QuestionnairePage from '../pages/QuestionnairePage';
import Profile from '../pages/Profile';
import Preferences from '../pages/Preferences';
import Discovery from '../pages/Discovery';
import Matches from '../pages/Matches';
import UnderConstruction from '../pages/UnderConstruction';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Route definitions for the application
 * Using React Router v6 with createBrowserRouter
 */
export const routes = createBrowserRouter([
  // Public routes with layout (includes header)
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'under-construction',
        element: <UnderConstruction />,
      },
      // Protected routes
      {
        path: 'questionnaires',
        element: (
          <ProtectedRoute>
            <Questionnaires />
          </ProtectedRoute>
        ),
      },
      {
        path: 'questionnaire/:type',
        element: (
          <ProtectedRoute>
            <QuestionnairePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/edit',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'preferences',
        element: (
          <ProtectedRoute>
            <Preferences />
          </ProtectedRoute>
        ),
      },
      {
        path: 'discovery',
        element: (
          <ProtectedRoute>
            <Discovery />
          </ProtectedRoute>
        ),
      },
      {
        path: 'discover',
        element: (
          <ProtectedRoute>
            <Discovery />
          </ProtectedRoute>
        ),
      },
      {
        path: 'matches',
        element: (
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Auth routes (no layout)
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
], {
  future: {
    v7_startTransition: true,
  },
});

export default routes;
