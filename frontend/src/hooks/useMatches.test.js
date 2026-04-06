import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import matchesReducer from '../redux/slices/matchesSlice';
import { getMatches } from '../services/api';
import useMatches from './useMatches';

jest.mock('../services/api', () => ({
  getMatches: jest.fn(),
}));

const createWrapper = () => {
  const store = configureStore({
    reducer: {
      matches: matchesReducer,
    },
  });

  // eslint-disable-next-line react/prop-types
  return ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('useMatches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads matches for a user', async () => {
    getMatches.mockResolvedValueOnce([
      { id: 1, fromUser: { id: 22, firstName: 'Chris' } },
      { id: 2, fromUser: { id: 23, firstName: 'Sam' } },
    ]);

    const { result } = renderHook(() => useMatches(9), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getMatches).toHaveBeenCalledWith(9);
    expect(result.current.matches).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('sets a friendly error when loading matches fails', async () => {
    getMatches.mockRejectedValueOnce(new Error('Network down'));

    const { result } = renderHook(() => useMatches(12), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.matches).toEqual([]);
    expect(result.current.error).toBe('Failed to load matches. Please try again.');
  });
});
