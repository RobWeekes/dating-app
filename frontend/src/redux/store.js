import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import preferencesReducer from './slices/preferencesSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    preferences: preferencesReducer,
    ui: uiReducer,
  },
});

export default store;
