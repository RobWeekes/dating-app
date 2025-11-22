import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
  likes: [],
  passes: [],
};

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.currentIndex = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    likeUser: (state, action) => {
      const userId = action.payload;
      if (!state.likes.includes(userId)) {
        state.likes.push(userId);
      }
      state.currentIndex += 1;
    },
    passUser: (state, action) => {
      const userId = action.payload;
      if (!state.passes.includes(userId)) {
        state.passes.push(userId);
      }
      state.currentIndex += 1;
    },
    resetDiscovery: (state) => {
      state.users = [];
      state.currentIndex = 0;
      state.likes = [];
      state.passes = [];
      state.error = null;
    },
  },
});

export const {
  setUsers,
  setLoading,
  setError,
  likeUser,
  passUser,
  resetDiscovery,
} = discoverySlice.actions;

export default discoverySlice.reducer;
