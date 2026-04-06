import { API_BASE_URL } from '../constants';

/**
 * Generic fetch wrapper with error handling and auth token
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response data
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add auth token if available
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    // If 401 or 403 with token error, token is invalid/expired - clear and redirect
    if (response.status === 401 || response.status === 403) {
      const errorData = await response.json();
      if (response.status === 401 || errorData.error === 'Invalid or expired token') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
        return;
      }
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * AUTHENTICATION API FUNCTIONS
 */

/**
 * Register a new user
 * @param {object} formData - Registration data
 * @returns {Promise<object>} Token and user data
 */
export const registerUser = async (formData) => {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

/**
 * Login user
 * @param {object} credentials - Email and password
 * @returns {Promise<object>} Token and user data
 */
export const loginUser = async (credentials) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Get current authenticated user
 * @returns {Promise<object>} Current user data
 */
export const getCurrentUser = async () => {
  return fetchAPI('/auth/me');
};

/**
 * Logout user
 * @returns {Promise<object>} Logout confirmation
 */
export const logoutUser = async () => {
  return fetchAPI('/auth/logout', {
    method: 'POST',
  });
};

/**
 * PROFILE API FUNCTIONS
 */

/**
 * Get user profile from API
 * @param {number} userId - User ID
 * @returns {Promise<object>} User profile data
 */
export const getUserProfile = async (userId) => {
  return fetchAPI(`/users/${userId}`);
};

/**
 * Update user profile (requires authentication)
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
 * Get all active questionnaire templates
 * @returns {Promise<array>} Questionnaire templates
 */
export const getQuestionnaires = async () => {
  return fetchAPI('/questionnaires');
};

/**
 * Get all completed/in-progress responses for the authenticated user
 * @returns {Promise<array>} User questionnaire responses
 */
export const getMyQuestionnaireResponses = async () => {
  return fetchAPI('/questionnaires/responses/me');
};

/**
 * Get questionnaire template by type
 * @param {string} type - Questionnaire type
 * @returns {Promise<object>} Questionnaire template including questions
 */
export const getQuestionnaireTemplateByType = async (type) => {
  return fetchAPI(`/questionnaires/type/${type}`);
};

/**
 * Get authenticated user's response for a questionnaire
 * @param {number|string} questionnaireId - Questionnaire template ID
 * @returns {Promise<object>} Existing questionnaire response with answers
 */
export const getMyQuestionnaireResponse = async (questionnaireId) => {
  return fetchAPI(`/questionnaires/responses/user/me/questionnaire/${questionnaireId}`);
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

/**
 * Get matching users for discovery
 * @param {number} userId - Current user ID
 * @returns {Promise<array>} Array of matching users
 */
export const getDiscoveryUsers = async (userId) => {
  return fetchAPI(`/users/discover/${userId}`);
};

/**
 * Like a user
 * @param {number} fromUserId - Current user ID
 * @param {number} toUserId - User to like ID
 * @returns {Promise<object>} Like object
 */
export const likeUser = async (fromUserId, toUserId) => {
  return fetchAPI(`/likes`, {
    method: 'POST',
    body: JSON.stringify({ fromUserId, toUserId }),
  });
};

/**
 * Unlike a user
 * @param {number} fromUserId - Current user ID
 * @param {number} toUserId - User to unlike ID
 * @returns {Promise<object>} Success message
 */
export const unlikeUser = async (fromUserId, toUserId) => {
  return fetchAPI(`/likes/${fromUserId}/${toUserId}`, {
    method: 'DELETE',
  });
};

/**
 * Get user's likes
 * @param {number} userId - User ID
 * @returns {Promise<array>} Array of likes
 */
export const getUserLikes = async (userId) => {
  return fetchAPI(`/likes/user/${userId}`);
};

/**
 * Get user's matches (mutual likes)
 * @param {number} userId - User ID
 * @returns {Promise<array>} Array of matches
 */
export const getMatches = async (userId) => {
  return fetchAPI(`/likes/matches/${userId}`);
};

/**
 * Check if user liked another user
 * @param {number} fromUserId - Current user ID
 * @param {number} toUserId - User to check ID
 * @returns {Promise<object>} { liked: boolean }
 */
export const checkLike = async (fromUserId, toUserId) => {
  return fetchAPI(`/likes/${fromUserId}/${toUserId}`);
};

const api = {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  submitPreferences,
  getUserQuestionnaire,
  submitQuestionnaire,
  getQuestionnaires,
  getMyQuestionnaireResponses,
  getQuestionnaireTemplateByType,
  getMyQuestionnaireResponse,
  updateUserQuestionnaire,
  getDiscoveryUsers,
  likeUser,
  unlikeUser,
  getUserLikes,
  getMatches,
  checkLike,
};


export default api;
