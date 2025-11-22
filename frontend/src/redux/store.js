import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import preferencesReducer from './slices/preferencesSlice';
import discoveryReducer from './slices/discoverySlice';
import matchesReducer from './slices/matchesSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    preferences: preferencesReducer,
    discovery: discoveryReducer,
    matches: matchesReducer,
    ui: uiReducer,
  },
});

export default store;
