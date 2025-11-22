import { API_BASE_URL } from '../constants';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response data
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Get user profile from API
 * @param {number} userId - User ID
 * @returns {Promise<object>} User profile data
 */
export const getUserProfile = async (userId) => {
  return fetchAPI(`/users/${userId}`);
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {object} profileData - Updated profile data
 * @returns {Promise<object>} Updated profile
 */
export const updateUserProfile = async (userId, profileData) => {
  return fetchAPI(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

/**
 * Get user preferences
 * @param {number} userId - User ID
 * @returns {Promise<object>} User preferences
 */
export const getUserPreferences = async (userId) => {
  return fetchAPI(`/preferences/user/${userId}`);
};

/**
 * Update user preferences
 * @param {number} userId - User ID
 * @param {object} preferencesData - Updated preferences data
 * @returns {Promise<object>} Updated preferences
 */
export const updateUserPreferences = async (userId, preferencesData) => {
  return fetchAPI(`/preferences/user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(preferencesData),
  });
};

/**
 * Submit user preferences (create new)
 * @param {object} preferencesData - Preferences data with userId
 * @returns {Promise<object>} Submitted preferences
 */
export const submitPreferences = async (preferencesData) => {
  return fetchAPI(`/preferences`, {
    method: 'POST',
    body: JSON.stringify(preferencesData),
  });
};

/**
 * Get user questionnaire
 * @param {number} userId - User ID
 * @returns {Promise<object>} Questionnaire data
 */
export const getUserQuestionnaire = async (userId) => {
  return fetchAPI(`/questionnaires/user/${userId}`);
};

/**
 * Submit user questionnaire
 * @param {object} questionnaireData - Questionnaire data with userId
 * @returns {Promise<object>} Submitted questionnaire
 */
export const submitQuestionnaire = async (questionnaireData) => {
  return fetchAPI(`/questionnaires`, {
    method: 'POST',
    body: JSON.stringify(questionnaireData),
  });
};

/**
 * Update user questionnaire by ID
 * @param {number} questionnaireId - Questionnaire ID
 * @param {object} questionnaireData - Updated questionnaire data
 * @returns {Promise<object>} Updated questionnaire
 */
export const updateUserQuestionnaire = async (questionnaireId, questionnaireData) => {
  return fetchAPI(`/questionnaires/${questionnaireId}`, {
    method: 'PUT',
    body: JSON.stringify(questionnaireData),
  });
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  submitPreferences,
  getUserQuestionnaire,
  submitQuestionnaire,
  updateUserQuestionnaire,
};
