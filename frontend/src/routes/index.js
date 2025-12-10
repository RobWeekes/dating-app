import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Questionnaire from '../pages/Questionnaire';
import CompatibilityQuestionnaireSelector from '../components/CompatibilityQuestionnaireSelector';
import Profile from '../pages/Profile';
import Preferences from '../pages/Preferences';
import Discovery from '../pages/Discovery';
import Matches from '../pages/Matches';
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
        path: 'questionnaire/select',
        element: <CompatibilityQuestionnaireSelector />,
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
]);

export default routes;
