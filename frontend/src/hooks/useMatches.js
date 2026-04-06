import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, setMatches } from '../redux/slices/matchesSlice';
import { getMatches } from '../services/api';

const useMatches = (userId) => {
  const dispatch = useDispatch();
  const matchesState = useSelector((state) => state.matches);
  const { matches, isLoading, error } = matchesState;

  const loadMatches = useCallback(async () => {
    if (!userId) {
      dispatch(setLoading(false));
      dispatch(setError(null));
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const matchedUsers = await getMatches(userId);
      dispatch(setMatches(matchedUsers));
    } catch {
      dispatch(setError('Failed to load matches. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return {
    error,
    isLoading,
    loadMatches,
    matches,
  };
};

export default useMatches;
