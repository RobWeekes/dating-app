import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EssentialQuestionnaire from '../components/EssentialQuestionnaire';

/**
 * EssentialQuestionnairePage
 * Wrapper page component for the Essential Questionnaire
 * Handles form submission and navigation
 */
function EssentialQuestionnairePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      // DEBUG: Log submission attempt
      console.log('📝 Form submission started');
      console.log('Data being submitted:', data);

      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // DEBUG: Log API call
      console.log('🌐 Sending POST to /api/questionnaires');

      // Submit questionnaire to API
      const response = await fetch('http://localhost:3001/api/questionnaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', {
        'content-type': response.headers.get('content-type'),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Questionnaire saved successfully:', result);

      // Redirect to profile
      navigate('/profile');
    } catch (err) {
      console.error('❌ Error submitting questionnaire:', err);
      setError(err.message || 'Failed to save questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
      <EssentialQuestionnaire
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      {isLoading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Submitting...</p>}
    </div>
  );
}

export default EssentialQuestionnairePage;
