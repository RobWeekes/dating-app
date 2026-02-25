import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionnaireForm from '../components/QuestionnaireForm';
import { submitQuestionnaire } from '../services/api';
import '../styles/questionnaire-form.css';

/**
 * QuestionnairePage - Generic questionnaire page for all types
 * Works for essential, lifestyle, and MVP questionnaires
 */
function QuestionnairePage() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch questionnaire template on mount
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3001/api/questionnaires/type/${type}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load questionnaire: ${response.status}`);
        }

        const template = await response.json();
        const sorted = (template.Questions || []).sort((a, b) => a.order - b.order);
        setQuestions(sorted);
        setQuestionnaireId(template.id);
      } catch (err) {
        setError(err.message || 'Failed to load questionnaire');
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [type]);

  // Fetch existing responses after questionnaireId is set
  useEffect(() => {
    if (!questionnaireId) return;

    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3001/api/questionnaires/responses/user/me/questionnaire/${questionnaireId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const values = {};

          if (data.Answers) {
            data.Answers.forEach(answer => {
              let val;
              try {
                val = JSON.parse(answer.value);
              } catch {
                const num = parseInt(answer.value);
                val = isNaN(num) ? answer.value : num;
              }
              values[answer.questionId] = val;
            });
          }

          setInitialValues(values);
        }
        // 404 means no existing responses - that's fine
      } catch (err) {
        console.error('Error fetching existing responses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [questionnaireId]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      setError(null);

      await submitQuestionnaire({ type, responses: values });

      setSubmitted(true);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to submit questionnaire');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <p>Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <h2>Error</h2>
          <p style={{ color: '#ff6b6b' }}>{error}</p>
          <button className="btn-secondary" onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <h2>✅ Questionnaire Submitted!</h2>
          <p>Your responses have been saved successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-container">
        <QuestionnaireForm
          questions={questions}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          sectioned={type === 'MVP'}
        />
      </div>
    </div>
  );
}

export default QuestionnairePage;
