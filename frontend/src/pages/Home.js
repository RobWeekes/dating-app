import { Link } from 'react-router-dom';

/**
 * Home page - Main landing page
 */
function Home() {
  return (
    <div className="page home-page">
      <h1>Welcome to Dating App</h1>
      <p>Find your perfect match today.</p>
      <div className="home-actions">
        <Link to="/questionnaire/MVP" className="btn btn-primary">
          Complete Questionnaire
        </Link>
        <Link to="/profile" className="btn btn-secondary">
          View Profile
        </Link>
        <Link to="/preferences" className="btn btn-secondary">
          Set Preferences
        </Link>
      </div>
    </div>
  );
}

export default Home;
