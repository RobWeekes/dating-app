import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../services/api';
import { updateUser } from '../redux/slices/authSlice';
import { setError, setLoading } from '../redux/slices/userSlice';
import { selectIsUserLoading, selectUserError } from '../redux/selectors';

const EMPTY_PROFILE_FORM = {
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
  profilePhotoUrl: '',
};

const mapUserToFormData = (profile) => {
  if (!profile) {
    return EMPTY_PROFILE_FORM;
  }

  return {
    email: profile.email || '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    age: profile.age || '',
    location: profile.location || '',
    bodyType: profile.bodyType || '',
    bmi: profile.bmi || '',
    politics: profile.politics || '',
    religion: profile.religion || '',
    ethnicity: profile.ethnicity || '',
    family: profile.family || '',
    familyGoals: profile.familyGoals || '',
    bio: profile.bio || '',
    profilePhotoUrl: profile.profilePhotoUrl || '',
  };
};

const useProfile = (userProfile) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsUserLoading);
  const error = useSelector(selectUserError);

  const [formData, setFormData] = useState(mapUserToFormData(userProfile));
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(mapUserToFormData(userProfile));
    setFormErrors({});
  }, [userProfile]);

  const isProfileComplete = useMemo(() => {
    if (!userProfile) {
      return false;
    }

    return Boolean(
      userProfile.age
      && userProfile.location
      && userProfile.bodyType
      && userProfile.bmi
      && userProfile.politics
      && userProfile.religion
      && userProfile.ethnicity
      && userProfile.family
      && userProfile.familyGoals
      && userProfile.bio
    );
  }, [userProfile]);

  const validateForm = useCallback(() => {
    const validationErrors = {};

    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email is invalid';
    }

    if (!formData.firstName) {
      validationErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      validationErrors.lastName = 'Last name is required';
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 18 || formData.age > 120)) {
      validationErrors.age = 'Age must be between 18 and 120';
    }

    if (formData.bmi && isNaN(formData.bmi)) {
      validationErrors.bmi = 'BMI must be a valid number';
    } else if (formData.bmi && (parseFloat(formData.bmi) < 10 || parseFloat(formData.bmi) > 60)) {
      validationErrors.bmi = 'BMI must be between 10 and 60';
    }

    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [formErrors]);

  const resetForm = useCallback(() => {
    setFormData(mapUserToFormData(userProfile));
    setFormErrors({});
  }, [userProfile]);

  const saveProfile = useCallback(async () => {
    if (!userProfile?.id) {
      dispatch(setError('User profile not found'));
      return { success: false };
    }

    if (!validateForm()) {
      return { success: false };
    }

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));

      const updatedProfile = await updateUserProfile(userProfile.id, formData);
      dispatch(updateUser(updatedProfile));
      dispatch(setError(null));

      return { success: true, data: updatedProfile };
    } catch (err) {
      dispatch(setError(err.message || 'Failed to update profile'));
      return { success: false };
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, formData, userProfile, validateForm]);

  return {
    error,
    formData,
    formErrors,
    handleInputChange,
    isLoading,
    isProfileComplete,
    isSubmitting,
    resetForm,
    saveProfile,
  };
};

export default useProfile;
