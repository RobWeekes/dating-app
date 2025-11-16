import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Questionnaire from '../pages/Questionnaire';
import Profile from '../pages/Profile';
import Preferences from '../pages/Preferences';
import Layout from '../components/Layout';

/**
 * Route definitions for the application
 * Using React Router v6 with createBrowserRouter
 */
export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'questionnaire',
        element: <Questionnaire />,
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
    ],
  },
]);

export default routes;
