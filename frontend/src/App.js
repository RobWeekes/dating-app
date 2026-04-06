import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import routes from './routes';
import { restoreSession } from './redux/slices/authSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();

  // Restore auth session from localStorage on app load
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <RouterProvider
      router={routes}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default App;
