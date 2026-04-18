import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook to fetch questionnaire metadata from API
 * This fetches computed counts and validation from the backend,
 * eliminating the need for hardcoded values in the frontend.
 */
function useQuestionnaireMetadata(type) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type) {
      setError('Type is required');
      setLoading(false);
      return;
    }

    let isCurrent = true;

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/questionnaires/metadata/${type}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }

        const data = await response.json();
        if (isCurrent) {
          setMetadata(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
          // Provide a default in case metadata endpoint fails
          setMetadata({ totalQuestions: null, sections: {} });
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchMetadata();

    return () => {
      isCurrent = false;
    };
  }, [type]);

  return { metadata, loading, error };
}

export default useQuestionnaireMetadata;
