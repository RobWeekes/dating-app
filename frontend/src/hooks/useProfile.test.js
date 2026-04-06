import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import authReducer from '../redux/slices/authSlice';
import userReducer from '../redux/slices/userSlice';
import { updateUserProfile } from '../services/api';
import useProfile from './useProfile';

jest.mock('../services/api', () => ({
  updateUserProfile: jest.fn(),
}));

const createWrapper = (preloadedState) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
    },
    preloadedState,
  });

  // eslint-disable-next-line react/prop-types
  return ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('validates form and blocks save when required fields are missing', async () => {
    const userProfile = {
      id: 1,
      email: '',
      firstName: '',
      lastName: '',
    };

    const { result } = renderHook(() => useProfile(userProfile), {
      wrapper: createWrapper(),
    });

    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveProfile();
    });

    expect(saveResult.success).toBe(false);
    expect(result.current.formErrors.email).toBe('Email is required');
    expect(result.current.formErrors.firstName).toBe('First name is required');
    expect(result.current.formErrors.lastName).toBe('Last name is required');
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it('saves profile and updates auth user on success', async () => {
    const userProfile = {
      id: 7,
      email: 'user@example.com',
      firstName: 'Alex',
      lastName: 'Stone',
      age: 30,
      location: 'Austin',
    };

    const updatedProfile = {
      ...userProfile,
      location: 'Seattle',
      bio: 'Updated bio',
    };

    updateUserProfile.mockResolvedValueOnce(updatedProfile);

    const { result } = renderHook(() => useProfile(userProfile), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'location', value: 'Seattle' },
      });
      result.current.handleInputChange({
        target: { name: 'bio', value: 'Updated bio' },
      });
    });

    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveProfile();
    });

    expect(saveResult.success).toBe(true);
    expect(updateUserProfile).toHaveBeenCalledWith(7, expect.objectContaining({
      location: 'Seattle',
      bio: 'Updated bio',
    }));
    expect(localStorage.getItem('authUser')).toBe(JSON.stringify(updatedProfile));
    expect(result.current.error).toBeNull();
  });
});
