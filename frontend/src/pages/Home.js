/**
 * Home page - Main landing page
 */
function Home() {
  return (
    <div className="page home-page">
      <h1>Welcome to Dating App</h1>
      <p>Find your perfect match today.</p>
      <div className="home-actions">
        <a href="/questionnaire" className="btn btn-primary">
          Complete Questionnaire
        </a>
        <a href="/profile" className="btn btn-secondary">
          View Profile
        </a>
        <a href="/preferences" className="btn btn-secondary">
          Set Preferences
        </a>
      </div>
    </div>
  );
}

export default Home;
