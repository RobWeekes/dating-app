import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * Layout component - Main layout wrapper for pages with navigation
 * Includes the premium Header component
 */
function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
