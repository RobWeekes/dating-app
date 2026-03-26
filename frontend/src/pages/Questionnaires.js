import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireForm from '../components/QuestionnaireForm';
import { submitQuestionnaire } from '../services/api';
import '../styles/questionnaire-form.css';

const QUESTION_COUNTS = { essential: 27, essential2: 29, lifestyle: 21, MVP: 50, communication: 18, lifestage: 16, cultural: 19, romance: 17, future: 18 };

/**
 * Questionnaires - Summary page listing all available questionnaires
 * with completion status. Clicking one opens the form inline.
 */
function Questionnaires() {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected questionnaire state (inline form)
  const [selectedType, setSelectedType] = useState(null);
  const [formQuestions, setFormQuestions] = useState([]);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const token = localStorage.getItem('authToken');

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = { Authorization: `Bearer ${token}` };

      const [qRes, rRes] = await Promise.all([
        fetch('http://localhost:3001/api/questionnaires', { headers }),
        fetch('http://localhost:3001/api/questionnaires/responses/me', { headers }),
      ]);

      if (!qRes.ok) throw new Error('Failed to load questionnaires');

      const qData = await qRes.json();
      const rData = rRes.ok ? await rRes.json() : [];

      setQuestionnaires(qData);
      setResponses(rData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const getResponseForQuestionnaire = (questionnaireId) => {
    return responses.find(r => r.questionnaireId === questionnaireId);
  };

  const handleSelect = async (questionnaire) => {
    try {
      setFormLoading(true);
      setSubmitError(null);
      setSelectedType(questionnaire.type);

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch full template with questions
      const tRes = await fetch(
        `http://localhost:3001/api/questionnaires/type/${questionnaire.type}`,
        { headers }
      );
      if (!tRes.ok) throw new Error('Failed to load questionnaire');
      const template = await tRes.json();
      const sorted = (template.Questions || []).sort((a, b) => a.order - b.order);
      setFormQuestions(sorted);

      // Fetch existing responses
      const rRes = await fetch(
        `http://localhost:3001/api/questionnaires/responses/user/me/questionnaire/${questionnaire.id}`,
        { headers }
      );
      if (rRes.ok) {
        const data = await rRes.json();
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
        setFormInitialValues(values);
      } else {
        setFormInitialValues({});
      }
    } catch (err) {
      setSubmitError(err.message);
      setSelectedType(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitError(null);
      await submitQuestionnaire({ type: selectedType, responses: values });
      setSelectedType(null);
      fetchSummary();
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit questionnaire');
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setSubmitError(null);
  };

  if (loading) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <p>Loading questionnaires...</p>
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

  // Inline form view
  if (selectedType) {
    if (formLoading) {
      return (
        <div className="questionnaire-page">
          <div className="questionnaire-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <p>Loading questionnaire...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="questionnaire-page">
        <div className="questionnaire-container">
          <button className="btn-back" onClick={handleBack}>
            ← Back to Questionnaires
          </button>
          {submitError && <p className="error-text">{submitError}</p>}
          <QuestionnaireForm
            questions={formQuestions}
            initialValues={formInitialValues}
            onSubmit={handleSubmit}
            onCancel={handleBack}
            sectioned={selectedType === 'MVP'}
          />
        </div>
      </div>
    );
  }

  // Summary view
  const completedCount = questionnaires.filter(q => {
    const r = getResponseForQuestionnaire(q.id);
    return r && r.status === 'completed';
  }).length;

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-container">
        <div className="summary-header">
          <h1>📝 Questionnaires</h1>
          <p className="summary-subtitle">
            Complete questionnaires to improve your compatibility matches.
          </p>
          <p className="summary-progress">
            {completedCount} of {questionnaires.length} completed
          </p>
        </div>

        <div className="summary-list">
          {questionnaires.map(q => {
            const response = getResponseForQuestionnaire(q.id);
            const isCompleted = response && response.status === 'completed';
            const completedDate = isCompleted && response.completedAt
              ? new Date(response.completedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })
              : null;

            return (
              <div
                key={q.id}
                className={`summary-card ${isCompleted ? 'completed' : 'pending'}`}
                onClick={() => handleSelect(q)}
              >
                <div className="summary-card-content">
                  <div className="summary-card-info">
                    <h3>{q.title}</h3>
                    <p className="summary-card-description">{q.description}</p>
                    <span className="summary-card-meta">
                      {QUESTION_COUNTS[q.type] || q.Questions?.length || '—'} questions
                    </span>
                  </div>
                  <div className="summary-card-status">
                    {isCompleted ? (
                      <>
                        <span className="status-badge status-completed">✓ Completed</span>
                        <span className="status-date">Completed {completedDate}</span>
                        <span className="status-action">Click to update</span>
                      </>
                    ) : (
                      <>
                        <span className="status-badge status-pending">Not started</span>
                        <span className="status-action">Click to complete</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Questionnaires;
