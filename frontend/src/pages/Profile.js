import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError } from '../redux/slices/userSlice';
import { selectUserProfile, selectIsUserLoading, selectUserError } from '../redux/selectors';
// import { updateUserProfile, getUserProfile } from '../services/api';
import { updateUserProfile } from '../services/api';
import { updateUser } from '../redux/slices/authSlice';
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
  const isLoading = useSelector(selectIsUserLoading);
  const error = useSelector(selectUserError);
  
  // Check if we're in edit mode (URL contains /edit or from route)
  const isEditMode = window.location.pathname.includes('/edit');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    age: '',
    location: '',
    bodyType: '',
    bmi: '',
    politics: '',
    religion: '',
    ethnicity: '',
    family: '',
    familyGoals: '',
    bio: '',
    profilePhotoUrl: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if profile is complete
  const isProfileComplete = () => {
    if (!userProfile) return false;
    return (
      userProfile.age &&
      userProfile.location &&
      userProfile.bodyType &&
      userProfile.bmi &&
      userProfile.politics &&
      userProfile.religion &&
      userProfile.ethnicity &&
      userProfile.family &&
      userProfile.familyGoals &&
      userProfile.bio
    );
  };

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        age: userProfile.age || '',
        location: userProfile.location || '',
        bodyType: userProfile.bodyType || '',
        bmi: userProfile.bmi || '',
        politics: userProfile.politics || '',
        religion: userProfile.religion || '',
        ethnicity: userProfile.ethnicity || '',
        family: userProfile.family || '',
        familyGoals: userProfile.familyGoals || '',
        bio: userProfile.bio || '',
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

    if (formData.bmi && isNaN(formData.bmi)) {
      errors.bmi = 'BMI must be a valid number';
    } else if (formData.bmi && (parseFloat(formData.bmi) < 10 || parseFloat(formData.bmi) > 60)) {
      errors.bmi = 'BMI must be between 10 and 60';
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
      
      // Update Redux store (both auth and user slices)
      dispatch(updateUser(updatedProfile));
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
        location: userProfile.location || '',
        bodyType: userProfile.bodyType || '',
        bmi: userProfile.bmi || '',
        politics: userProfile.politics || '',
        religion: userProfile.religion || '',
        ethnicity: userProfile.ethnicity || '',
        family: userProfile.family || '',
        familyGoals: userProfile.familyGoals || '',
        bio: userProfile.bio || '',
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
              
              {userProfile.bodyType && (
                <div className="info-group">
                  <label>Body Type</label>
                  <p>{userProfile.bodyType}</p>
                </div>
              )}
              
              {userProfile.bmi && (
                <div className="info-group">
                  <label>BMI</label>
                  <p>{parseFloat(userProfile.bmi).toFixed(2)}</p>
                </div>
              )}
              
              {userProfile.politics && (
                <div className="info-group">
                  <label>Politics</label>
                  <p>{userProfile.politics}</p>
                </div>
              )}
              
              {userProfile.religion && (
                <div className="info-group">
                  <label>Religion</label>
                  <p>{userProfile.religion}</p>
                </div>
              )}
              
              {userProfile.ethnicity && (
                <div className="info-group">
                  <label>Ethnicity</label>
                  <p>{userProfile.ethnicity}</p>
                </div>
              )}
              
              {userProfile.family && (
                <div className="info-group">
                  <label>Family</label>
                  <p>{userProfile.family}</p>
                </div>
              )}
              
              {userProfile.familyGoals && (
                <div className="info-group">
                  <label>Family Goals</label>
                  <p>{userProfile.familyGoals}</p>
                </div>
              )}
              
              {userProfile.bio && (
                <div className="info-group">
                  <label>Bio</label>
                  <p>{userProfile.bio}</p>
                </div>
              )}
            </div>

            {!isProfileComplete() && (
              <div className="profile-incomplete-notice">
                <Button 
                  onClick={() => navigate('/profile/edit')}
                  className="btn-link"
                >
                  Complete profile to unlock all Power Search options
                </Button>
              </div>
            )}
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
          label="Body Type"
          type="select"
          name="bodyType"
          value={formData.bodyType}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'Select Body Type' },
            { value: 'Thin', label: 'Thin' },
            { value: 'Average', label: 'Average' },
            { value: 'Athletic/Toned', label: 'Athletic/Toned' },
            { value: 'Muscular', label: 'Muscular' },
            { value: 'Curvy', label: 'Curvy' },
            { value: 'Plump', label: 'Plump' },
            { value: 'Big & Beautiful', label: 'Big & Beautiful' }
          ]}
        />

        <FormInput
          label="BMI"
          type="number"
          name="bmi"
          value={formData.bmi}
          onChange={handleInputChange}
          error={formErrors.bmi}
          step="0.01"
          min="10"
          max="60"
          placeholder="e.g. 24.50"
        />

        <FormInput
          label="Politics"
          type="select"
          name="politics"
          value={formData.politics}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'Select Political View' },
            { value: 'Progressive Left', label: 'Progressive Left' },
            { value: 'Moderate Left', label: 'Moderate Left' },
            { value: 'Independent', label: 'Independent' },
            { value: 'Moderate Right', label: 'Moderate Right' },
            { value: 'Traditional Conservative', label: 'Traditional Conservative' }
          ]}
        />

        <FormInput
          label="Religion"
          type="select"
          name="religion"
          value={formData.religion}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'Select Religion' },
            { value: 'Not religious', label: 'Not Religious' },
            { value: 'Christian', label: 'Christian' },
            { value: 'Catholic', label: 'Catholic' },
            { value: 'Protestant', label: 'Protestant' },
            { value: 'Baptist', label: 'Baptist' },
            { value: 'Jewish Orthodox', label: 'Jewish Orthodox' },
            { value: 'Jewish Reform', label: 'Jewish Reform' },
            { value: 'Muslim', label: 'Muslim' },
            { value: 'Hindu', label: 'Hindu' },
            { value: 'Agnostic', label: 'Agnostic' },
            { value: 'Atheist', label: 'Atheist' }
          ]}
        />

        <FormInput
          label="Ethnicity"
          type="select"
          name="ethnicity"
          value={formData.ethnicity}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'Select Ethnicity' },
            { value: 'White', label: 'White' },
            { value: 'Black/African American', label: 'Black/African American' },
            { value: 'Hispanic/Latino', label: 'Hispanic/Latino' },
            { value: 'Asian', label: 'Asian' },
            { value: 'Native American', label: 'Native American' },
            { value: 'Pacific Islander', label: 'Pacific Islander' },
            { value: 'Middle Eastern/North African', label: 'Middle Eastern/North African' },
            { value: 'Mixed Race', label: 'Mixed Race' },
            { value: 'Other', label: 'Other' }
          ]}
        />

        <FormInput
          label="Family Status"
          type="select"
          name="family"
          value={formData.family}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'Select Family Status' },
            { value: 'Single/Never Married', label: 'Single/Never Married' },
            { value: 'Divorced with Children', label: 'Divorced with Children' },
            { value: 'Divorced No Children', label: 'Divorced No Children' }
          ]}
        />

        <FormInput
          label="Family Goals"
          type="select"
          name="familyGoals"
          value={formData.familyGoals}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'Select Family Goals' },
            { value: "Don't Want Kids/Any More Kids", label: "Don't Want Kids/Any More Kids" },
            { value: 'Want Kids/More Kids', label: 'Want Kids/More Kids' }
          ]}
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
