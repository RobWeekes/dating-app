import { createSelector } from '@reduxjs/toolkit';

// User selectors
export const selectUser = (state) => state.user;

export const selectUserProfile = createSelector(
  [selectUser],
  (user) => user.profile
);

export const selectUserQuestionnaire = createSelector(
  [selectUser],
  (user) => user.questionnaire
);

export const selectIsUserLoading = createSelector(
  [selectUser],
  (user) => user.isLoading
);

export const selectUserError = createSelector(
  [selectUser],
  (user) => user.error
);

export const selectIsAuthenticated = createSelector(
  [selectUser],
  (user) => user.isAuthenticated
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
