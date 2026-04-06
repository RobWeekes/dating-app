import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, setPreferences } from '../redux/slices/preferencesSlice';
import { selectIsPreferencesLoading, selectPreferencesError } from '../redux/selectors';
import { getUserPreferences, submitPreferences, updateUserPreferences } from '../services/api';

const DEFAULT_FORM_DATA = {
  minAge: 18,
  maxAge: 100,
  location: '',
  locationRadius: 50,
  interests: [],
  relationshipType: 'Any',
};

const mapPreferencesToFormData = (preferences = {}) => ({
  minAge: preferences.minAge || DEFAULT_FORM_DATA.minAge,
  maxAge: preferences.maxAge || DEFAULT_FORM_DATA.maxAge,
  location: preferences.location || DEFAULT_FORM_DATA.location,
  locationRadius: preferences.locationRadius || DEFAULT_FORM_DATA.locationRadius,
  interests: preferences.interests || DEFAULT_FORM_DATA.interests,
  relationshipType: preferences.relationshipType || DEFAULT_FORM_DATA.relationshipType,
});

/**
 * Shared preferences state and async lifecycle logic.
 * Keeps components focused on rendering while centralizing race-safe data handling.
 */
const usePreferences = (userId) => {
  const dispatch = useDispatch();
  const error = useSelector(selectPreferencesError);
  const isLoading = useSelector(selectIsPreferencesLoading);

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [existingPreferences, setExistingPreferences] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasExistingPreferences = useMemo(() => Boolean(existingPreferences), [existingPreferences]);

  const clearFieldError = useCallback((fieldName) => {
    setFormErrors((prev) => {
      if (!prev[fieldName]) {
        return prev;
      }

      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  }, []);

  const clearAgeRangeError = useCallback(() => {
    setFormErrors((prev) => {
      if (!prev.ageRange) {
        return prev;
      }

      const updated = { ...prev };
      delete updated.ageRange;
      return updated;
    });
  }, []);

  const clearInterestsError = useCallback(() => {
    setFormErrors((prev) => {
      if (!prev.interests) {
        return prev;
      }

      const updated = { ...prev };
      delete updated.interests;
      return updated;
    });
  }, []);

  const resetForm = useCallback(() => {
    if (existingPreferences) {
      setFormData(mapPreferencesToFormData(existingPreferences));
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }

    setFormErrors({});
  }, [existingPreferences]);

  const validateForm = useCallback(() => {
    const validationErrors = {};

    if (formData.minAge < 18 || formData.minAge > 120) {
      validationErrors.minAge = 'Minimum age must be between 18 and 120';
    }

    if (formData.maxAge < 18 || formData.maxAge > 120) {
      validationErrors.maxAge = 'Maximum age must be between 18 and 120';
    }

    if (formData.minAge > formData.maxAge) {
      validationErrors.ageRange = 'Minimum age cannot be greater than maximum age';
    }

    if (formData.locationRadius < 1 || formData.locationRadius > 500) {
      validationErrors.locationRadius = 'Location radius must be between 1 and 500 miles';
    }

    if (formData.interests.length === 0) {
      validationErrors.interests = 'Please select at least one interest';
    }

    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    if (!userId) {
      setExistingPreferences(null);
      setFormData(DEFAULT_FORM_DATA);
      setFormErrors({});
      dispatch(setError(null));
      dispatch(setLoading(false));
      return;
    }

    let isCurrent = true;

    const loadPreferences = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data = await getUserPreferences(userId);

        if (!isCurrent) {
          return;
        }

        setExistingPreferences(data || null);
        setFormData(mapPreferencesToFormData(data));

        if (data) {
          dispatch(setPreferences(data));
        }
      } catch (err) {
        if (!isCurrent) {
          return;
        }

        const notFoundMessage = 'Preference not found for this user';
        if (err?.message === notFoundMessage) {
          setExistingPreferences(null);
          setFormData(DEFAULT_FORM_DATA);
          return;
        }

        dispatch(setError(err.message || 'Failed to load preferences'));
      } finally {
        if (isCurrent) {
          dispatch(setLoading(false));
        }
      }
    };

    loadPreferences();

    return () => {
      isCurrent = false;
    };
  }, [dispatch, userId]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'minAge' || name === 'maxAge' || name === 'locationRadius'
        ? parseInt(value, 10)
        : value,
    }));

    clearFieldError(name);
  }, [clearFieldError]);

  const handleRangeChange = useCallback((event) => {
    const { name, value } = event.target;
    const numericValue = parseInt(value, 10);

    if (name === 'minAge') {
      setFormData((prev) => {
        if (numericValue > prev.maxAge) {
          return prev;
        }

        return { ...prev, minAge: numericValue };
      });
    }

    if (name === 'maxAge') {
      setFormData((prev) => {
        if (numericValue < prev.minAge) {
          return prev;
        }

        return { ...prev, maxAge: numericValue };
      });
    }

    clearAgeRangeError();
  }, [clearAgeRangeError]);

  const handleInterestChange = useCallback((interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((currentInterest) => currentInterest !== interest)
        : [...prev.interests, interest];

      return {
        ...prev,
        interests,
      };
    });

    clearInterestsError();
  }, [clearInterestsError]);

  const savePreferences = useCallback(async () => {
    if (!userId) {
      dispatch(setError('User profile is required to save preferences'));
      return { success: false };
    }

    if (!validateForm()) {
      return { success: false };
    }

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const preferencesData = {
        userId,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        location: formData.location,
        locationRadius: formData.locationRadius,
        interests: formData.interests,
        relationshipType: formData.relationshipType,
      };

      const result = hasExistingPreferences
        ? await updateUserPreferences(userId, preferencesData)
        : await submitPreferences(preferencesData);

      setExistingPreferences(result);
      setFormData(mapPreferencesToFormData(result));
      dispatch(setPreferences(result));

      return { success: true, data: result };
    } catch (err) {
      dispatch(setError(err.message || 'Failed to save preferences'));
      return { success: false };
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, formData, hasExistingPreferences, userId, validateForm]);

  return {
    error,
    existingPreferences,
    formData,
    formErrors,
    hasExistingPreferences,
    handleChange,
    handleInterestChange,
    handleRangeChange,
    isLoading,
    isSubmitting,
    resetForm,
    savePreferences,
    setFormData,
  };
};

export default usePreferences;
