import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  questionnaire: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setUserQuestionnaire: (state, action) => {
      state.questionnaire = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateUserQuestionnaire: (state, action) => {
      state.questionnaire = { ...state.questionnaire, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.questionnaire = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setUserProfile,
  setUserQuestionnaire,
  updateUserProfile,
  updateUserQuestionnaire,
  setLoading,
  setError,
  setAuthenticated,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
