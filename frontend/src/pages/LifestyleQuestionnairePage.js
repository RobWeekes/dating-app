import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LifestyleQuestionnaire from '../components/LifestyleQuestionnaire';

/**
 * LifestyleQuestionnairePage
 * Wrapper page component for the Lifestyle Questionnaire
 * Handles form submission and navigation
 */
function LifestyleQuestionnairePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingResponses, setExistingResponses] = useState(null);
  let questionMap = null; // Cache in closure

  // Fetch existing responses if user has already submitted this questionnaire
  useEffect(() => {
    const fetchExistingResponses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        console.log('📋 Fetching existing lifestyle questionnaire responses...');
        const response = await fetch('http://localhost:3001/api/questionnaires/type/lifestyle', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        // Get the questionnaire template to find the ID
        const template = await response.json();
        const questionnaireId = template.id;

        // Fetch user's responses for this questionnaire
        const userResponse = await fetch(
          `http://localhost:3001/api/questionnaires/responses/user/me/questionnaire/${questionnaireId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (userResponse.ok) {
          const existingData = await userResponse.json();
          console.log('✅ Existing lifestyle responses found:', existingData);
          console.log('Answers array:', existingData.Answers);

          // Map answers to question order (1-21) not database ID (28-48)
          const answersMap = {};
          if (existingData.Answers) {
            existingData.Answers.forEach(answer => {
              // Use the question's order field (1-21) as the key, not the database ID
              const questionOrder = answer.Question?.order?.toString() || answer.questionId.toString();
              // Check if it's a JSON array (for checkboxes)
              try {
                const parsed = JSON.parse(answer.value);
                answersMap[questionOrder] = parsed;
              } catch {
                // Not JSON, use as-is
                answersMap[questionOrder] = answer.value;
              }
            });
          }
          setExistingResponses(answersMap);
        }
      } catch (err) {
        console.error('❌ Error fetching existing responses:', err);
        // Don't set error state, just continue with blank form
      }
    };

    fetchExistingResponses();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📝 Form submission started');

      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Fetch template if not cached
      if (!questionMap) {
        console.log('📋 Fetching questionnaire template...');
        const response = await fetch('http://localhost:3001/api/questionnaires/type/lifestyle', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch questionnaire');
        
        const template = await response.json();
        console.log('✅ Template fetched, questions:', template.Questions?.length);
        
        // Create map of question order -> actual question ID
        if (template.Questions) {
          questionMap = {};
          template.Questions.forEach(q => {
            questionMap[q.order] = q.id;
          });
          console.log('Question map created:', questionMap);
        }
      }

      if (!questionMap) {
        throw new Error('Could not load questionnaire template');
      }

      // Map form field indices to actual question IDs
      const mappedResponses = {};
      Object.entries(data.responses).forEach(([fieldIndex, value]) => {
        const actualQuestionId = questionMap[fieldIndex];
        if (actualQuestionId) {
          mappedResponses[actualQuestionId] = value;
        }
      });

      console.log('📍 Mapped responses:', mappedResponses);
      console.log('🌐 Sending POST to /api/questionnaires');

      // Submit questionnaire to API
      const response = await fetch('http://localhost:3001/api/questionnaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: data.type,
          relationshipType: data.relationshipType,
          responses: mappedResponses,
        }),
      });

      console.log('📡 Response status:', response.status);

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
      <LifestyleQuestionnaire
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialResponses={existingResponses}
      />
      {isLoading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Submitting...</p>}
    </div>
  );
}

export default LifestyleQuestionnairePage;
