import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import preferencesReducer from '../redux/slices/preferencesSlice';
import usePreferences from './usePreferences';
import {
  getUserPreferences,
  submitPreferences,
  updateUserPreferences,
} from '../services/api';

jest.mock('../services/api', () => ({
  getUserPreferences: jest.fn(),
  submitPreferences: jest.fn(),
  updateUserPreferences: jest.fn(),
}));

const createDeferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const createWrapper = () => {
  const store = configureStore({
    reducer: {
      preferences: preferencesReducer,
    },
  });

  // eslint-disable-next-line react/prop-types
  return ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('usePreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ignores stale load responses when userId changes quickly', async () => {
    const firstRequest = createDeferred();

    getUserPreferences
      .mockImplementationOnce(() => firstRequest.promise)
      .mockResolvedValueOnce({
        id: 22,
        userId: 2,
        minAge: 30,
        maxAge: 45,
        location: 'Seattle',
        locationRadius: 20,
        interests: ['Travel'],
        relationshipType: 'Monogamous',
      });

    const { result, rerender } = renderHook(
      ({ userId }) => usePreferences(userId),
      {
        initialProps: { userId: 1 },
        wrapper: createWrapper(),
      }
    );

    rerender({ userId: 2 });

    await waitFor(() => {
      expect(result.current.formData.minAge).toBe(30);
      expect(result.current.existingPreferences.userId).toBe(2);
    });

    await act(async () => {
      firstRequest.resolve({
        id: 11,
        userId: 1,
        minAge: 18,
        maxAge: 22,
        location: 'Austin',
        locationRadius: 10,
        interests: ['Gaming'],
        relationshipType: 'Any',
      });
      await Promise.resolve();
    });

    expect(result.current.formData.minAge).toBe(30);
    expect(result.current.existingPreferences.userId).toBe(2);
  });

  it('creates preferences for new users via submitPreferences', async () => {
    getUserPreferences.mockRejectedValueOnce(new Error('Preference not found for this user'));
    submitPreferences.mockResolvedValueOnce({
      id: 101,
      userId: 5,
      minAge: 25,
      maxAge: 38,
      location: 'San Diego',
      locationRadius: 60,
      interests: ['Travel', 'Fitness'],
      relationshipType: 'Monogamous',
    });

    const { result } = renderHook(() => usePreferences(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(getUserPreferences).toHaveBeenCalledWith(5);
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setFormData((prev) => ({
        ...prev,
        minAge: 25,
        maxAge: 38,
        location: 'San Diego',
        locationRadius: 60,
        interests: ['Travel', 'Fitness'],
        relationshipType: 'Monogamous',
      }));
    });

    let saveResult;
    await act(async () => {
      saveResult = await result.current.savePreferences();
    });

    expect(saveResult.success).toBe(true);
    expect(submitPreferences).toHaveBeenCalledWith({
      userId: 5,
      minAge: 25,
      maxAge: 38,
      location: 'San Diego',
      locationRadius: 60,
      interests: ['Travel', 'Fitness'],
      relationshipType: 'Monogamous',
    });
    expect(updateUserPreferences).not.toHaveBeenCalled();
    expect(result.current.existingPreferences).toEqual(
      expect.objectContaining({ id: 101, userId: 5 })
    );
  });

  it('updates preferences when existing preferences are loaded', async () => {
    getUserPreferences.mockResolvedValueOnce({
      id: 33,
      userId: 7,
      minAge: 24,
      maxAge: 39,
      location: 'Chicago',
      locationRadius: 45,
      interests: ['Reading'],
      relationshipType: 'Any',
    });

    updateUserPreferences.mockResolvedValueOnce({
      id: 33,
      userId: 7,
      minAge: 26,
      maxAge: 39,
      location: 'Chicago',
      locationRadius: 45,
      interests: ['Reading', 'Art & Music'],
      relationshipType: 'Monogamous',
    });

    const { result } = renderHook(() => usePreferences(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.existingPreferences).toEqual(
        expect.objectContaining({ id: 33, userId: 7 })
      );
    });

    act(() => {
      result.current.setFormData((prev) => ({
        ...prev,
        minAge: 26,
        interests: ['Reading', 'Art & Music'],
        relationshipType: 'Monogamous',
      }));
    });

    let saveResult;
    await act(async () => {
      saveResult = await result.current.savePreferences();
    });

    expect(saveResult.success).toBe(true);
    expect(updateUserPreferences).toHaveBeenCalledWith(7, {
      userId: 7,
      minAge: 26,
      maxAge: 39,
      location: 'Chicago',
      locationRadius: 45,
      interests: ['Reading', 'Art & Music'],
      relationshipType: 'Monogamous',
    });
    expect(submitPreferences).not.toHaveBeenCalled();
  });
});
