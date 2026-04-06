import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  likeUser as likeUserAction,
  passUser as passUserAction,
  setError,
  setLoading,
  setUsers,
} from '../redux/slices/discoverySlice';
import { getDiscoveryUsers, likeUser as likeUserAPI } from '../services/api';

const useDiscovery = (userId) => {
  const dispatch = useDispatch();
  const discoveryState = useSelector((state) => state.discovery);
  const { users, currentIndex, isLoading, error, likes, passes } = discoveryState;

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) {
      dispatch(setLoading(false));
      dispatch(setError(null));
      return;
    }

    let isCurrent = true;

    const loadUsers = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const matchingUsers = await getDiscoveryUsers(userId);
        if (!isCurrent) {
          return;
        }

        dispatch(setUsers(matchingUsers));
      } catch (err) {
        if (!isCurrent) {
          return;
        }

        dispatch(setError('Failed to load users. Please check your preferences.'));
      } finally {
        if (isCurrent) {
          dispatch(setLoading(false));
        }
      }
    };

    loadUsers();

    return () => {
      isCurrent = false;
    };
  }, [dispatch, userId]);

  const handleLike = useCallback(async (discoveryUserId) => {
    if (!userId || !discoveryUserId) {
      return;
    }

    try {
      setIsSubmitting(true);
      await likeUserAPI(userId, discoveryUserId);
      dispatch(likeUserAction(discoveryUserId));
    } catch {
      // Keep optimistic behavior so discovery flow never stalls on transient network errors.
      dispatch(likeUserAction(discoveryUserId));
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, userId]);

  const handlePass = useCallback((discoveryUserId) => {
    if (!discoveryUserId) {
      return;
    }

    dispatch(passUserAction(discoveryUserId));
  }, [dispatch]);

  const currentUser = useMemo(() => users[currentIndex], [currentIndex, users]);
  const hasMoreUsers = useMemo(() => currentIndex < users.length, [currentIndex, users.length]);

  return {
    currentIndex,
    currentUser,
    error,
    hasMoreUsers,
    handleLike,
    handlePass,
    isLoading,
    isSubmitting,
    likes,
    passes,
    users,
  };
};

export default useDiscovery;
