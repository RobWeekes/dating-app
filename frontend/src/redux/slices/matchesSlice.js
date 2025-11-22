import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  matches: [],
  isLoading: false,
  error: null,
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    removeMatch: (state, action) => {
      const matchId = action.payload;
      state.matches = state.matches.filter((match) => match.id !== matchId);
    },
  },
});

export const {
  setMatches,
  setLoading,
  setError,
  removeMatch,
} = matchesSlice.actions;

export default matchesSlice.reducer;
