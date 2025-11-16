import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ageRange: { min: 18, max: 100 },
  location: '',
  interests: [],
  isLoading: false,
  error: null,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setPreferences: (state, action) => {
      return { ...state, ...action.payload, isLoading: false };
    },
    setAgeRange: (state, action) => {
      state.ageRange = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setInterests: (state, action) => {
      state.interests = action.payload;
    },
    addInterest: (state, action) => {
      if (!state.interests.includes(action.payload)) {
        state.interests.push(action.payload);
      }
    },
    removeInterest: (state, action) => {
      state.interests = state.interests.filter((interest) => interest !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetPreferences: (state) => {
      return initialState;
    },
  },
});

export const {
  setPreferences,
  setAgeRange,
  setLocation,
  setInterests,
  addInterest,
  removeInterest,
  setLoading,
  setError,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
