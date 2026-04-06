import { useParams, useNavigate } from 'react-router-dom';
import QuestionnaireForm from '../components/QuestionnaireForm';
import useQuestionnairePage from '../hooks/useQuestionnairePage';
import '../styles/questionnaire-form.css';

/**
 * QuestionnairePage - Generic questionnaire page for all types
 * Works for essential, lifestyle, and MVP questionnaires
 */
function QuestionnairePage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const {
    error,
    initialValues,
    loading,
    questions,
    sectioned,
    submitAnswers,
    submitted,
  } = useQuestionnairePage(type);

  const handleSubmit = async (values) => {
    const result = await submitAnswers(values);
    if (result.success) {
      navigate('/profile');
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
          sectioned={sectioned}
        />
      </div>
    </div>
  );
}

export default QuestionnairePage;
