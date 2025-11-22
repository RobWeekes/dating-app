import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsers, setLoading, setError, likeUser, passUser } from '../redux/slices/discoverySlice';
import { selectUserProfile } from '../redux/selectors';
import { getDiscoveryUsers, likeUser as likeUserAPI, unlikeUser } from '../services/api';
import Button from '../components/Button';
import '../styles/discovery.css';

/**
 * Discovery Page - Browse and like users matching your preferences
 */
function Discovery() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const userProfile = useSelector(selectUserProfile);
  const discoveryState = useSelector((state) => state.discovery);
  const { users, currentIndex, isLoading, error } = discoveryState;

  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load matching users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      if (userProfile?.id) {
        try {
          setIsLoadingUsers(true);
          dispatch(setLoading(true));
          dispatch(setError(null));

          const matchingUsers = await getDiscoveryUsers(userProfile.id);
          dispatch(setUsers(matchingUsers));
        } catch (err) {
          console.error('Error loading discovery users:', err);
          dispatch(setError('Failed to load users. Please check your preferences.'));
        } finally {
          setIsLoadingUsers(false);
          dispatch(setLoading(false));
        }
      }
    };

    loadUsers();
  }, [userProfile?.id, dispatch]);

  // Handle like - save to database
  const handleLike = async (userId) => {
    try {
      setIsSubmitting(true);
      // Save like to database
      await likeUserAPI(userProfile.id, userId);
      // Update Redux state
      dispatch(likeUser(userId));
    } catch (err) {
      console.error('Error saving like:', err);
      // Still update UI even if API fails (optimistic update)
      dispatch(likeUser(userId));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle pass
  const handlePass = (userId) => {
    dispatch(passUser(userId));
  };

  // Get current user
  const currentUser = users[currentIndex];
  const hasMoreUsers = currentIndex < users.length;

  // Loading state
  if (isLoadingUsers) {
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
              <span className="stat-value">{discoveryState.likes.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Passes:</span>
              <span className="stat-value">{discoveryState.passes.length}</span>
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
