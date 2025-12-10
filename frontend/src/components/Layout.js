import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

/**
 * Layout component - Main layout wrapper for pages with navigation
 */
function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h2>💕 Dating App</h2>
          </Link>
          <ul className="nav-menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/discover">Discover</Link>
            </li>
            <li>
              <Link to="/matches">Matches</Link>
            </li>
            <li>
              <Link to="/questionnaire">Questionnaire</Link>
            </li>
            <li>
              <Link to="/questionnaire/select">Compatibility Quiz</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/preferences">Preferences</Link>
            </li>
          </ul>
          <div className="navbar-user">
            {user && <span className="user-name">{user.firstName}</span>}
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
