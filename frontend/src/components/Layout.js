import { Link, Outlet } from 'react-router-dom';

/**
 * Layout component - Main layout wrapper for pages with navigation
 */
function Layout() {
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
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/preferences">Preferences</Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
