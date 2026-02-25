import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Questionnaire from '../pages/Questionnaire';
import QuestionnairePage from '../pages/QuestionnairePage';
import Profile from '../pages/Profile';
import Preferences from '../pages/Preferences';
import Discovery from '../pages/Discovery';
import Matches from '../pages/Matches';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Route definitions for the application
 * Using React Router v6 with createBrowserRouter
 */
export const routes = createBrowserRouter([
  // Auth routes (no layout)
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },

  // Protected routes with layout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'questionnaire/:type',
        element: <QuestionnairePage />,
      },
      {
        path: 'questionnaire',
        element: <Navigate to="/questionnaire/MVP" replace />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'profile/edit',
        element: <Profile />,
      },
      {
        path: 'preferences',
        element: <Preferences />,
      },
      {
        path: 'discover',
        element: <Discovery />,
      },
      {
        path: 'matches',
        element: <Matches />,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
  },
});

export default routes;
