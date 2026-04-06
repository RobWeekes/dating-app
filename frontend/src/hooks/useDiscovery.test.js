import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import discoveryReducer from '../redux/slices/discoverySlice';
import { getDiscoveryUsers, likeUser as likeUserAPI } from '../services/api';
import useDiscovery from './useDiscovery';

jest.mock('../services/api', () => ({
  getDiscoveryUsers: jest.fn(),
  likeUser: jest.fn(),
}));

const createWrapper = () => {
  const store = configureStore({
    reducer: {
      discovery: discoveryReducer,
    },
  });

  // eslint-disable-next-line react/prop-types
  return ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('useDiscovery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads discovery users and exposes first current user', async () => {
    getDiscoveryUsers.mockResolvedValueOnce([
      { id: 10, firstName: 'Ava' },
      { id: 11, firstName: 'Mia' },
    ]);

    const { result } = renderHook(() => useDiscovery(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.users).toHaveLength(2);
    });

    expect(result.current.currentUser.id).toBe(10);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hasMoreUsers).toBe(true);
  });

  it('likes user and advances to next user', async () => {
    getDiscoveryUsers.mockResolvedValueOnce([
      { id: 20, firstName: 'Noah' },
      { id: 21, firstName: 'Liam' },
    ]);
    likeUserAPI.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useDiscovery(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleLike(20);
    });

    expect(likeUserAPI).toHaveBeenCalledWith(7, 20);
    expect(result.current.likes).toContain(20);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentUser.id).toBe(21);
  });

  it('passes user and advances index', async () => {
    getDiscoveryUsers.mockResolvedValueOnce([
      { id: 30, firstName: 'Olivia' },
      { id: 31, firstName: 'Emma' },
    ]);

    const { result } = renderHook(() => useDiscovery(9), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handlePass(30);
    });

    expect(result.current.passes).toContain(30);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentUser.id).toBe(31);
  });
});
