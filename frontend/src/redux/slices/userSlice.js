import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    id: 1,
    email: 'larry.dalton0@datingapp.com',
    firstName: 'Larry',
    lastName: 'Dalton',
    age: 29,
    bio: 'Gym rat dedicated to health and fitness.',
    location: 'Glendale, Los Angeles, CA',
    profilePhotoUrl: 'https://i.pravatar.cc/150?img=0',
    createdAt: '2025-11-20T01:07:53.000Z',
    updatedAt: '2025-11-20T01:07:53.000Z',
  },
  questionnaire: null,
  isLoading: false,
  error: null,
  isAuthenticated: true,
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
