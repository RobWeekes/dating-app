import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile, setLoading, setError } from '../redux/slices/userSlice';
import { selectUserProfile, selectUserLoading, selectUserError } from '../redux/selectors';
import { updateUserProfile, getUserProfile } from '../services/api';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import '../styles/profile.css';

/**
 * Profile page - Display and edit user profile
 */
function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get current user from Redux
  const userProfile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  
  // Check if we're in edit mode (URL contains /edit or from route)
  const isEditMode = window.location.pathname.includes('/edit');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    age: '',
    bio: '',
    location: '',
    profilePhotoUrl: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        age: userProfile.age || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        profilePhotoUrl: userProfile.profilePhotoUrl || ''
      });
    }
  }, [userProfile]);

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 18 || formData.age > 120)) {
      errors.age = 'Age must be between 18 and 120';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      // Update profile via API
      const updatedProfile = await updateUserProfile(userProfile.id, formData);
      
      // Update Redux store
      dispatch(setUserProfile(updatedProfile));
      dispatch(setError(null));
      
      // Navigate back to profile view
      setTimeout(() => {
        navigate('/profile');
      }, 500);
    } catch (err) {
      dispatch(setError(err.message || 'Failed to update profile'));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form to current user data
    if (userProfile) {
      setFormData({
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        age: userProfile.age || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        profilePhotoUrl: userProfile.profilePhotoUrl || ''
      });
    }
    setFormErrors({});
    
    if (isEditMode) {
      navigate('/profile');
    }
  };

  // If not in edit mode, show profile view
  if (!isEditMode) {
    return (
      <div className="page profile-page">
        <div className="profile-header">
          <h1>My Profile</h1>
          <Button 
            onClick={() => navigate('/profile/edit')}
            className="btn-primary"
          >
            Edit Profile
          </Button>
        </div>

        {userProfile ? (
          <div className="profile-view">
            {userProfile.profilePhotoUrl && (
              <div className="profile-photo">
                <img src={userProfile.profilePhotoUrl} alt="Profile" />
              </div>
            )}
            
            <div className="profile-info">
              <div className="info-group">
                <label>Email</label>
                <p>{userProfile.email}</p>
              </div>
              
              <div className="info-group">
                <label>Name</label>
                <p>{userProfile.firstName} {userProfile.lastName}</p>
              </div>
              
              {userProfile.age && (
                <div className="info-group">
                  <label>Age</label>
                  <p>{userProfile.age}</p>
                </div>
              )}
              
              {userProfile.location && (
                <div className="info-group">
                  <label>Location</label>
                  <p>{userProfile.location}</p>
                </div>
              )}
              
              {userProfile.bio && (
                <div className="info-group">
                  <label>Bio</label>
                  <p>{userProfile.bio}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No profile data available. Please complete your profile.</p>
        )}
      </div>
    );
  }

  // Edit mode - show form
  return (
    <div className="page profile-page profile-edit-page">
      <h1>Edit Profile</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={formErrors.email}
          required
        />

        <FormInput
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          error={formErrors.firstName}
          required
        />

        <FormInput
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={formErrors.lastName}
          required
        />

        <FormInput
          label="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          error={formErrors.age}
          min="18"
          max="120"
        />

        <FormInput
          label="Location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />

        <FormInput
          label="Bio"
          type="textarea"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
        />

        <FormInput
          label="Profile Photo URL"
          type="url"
          name="profilePhotoUrl"
          value={formData.profilePhotoUrl}
          onChange={handleInputChange}
        />

        <div className="form-actions">
          <Button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          
          <Button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
