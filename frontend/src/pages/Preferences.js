// frontend/src/pages/Preferences.js

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserProfile } from '../redux/selectors';
import usePreferences from '../hooks/usePreferences';
import Button from '../components/Button';
import '../styles/preferences.css';

/**
 * Preferences page - Set dating preferences and match filters
 * Allows users to specify age range, location, interests, and relationship type preferences
 */
function Preferences() {
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  const {
    error,
    existingPreferences,
    formData,
    formErrors,
    handleChange,
    handleInterestChange,
    handleRangeChange,
    isSubmitting,
    resetForm,
    savePreferences,
  } = usePreferences(userProfile?.id);

  const [isEditing, setIsEditing] = useState(false);

  // Interest options
  const interestOptions = [
    'Travel',
    'Fitness',
    'Cooking',
    'Art & Music',
    'Reading',
    'Outdoor activities',
    'Movies & TV',
    'Gaming',
    'Sports',
    'Photography',
    'Volunteering',
    'Meditation',
    'Fashion',
    'Technology',
    'Animals',
    'Gardening',
  ];

  // Relationship type options
  const relationshipTypes = ['Any', 'Monogamous', 'Open relationship', 'Not sure'];

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await savePreferences();

    if (result.success) {
      setIsEditing(false);
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  // Render view mode
  if (!isEditing && existingPreferences) {
    return (
      <div className="preferences-page">
        <div className="preferences-header">
          <h1>Your Preferences</h1>
          <Button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit
          </Button>
        </div>

        <div className="preferences-view">
          <div className="preference-group">
            <label>Age Range</label>
            <p>
              {existingPreferences.minAge} - {existingPreferences.maxAge} years old
            </p>
          </div>

          {existingPreferences.location && (
            <div className="preference-group">
              <label>Location</label>
              <p>
                {existingPreferences.location} (within {existingPreferences.locationRadius} miles)
              </p>
            </div>
          )}

          <div className="preference-group">
            <label>Interested In</label>
            <div className="interests-display">
              {existingPreferences.interests?.map((interest) => (
                <span key={interest} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="preference-group">
            <label>Relationship Type</label>
            <p>{existingPreferences.relationshipType}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render edit form
  return (
    <div className="preferences-page">
      <div className="preferences-header">
        <h1>{existingPreferences ? 'Update Your Preferences' : 'Set Your Preferences'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="preferences-form">
        {/* Age Range Section */}
        <div className="form-section">
          <h2>Age Range</h2>
          <div className="age-range-container">
            <div className="dual-range-wrapper">
              <label className="age-label">
                {formData.minAge} - {formData.maxAge} years old
              </label>
              <div className="dual-range-sliders">
                <input
                  type="range"
                  id="minAge"
                  name="minAge"
                  min="18"
                  max="120"
                  value={formData.minAge}
                  onChange={handleRangeChange}
                  className="range-slider range-slider-min"
                />
                <input
                  type="range"
                  id="maxAge"
                  name="maxAge"
                  min="18"
                  max="120"
                  value={formData.maxAge}
                  onChange={handleRangeChange}
                  className="range-slider range-slider-max"
                />
              </div>
            </div>

            {formErrors.ageRange && (
              <span className="error-text">{formErrors.ageRange}</span>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="form-section">
          <h2>Location Preferences</h2>
          <div className="location-container">
            <div className="form-group">
              <label htmlFor="location">Location (Optional)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Los Angeles, CA"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="locationRadius">
                Search Radius: <span className="radius-value">{formData.locationRadius} miles</span>
              </label>
              <input
                type="range"
                id="locationRadius"
                name="locationRadius"
                min="1"
                max="500"
                step="5"
                value={formData.locationRadius}
                onChange={handleChange}
                className="range-slider"
              />
              {formErrors.locationRadius && (
                <span className="error-text">{formErrors.locationRadius}</span>
              )}
            </div>
          </div>
        </div>

        {/* Relationship Type Section */}
        <div className="form-section">
          <h2>Relationship Type</h2>
          <select
            name="relationshipType"
            value={formData.relationshipType}
            onChange={handleChange}
            className={`form-select ${formErrors.relationshipType ? 'error' : ''}`}
          >
            {relationshipTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {formErrors.relationshipType && (
            <span className="error-text">{formErrors.relationshipType}</span>
          )}
        </div>

        {/* Interests Section */}
        <div className="form-section">
          <h2>Interests</h2>
          <p className="section-description">
            Select interests that matter to you in a potential match
          </p>
          <div className={`interests-grid ${formErrors.interests ? 'error' : ''}`}>
            {interestOptions.map((interest) => (
              <label key={interest} className="interest-checkbox">
                <input
                  type="checkbox"
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
          {formErrors.interests && (
            <span className="error-text">{formErrors.interests}</span>
          )}
          <span className="selected-count">
            {formData.interests.length} selected
          </span>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : existingPreferences ? 'Update' : 'Save Preferences'}
          </Button>
          {isEditing && (
            <Button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}


export default Preferences;
