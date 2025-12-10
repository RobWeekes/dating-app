import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questionnaire: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserQuestionnaire: (state, action) => {
      state.questionnaire = action.payload;
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
    clearUserData: (state) => {
      state.questionnaire = null;
      state.error = null;
    },
  },
});

export const {
  setUserQuestionnaire,
  updateUserQuestionnaire,
  setLoading,
  setError,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
