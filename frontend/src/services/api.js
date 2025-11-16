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
  return fetchAPI(`/users/${userId}/preferences`);
};

/**
 * Update user preferences
 * @param {number} userId - User ID
 * @param {object} preferencesData - Updated preferences data
 * @returns {Promise<object>} Updated preferences
 */
export const updateUserPreferences = async (userId, preferencesData) => {
  return fetchAPI(`/users/${userId}/preferences`, {
    method: 'PUT',
    body: JSON.stringify(preferencesData),
  });
};

/**
 * Get user questionnaire
 * @param {number} userId - User ID
 * @returns {Promise<object>} Questionnaire data
 */
export const getUserQuestionnaire = async (userId) => {
  return fetchAPI(`/users/${userId}/questionnaire`);
};

/**
 * Submit user questionnaire
 * @param {number} userId - User ID
 * @param {object} questionnaireData - Questionnaire responses
 * @returns {Promise<object>} Submitted questionnaire
 */
export const submitQuestionnaire = async (userId, questionnaireData) => {
  return fetchAPI(`/users/${userId}/questionnaire`, {
    method: 'POST',
    body: JSON.stringify(questionnaireData),
  });
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  getUserQuestionnaire,
  submitQuestionnaire,
};
