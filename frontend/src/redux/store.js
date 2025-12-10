import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import preferencesReducer from './slices/preferencesSlice';
import discoveryReducer from './slices/discoverySlice';
import matchesReducer from './slices/matchesSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    preferences: preferencesReducer,
    discovery: discoveryReducer,
    matches: matchesReducer,
    ui: uiReducer,
  },
});

export default store;
