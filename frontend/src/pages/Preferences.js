// frontend/src/pages/Preferences.js

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPreferences, setLoading, setError } from '../redux/slices/preferencesSlice';
import { selectUserProfile, selectPreferencesError } from '../redux/selectors';
// import { selectUserProfile, selectIsPreferencesLoading, selectPreferencesError } from '../redux/selectors';
import { 
  getUserPreferences, 
  updateUserPreferences, 
  submitPreferences 
} from '../services/api';
import Button from '../components/Button';
import '../styles/preferences.css';

/**
 * Preferences page - Set dating preferences and match filters
 * Allows users to specify age range, location, interests, and relationship type preferences
 */
function Preferences() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const userProfile = useSelector(selectUserProfile);
  const error = useSelector(selectPreferencesError);
  // const isLoading = useSelector(selectIsPreferencesLoading);

  // Form state
  const [formData, setFormData] = useState({
    minAge: 18,
    maxAge: 100,
    location: '',
    locationRadius: 50,
    interests: [],
    relationshipType: 'Any',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPreferences, setExistingPreferences] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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

  // Load existing preferences on mount
  useEffect(() => {
  if (!userProfile?.id) return;

  let isCurrent = true;

  const loadPreferences = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getUserPreferences(userProfile.id);

      if (!isCurrent) return;

      if (data) {
        setFormData({
          minAge: data.minAge || 18,
          maxAge: data.maxAge || 100,
          location: data.location || '',
          locationRadius: data.locationRadius || 50,
          interests: data.interests || [],
          relationshipType: data.relationshipType || 'Any',
        });

        setExistingPreferences(data);
        dispatch(setPreferences(data));
      }
    } catch (err) {
      if (!isCurrent) return;
      console.log('No existing preferences found - this is expected for new users');
    } finally {
      if (isCurrent) {
        dispatch(setLoading(false));
      }
    }
  };

  loadPreferences();

  // When the effect reruns or the component unmounts, cleanup sets
  return () => {
    isCurrent = false;
  };
}, [userProfile?.id, dispatch]);
useEffect(() => {
  if (!userProfile?.id) {
    setExistingPreferences(null);
    setFormData({
      minAge: 18,
      maxAge: 100,
      location: '',
      locationRadius: 50,
      interests: [],
      relationshipType: 'Any',
    });
    return;
  }

  let isCurrent = true;

  const loadPreferences = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getUserPreferences(userProfile.id);

      if (!isCurrent) return;

      if (data) {
        setFormData({
          minAge: data.minAge || 18,
          maxAge: data.maxAge || 100,
          location: data.location || '',
          locationRadius: data.locationRadius || 50,
          interests: data.interests || [],
          relationshipType: data.relationshipType || 'Any',
        });
        setExistingPreferences(data);
        dispatch(setPreferences(data));
      }
    } catch (err) {
      if (!isCurrent) return;
      console.log('No existing preferences found - this is expected for new users');
    } finally {
      if (isCurrent) {
        dispatch(setLoading(false));
      }
    }
  };

  loadPreferences();

  // When the effect reruns or the component unmounts, cleanup sets
  return () => {
    isCurrent = false;
  };
}, [userProfile?.id, dispatch]);
  // Validate form
  const validateForm = () => {
    const errors = {};

    if (formData.minAge < 18 || formData.minAge > 120) {
      errors.minAge = 'Minimum age must be between 18 and 120';
    }

    if (formData.maxAge < 18 || formData.maxAge > 120) {
      errors.maxAge = 'Maximum age must be between 18 and 120';
    }

    if (formData.minAge > formData.maxAge) {
      errors.ageRange = 'Minimum age cannot be greater than maximum age';
    }

    if (formData.locationRadius < 1 || formData.locationRadius > 500) {
      errors.locationRadius = 'Location radius must be between 1 and 500 miles';
    }

    if (formData.interests.length === 0) {
      errors.interests = 'Please select at least one interest';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'minAge' || name === 'maxAge' || name === 'locationRadius' 
        ? parseInt(value, 10) 
        : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle range slider changes
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);

    if (name === 'minAge' && numValue <= formData.maxAge) {
      setFormData((prev) => ({ ...prev, minAge: numValue }));
    } else if (name === 'maxAge' && numValue >= formData.minAge) {
      setFormData((prev) => ({ ...prev, maxAge: numValue }));
    }

    if (formErrors.ageRange) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated.ageRange;
        return updated;
      });
    }
  };

  // Handle interest selection
  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];

      return { ...prev, interests };
    });

    if (formErrors.interests) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated.interests;
        return updated;
      });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const preferencesData = {
        userId: userProfile.id,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        location: formData.location,
        locationRadius: formData.locationRadius,
        interests: formData.interests,
        relationshipType: formData.relationshipType,
      };

      const result = existingPreferences
        ? await updateUserPreferences(userProfile.id, preferencesData)
        : await submitPreferences(preferencesData);

      setExistingPreferences(result);
      dispatch(setPreferences(result));
      setIsEditing(false);

      // Show success notification
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      dispatch(setError(err.message || 'Failed to save preferences'));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    if (existingPreferences) {
      setFormData({
        minAge: existingPreferences.minAge,
        maxAge: existingPreferences.maxAge,
        location: existingPreferences.location || '',
        locationRadius: existingPreferences.locationRadius,
        interests: existingPreferences.interests || [],
        relationshipType: existingPreferences.relationshipType,
      });
    }
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
