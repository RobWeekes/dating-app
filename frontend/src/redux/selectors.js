import { createSelector } from '@reduxjs/toolkit';

// Auth selectors
export const selectAuth = (state) => state.auth;

export const selectAuthUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectAuthToken = createSelector(
  [selectAuth],
  (auth) => auth.token
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

// User selectors (now using auth state for profile)
export const selectUser = (state) => state.user;

// Directly use selectAuthUser instead of wrapping it with createSelector
// since it's just returning the input without transformation
export const selectUserProfile = selectAuthUser;

export const selectIsUserLoading = createSelector(
  [selectUser],
  (user) => user.isLoading
);

export const selectUserError = createSelector(
  [selectUser],
  (user) => user.error
);

// Preferences selectors
export const selectPreferences = (state) => state.preferences;

export const selectAgeRange = createSelector(
  [selectPreferences],
  (preferences) => preferences.ageRange
);

export const selectLocation = createSelector(
  [selectPreferences],
  (preferences) => preferences.location
);

export const selectInterests = createSelector(
  [selectPreferences],
  (preferences) => preferences.interests
);

export const selectIsPreferencesLoading = createSelector(
  [selectPreferences],
  (preferences) => preferences.isLoading
);

export const selectPreferencesError = createSelector(
  [selectPreferences],
  (preferences) => preferences.error
);

// UI selectors
export const selectUI = (state) => state.ui;

export const selectCurrentPage = createSelector(
  [selectUI],
  (ui) => ui.currentPage
);

export const selectIsModalOpen = createSelector(
  [selectUI],
  (ui) => ui.isModalOpen
);

export const selectModalType = createSelector(
  [selectUI],
  (ui) => ui.modalType
);

export const selectNotification = createSelector(
  [selectUI],
  (ui) => ui.notification
);

export const selectIsUILoading = createSelector(
  [selectUI],
  (ui) => ui.isLoading
);

export const selectSidebarOpen = createSelector(
  [selectUI],
  (ui) => ui.sidebarOpen
);
