import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserProfile } from '../redux/selectors';
import useDiscovery from '../hooks/useDiscovery';
import Button from '../components/Button';
import '../styles/discovery.css';

/**
 * Discovery Page - Browse and like users matching your preferences
 */
function Discovery() {
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  const {
    currentIndex,
    currentUser,
    error,
    hasMoreUsers,
    handleLike,
    handlePass,
    isLoading,
    isSubmitting,
    likes,
    passes,
    users,
  } = useDiscovery(userProfile?.id);

  // Loading state
  if (isLoading) {
    return (
      <div className="discovery-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="discovery-page">
        <div className="error-container">
          <h2>Unable to Load Users</h2>
          <p>{error}</p>
          <p className="error-hint">Make sure you have set your preferences first.</p>
          <Button onClick={() => navigate('/preferences')} className="btn-primary">
            Set Preferences
          </Button>
        </div>
      </div>
    );
  }

  // No users state
  if (users.length === 0) {
    return (
      <div className="discovery-page">
        <div className="no-users-container">
          <h2>No Users Found</h2>
          <p>There are no users matching your preferences at this time.</p>
          <Button onClick={() => navigate('/preferences')} className="btn-primary">
            Update Preferences
          </Button>
        </div>
      </div>
    );
  }

  // No more users state
  if (!hasMoreUsers) {
    return (
      <div className="discovery-page">
        <div className="no-more-users-container">
          <h2>You've Seen Everyone!</h2>
          <p>You've reviewed all available users.</p>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Likes:</span>
              <span className="stat-value">{likes.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Passes:</span>
              <span className="stat-value">{passes.length}</span>
            </div>
          </div>
          <Button onClick={() => navigate('/profile')} className="btn-primary">
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  // Main discovery view
  return (
    <div className="discovery-page">
      <div className="discovery-header">
        <h1>Discover</h1>
        <p className="user-counter">
          {currentIndex + 1} of {users.length}
        </p>
      </div>

      {/* User Card */}
      <div className="user-cards-container">
        {currentUser && (
          <div className="user-card">
            <div className="card-image">
              <img
                src={currentUser.profilePhotoUrl || 'https://via.placeholder.com/400x500?text=No+Photo'}
                alt={currentUser.firstName}
              />
              <div className="card-overlay"></div>
            </div>

            <div className="card-content">
              <div className="card-header">
                <h2>
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <span className="age-badge">{currentUser.age}</span>
              </div>

              {currentUser.location && (
                <p className="location">
                  📍 {currentUser.location}
                </p>
              )}

              {currentUser.bio && (
                <p className="bio">{currentUser.bio}</p>
              )}

              {/* Questionnaire Info */}
              {currentUser.Questionnaire && (
                <div className="questionnaire-info">
                  <div className="info-item">
                    <span className="info-label">Personality:</span>
                    <span className="info-value">
                      {currentUser.Questionnaire.personalityType}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Looking for:</span>
                    <span className="info-value">
                      {currentUser.Questionnaire.datingGoal}
                    </span>
                  </div>
                  {currentUser.Questionnaire.interests && currentUser.Questionnaire.interests.length > 0 && (
                    <div className="interests-info">
                      <span className="info-label">Interests:</span>
                      <div className="interests-display">
                        {currentUser.Questionnaire.interests.map((interest, idx) => (
                          <span key={idx} className="interest-badge">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Preferences */}
              {currentUser.Preference && (
                <div className="preference-info">
                  <div className="info-item">
                    <span className="info-label">Relationship:</span>
                    <span className="info-value">
                      {currentUser.Preference.relationshipType}
                    </span>
                  </div>
                  {currentUser.Preference.interests && currentUser.Preference.interests.length > 0 && (
                    <div className="preferences-interests">
                      <span className="info-label">Their interests:</span>
                      <div className="interests-display">
                        {currentUser.Preference.interests.slice(0, 5).map((interest, idx) => (
                          <span key={idx} className="interest-badge">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Button
          onClick={() => handlePass(currentUser.id)}
          disabled={isSubmitting}
          className="btn-secondary btn-pass"
          title="Pass on this user"
        >
          <span className="button-icon">✕</span>
          <span>Pass</span>
        </Button>

        <Button
          onClick={() => handleLike(currentUser.id)}
          disabled={isSubmitting}
          className="btn-primary btn-like"
          title="Like this user"
        >
          <span className="button-icon">♥</span>
          <span>Like</span>
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="discovery-footer">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / users.length) * 100}%`,
            }}
          ></div>
        </div>
        <p className="progress-text">
          {currentIndex + 1} of {users.length} users viewed
        </p>
      </div>
    </div>
  );
}

export default Discovery;
