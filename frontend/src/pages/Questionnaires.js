import { useNavigate } from 'react-router-dom';
import QuestionnaireForm from '../components/QuestionnaireForm';
import useQuestionnaires from '../hooks/useQuestionnaires';
import '../styles/questionnaire-form.css';

/**
 * Questionnaires - Summary page listing all available questionnaires
 * with completion status. Clicking one opens the form inline.
 */
function Questionnaires() {
  const navigate = useNavigate();
  const {
    completedCount,
    error,
    formInitialValues,
    formLoading,
    formQuestions,
    loading,
    openQuestionnaire,
    questionCounts,
    questionnaires,
    responseByQuestionnaireId,
    selectedType,
    submitError,
    submitSelectedQuestionnaire,
    closeQuestionnaire,
  } = useQuestionnaires();

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
          <button className="btn-back" onClick={closeQuestionnaire}>
            ← Back to Questionnaires
          </button>
          {submitError && <p className="error-text">{submitError}</p>}
          <QuestionnaireForm
            questions={formQuestions}
            initialValues={formInitialValues}
            onSubmit={submitSelectedQuestionnaire}
            onCancel={closeQuestionnaire}
            sectioned={selectedType === 'MVP'}
          />
        </div>
      </div>
    );
  }

  // Summary view
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
            const response = responseByQuestionnaireId[q.id];
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
                onClick={() => openQuestionnaire(q)}
              >
                <div className="summary-card-content">
                  <div className="summary-card-info">
                    <h3>{q.title}</h3>
                    <p className="summary-card-description">{q.description}</p>
                    <span className="summary-card-meta">
                      {questionCounts[q.type] || q.Questions?.length || '—'} questions
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
