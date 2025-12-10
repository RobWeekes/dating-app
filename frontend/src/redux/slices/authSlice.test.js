/**
 * Auth Slice Tests
 * Tests for authentication state management and session persistence
 */
import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  restoreSession,
  setError,
  clearError,
} from './authSlice';

describe('Auth Slice - Session Persistence', () => {
  let initialState;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    initialState = {
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('loginSuccess - Token and User Persistence', () => {
    it('should store token in Redux state on login success', () => {
      const token = 'test-jwt-token-12345';
      const user = { id: 1, email: 'test@example.com', firstName: 'Test' };

      const state = authReducer(initialState, loginSuccess({ token, user }));

      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should persist token to localStorage on login success', () => {
      const token = 'test-jwt-token-12345';
      const user = { id: 1, email: 'test@example.com', firstName: 'Test' };

      authReducer(initialState, loginSuccess({ token, user }));

      expect(localStorage.getItem('authToken')).toBe(token);
    });

    it('should persist user to localStorage on login success', () => {
      const token = 'test-jwt-token-12345';
      const user = { id: 1, email: 'test@example.com', firstName: 'Test' };

      authReducer(initialState, loginSuccess({ token, user }));

      const storedUser = JSON.parse(localStorage.getItem('authUser'));
      expect(storedUser).toEqual(user);
    });

    it('should set isAuthenticated to true on login success', () => {
      const token = 'test-jwt-token-12345';
      const user = { id: 1, email: 'test@example.com', firstName: 'Test' };

      const state = authReducer(initialState, loginSuccess({ token, user }));

      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear error on login success', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const token = 'test-jwt-token-12345';
      const user = { id: 1, email: 'test@example.com', firstName: 'Test' };

      const state = authReducer(stateWithError, loginSuccess({ token, user }));

      expect(state.error).toBeNull();
    });
  });

  describe('registerSuccess - Registration Persistence', () => {
    it('should persist token and user on registration success', () => {
      const token = 'new-user-token-12345';
      const user = { id: 2, email: 'newuser@example.com', firstName: 'New' };

      authReducer(initialState, registerSuccess({ token, user }));

      expect(localStorage.getItem('authToken')).toBe(token);
      expect(JSON.parse(localStorage.getItem('authUser'))).toEqual(user);
    });

    it('should set isAuthenticated to true after registration', () => {
      const token = 'new-user-token-12345';
      const user = { id: 2, email: 'newuser@example.com', firstName: 'New' };

      const state = authReducer(initialState, registerSuccess({ token, user }));

      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logout - Session Cleanup', () => {
    it('should remove token from Redux state on logout', () => {
      const stateWithAuth = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
        isAuthenticated: true,
      };

      const state = authReducer(stateWithAuth, logout());

      expect(state.token).toBeNull();
    });

    it('should remove user from Redux state on logout', () => {
      const stateWithAuth = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
        isAuthenticated: true,
      };

      const state = authReducer(stateWithAuth, logout());

      expect(state.user).toBeNull();
    });

    it('should set isAuthenticated to false on logout', () => {
      const stateWithAuth = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
        isAuthenticated: true,
      };

      const state = authReducer(stateWithAuth, logout());

      expect(state.isAuthenticated).toBe(false);
    });

    it('should remove token from localStorage on logout', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('authUser', JSON.stringify({ id: 1 }));

      const stateWithAuth = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
        isAuthenticated: true,
      };

      authReducer(stateWithAuth, logout());

      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should remove user from localStorage on logout', () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('authUser', JSON.stringify({ id: 1 }));

      const stateWithAuth = {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
        isAuthenticated: true,
      };

      authReducer(stateWithAuth, logout());

      expect(localStorage.getItem('authUser')).toBeNull();
    });
  });

  describe('restoreSession - Session Restoration', () => {
    it('should restore session from localStorage if token exists', () => {
      const token = 'persisted-token';
      const user = { id: 1, email: 'test@example.com' };

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));

      const state = authReducer(initialState, restoreSession());

      expect(state.token).toBe(token);
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should remain unauthenticated if no token in localStorage', () => {
      const state = authReducer(initialState, restoreSession());

      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should restore user data from localStorage', () => {
      const user = { id: 1, email: 'test@example.com', firstName: 'Test', age: 25 };

      localStorage.setItem('authToken', 'token');
      localStorage.setItem('authUser', JSON.stringify(user));

      const state = authReducer(initialState, restoreSession());

      expect(state.user).toEqual(user);
      expect(state.user.firstName).toBe('Test');
      expect(state.user.age).toBe(25);
    });

    it('should not restore if only token exists without user', () => {
      localStorage.setItem('authToken', 'token');
      // No user in localStorage

      const state = authReducer(initialState, restoreSession());

      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
    });

    it('should handle corrupted user JSON gracefully', () => {
      localStorage.setItem('authToken', 'token');
      localStorage.setItem('authUser', 'invalid-json');

      expect(() => {
        authReducer(initialState, restoreSession());
      }).toThrow();
    });
  });

  describe('updateUser - User Data Persistence', () => {
    it('should update user in Redux state', () => {
      const initialAuthState = {
        token: 'token',
        user: { id: 1, email: 'test@example.com', firstName: 'Test' },
        isAuthenticated: true,
      };

      const updatedUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Updated',
      };

      const state = authReducer(initialAuthState, updateUser(updatedUser));

      expect(state.user).toEqual(updatedUser);
      expect(state.user.firstName).toBe('Updated');
    });

    it('should persist updated user to localStorage', () => {
      const updatedUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Updated',
      };

      authReducer(
        { token: 'token', user: { id: 1 }, isAuthenticated: true },
        updateUser(updatedUser)
      );

      const storedUser = JSON.parse(localStorage.getItem('authUser'));
      expect(storedUser).toEqual(updatedUser);
    });
  });

  describe('loginStart & loginFailure - Loading States', () => {
    it('should set isLoading to true on login start', () => {
      const state = authReducer(initialState, loginStart());

      expect(state.isLoading).toBe(true);
    });

    it('should clear error on login start', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };

      const state = authReducer(stateWithError, loginStart());

      expect(state.error).toBeNull();
    });

    it('should set error on login failure', () => {
      const state = authReducer(initialState, loginFailure('Invalid credentials'));

      expect(state.error).toBe('Invalid credentials');
      expect(state.isLoading).toBe(false);
    });

    it('should not clear token on login failure', () => {
      const stateWithAuth = {
        token: 'existing-token',
        user: { id: 1 },
        isAuthenticated: true,
      };

      const state = authReducer(stateWithAuth, loginFailure('Error'));

      expect(state.token).toBe('existing-token');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should set error message', () => {
      const state = authReducer(initialState, setError('Custom error'));

      expect(state.error).toBe('Custom error');
    });

    it('should clear error message', () => {
      const stateWithError = { ...initialState, error: 'Some error' };

      const state = authReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });
  });

  describe('Multi-user Scenarios', () => {
    it('should handle switching between different users', () => {
      // User 1 logs in
      let state = authReducer(initialState, loginSuccess({
        token: 'user1-token',
        user: { id: 1, email: 'user1@example.com' },
      }));

      expect(state.user.id).toBe(1);
      expect(localStorage.getItem('authToken')).toBe('user1-token');

      // User 1 logs out
      state = authReducer(state, logout());
      expect(state.isAuthenticated).toBe(false);

      // User 2 logs in
      state = authReducer(initialState, loginSuccess({
        token: 'user2-token',
        user: { id: 2, email: 'user2@example.com' },
      }));

      expect(state.user.id).toBe(2);
      expect(localStorage.getItem('authToken')).toBe('user2-token');
    });

    it('should properly switch users without data leakage', () => {
      const user1 = { id: 1, email: 'user1@example.com', bio: 'User 1 bio' };
      const user2 = { id: 2, email: 'user2@example.com', bio: 'User 2 bio' };

      // User 1 logged in
      let state = authReducer(initialState, loginSuccess({
        token: 'token1',
        user: user1,
      }));

      // User 1 logs out
      state = authReducer(state, logout());

      // User 2 logs in
      state = authReducer(state, loginSuccess({
        token: 'token2',
        user: user2,
      }));

      expect(state.user).toEqual(user2);
      expect(state.user.bio).toBe('User 2 bio');
      expect(state.user.email).toBe('user2@example.com');
      expect(state.token).toBe('token2');
    });
  });
});
