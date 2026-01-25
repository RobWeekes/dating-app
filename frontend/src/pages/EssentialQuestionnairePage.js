import { useState, useEffect } from 'react';
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
  const [existingResponses, setExistingResponses] = useState(null);
  let questionMap = null; // Cache in closure

  // Fetch existing responses if user has already submitted this questionnaire
  useEffect(() => {
    const fetchExistingResponses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        console.log('📋 Fetching existing questionnaire responses...');
        const response = await fetch('http://localhost:3001/api/questionnaires/type/essential', {
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
          console.log('✅ Existing responses found:', existingData);
          console.log('Answers array:', existingData.Answers);

          // Map answers to question IDs
          const answersMap = {};
          if (existingData.Answers) {
            existingData.Answers.forEach(answer => {
              const questionId = answer.questionId.toString();
              // console.log(`Processing answer - questionId: ${questionId}, value: ${answer.value}`);
              // Check if it's a JSON array (for checkboxes)
              try {
                const parsed = JSON.parse(answer.value);
                answersMap[questionId] = parsed;
                // console.log(`  Parsed as JSON: ${JSON.stringify(parsed)}`);
              } catch {
                // Not JSON, use as-is
                answersMap[questionId] = answer.value;
                // console.log(`  Kept as string: ${answer.value}`);
              }
            });
          }
          // console.log('Final answersMap:', answersMap);
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
        const response = await fetch('http://localhost:3001/api/questionnaires/type/essential');
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
      <EssentialQuestionnaire
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialResponses={existingResponses}
      />
      {isLoading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Submitting...</p>}
    </div>
  );
}

export default EssentialQuestionnairePage;
