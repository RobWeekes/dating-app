import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserProfile } from '../redux/selectors';
import useMatches from '../hooks/useMatches';
import Button from '../components/Button';
import '../styles/matches.css';

/**
 * Matches Page - View mutual likes (matches)
 */
function Matches() {
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  const {
    error,
    isLoading,
    matches,
  } = useMatches(userProfile?.id);

  // View user profile
  const handleViewProfile = (userId) => {
    // Future: Navigate to profile view for this user
    console.log('View profile for user:', userId);
  };

  // Start messaging
  const handleMessage = (userId, userName) => {
    // Future: Navigate to messaging interface
    console.log('Message user:', userId, userName);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="matches-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your matches...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="matches-page">
        <div className="error-container">
          <h2>Unable to Load Matches</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/discover')} className="btn-primary">
            Back to Discovery
          </Button>
        </div>
      </div>
    );
  }

  // No matches state
  if (matches.length === 0) {
    return (
      <div className="matches-page">
        <div className="no-matches-container">
          <h2>No Matches Yet</h2>
          <p>When someone you like also likes you back, they'll appear here!</p>
          <Button onClick={() => navigate('/discover')} className="btn-primary">
            Continue Browsing
          </Button>
        </div>
      </div>
    );
  }

  // Matches view
  return (
    <div className="matches-page">
      <div className="matches-header">
        <h1>Your Matches ♥</h1>
        <p className="matches-count">{matches.length} match{matches.length !== 1 ? 'es' : ''}</p>
      </div>

      <div className="matches-grid">
        {matches.map((match) => {
          const matchUser = match.fromUser;
          return (
            <div key={match.id} className="match-card">
              <div className="match-image">
                <img
                  src={matchUser.profilePhotoUrl || 'https://via.placeholder.com/300x400?text=No+Photo'}
                  alt={matchUser.firstName}
                />
                <div className="match-badge">♥ MATCH</div>
              </div>

              <div className="match-info">
                <div className="match-header">
                  <h3>
                    {matchUser.firstName} {matchUser.lastName}
                  </h3>
                  <span className="age">{matchUser.age}</span>
                </div>

                {matchUser.location && (
                  <p className="location">📍 {matchUser.location}</p>
                )}

                {matchUser.bio && (
                  <p className="bio">{matchUser.bio}</p>
                )}

                {/* Questionnaire preview */}
                {matchUser.Questionnaire && (
                  <div className="personality-preview">
                    <span className="personality-badge">
                      {matchUser.Questionnaire.personalityType}
                    </span>
                    <span className="looking-for">
                      {matchUser.Questionnaire.datingGoal}
                    </span>
                  </div>
                )}

                {/* Interests preview */}
                {matchUser.Questionnaire?.interests && matchUser.Questionnaire.interests.length > 0 && (
                  <div className="interests-preview">
                    {matchUser.Questionnaire.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                    {matchUser.Questionnaire.interests.length > 3 && (
                      <span className="interest-tag more">
                        +{matchUser.Questionnaire.interests.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="match-actions">
                <Button
                  onClick={() => handleViewProfile(matchUser.id)}
                  className="btn-secondary"
                >
                  View Profile
                </Button>
                <Button
                  onClick={() => handleMessage(matchUser.id, matchUser.firstName)}
                  className="btn-primary"
                >
                  Message
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="matches-footer">
        <Button onClick={() => navigate('/discover')} className="btn-secondary">
          ← Back to Discovery
        </Button>
      </div>
    </div>
  );
}

export default Matches;
