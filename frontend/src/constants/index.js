// API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// App pages/routes
export const PAGES = {
  HOME: 'home',
  QUESTIONNAIRE: 'questionnaire',
  PROFILE: 'profile',
  PROFILE_EDIT: 'profile-edit',
  PREFERENCES: 'preferences',
  SETTINGS: 'settings',
  MATCHES: 'matches',
};

// Modal types
export const MODAL_TYPES = {
  CONFIRM: 'confirm',
  ERROR: 'error',
  SUCCESS: 'success',
  PROFILE_PREVIEW: 'profile-preview',
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Age constraints
export const AGE_CONSTRAINTS = {
  MIN_AGE: 18,
  MAX_AGE: 120,
  MIN_RANGE: 5,
};

// Common strings
export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  INVALID_INPUT: 'Please fill in all required fields.',
};

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  PREFERENCES_UPDATED: 'Preferences updated successfully!',
  QUESTIONNAIRE_SAVED: 'Questionnaire saved successfully!',
};
