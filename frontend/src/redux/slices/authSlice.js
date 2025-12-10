import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('authToken') || null,
  user: localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Register user
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      // Persist to localStorage
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Login user
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      // Persist to localStorage
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout user
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },

    // Update current user
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('authUser', JSON.stringify(action.payload));
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Restore session from localStorage
    restoreSession: (state) => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  setError,
  clearError,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;
