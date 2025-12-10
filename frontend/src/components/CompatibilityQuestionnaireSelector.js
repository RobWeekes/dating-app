import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../redux/selectors';
import { submitCompatibilityQuestionnaire } from '../services/api';
import CompatibilityQuestionnaireShort from './CompatibilityQuestionnaireShort';
import CompatibilityQuestionnaireMediumCasual from './CompatibilityQuestionnaireMediumCasual';
import CompatibilityQuestionnaireLongTermShort from './CompatibilityQuestionnairesLongTermShort';
import Button from './Button';
import '../styles/questionnaire-selector.css';

/**
 * Compatibility Questionnaire Selector
 * Allows users to choose which questionnaire to complete based on their relationship goals
 */
function CompatibilityQuestionnaireSelector() {
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  
  const [step, setStep] = useState('choose'); // choose, select-length, questionnaire
  const [relationshipType, setRelationshipType] = useState(null);
  const [questionnnaireLength, setQuestionnaireLength] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const questionnaires = {
    CASUAL: {
      label: 'Casual / Short-Term Dating',
      description: 'Find compatible partners for casual dating and short-term relationships',
      icon: '💫',
      options: [
        {
          id: 'SHORT',
          label: 'Quick (10 questions)',
          description: 'Essential questions about compatibility. Takes ~5 minutes.',
          time: '5 min',
          component: CompatibilityQuestionnaireShort,
        },
        {
          id: 'MEDIUM',
          label: 'Detailed (25 questions)',
          description: 'Comprehensive assessment of casual dating compatibility. Takes ~15 minutes.',
          time: '15 min',
          component: CompatibilityQuestionnaireMediumCasual,
        },
      ],
    },
    LONG_TERM: {
      label: 'Long-Term / Marriage',
      description: 'Find compatible partners for serious, long-term relationships and marriage',
      icon: '💕',
      options: [
        {
          id: 'SHORT',
          label: 'Quick (15 questions)',
          description: 'Essential questions for marriage compatibility. Takes ~8 minutes.',
          time: '8 min',
          component: CompatibilityQuestionnaireLongTermShort,
        },
        {
          id: 'MEDIUM',
          label: 'Detailed (35 questions)',
          description: 'Comprehensive assessment of long-term compatibility. Takes ~20 minutes.',
          time: '20 min',
          component: null, // Will be created next
        },
        {
          id: 'LONG',
          label: 'Comprehensive (100 questions)',
          description: 'Complete compatibility profile. Takes ~45 minutes.',
          time: '45 min',
          component: null, // Will be created after
        },
      ],
    },
  };

  const handleQuestionnaireSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!userProfile?.id) {
        throw new Error('User profile not found. Please log in.');
      }

      const submitData = {
        ...data,
        userId: userProfile.id,
      };

      await submitCompatibilityQuestionnaire(submitData);

      // Show success message and navigate
      setTimeout(() => {
        navigate('/profile', { 
          state: { message: 'Compatibility questionnaire submitted successfully!' }
        });
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to submit questionnaire');
      console.error('Error submitting questionnaire:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Choose relationship type
  if (step === 'choose') {
    return (
      <div className="questionnaire-selector choose-type">
        <div className="selector-header">
          <h2>Compatibility Questionnaires</h2>
          <p className="subtitle">
            Complete a questionnaire to help us match you with compatible partners
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="questionnaire-options">
          {Object.entries(questionnaires).map(([key, value]) => (
            <div
              key={key}
              className="questionnaire-card"
              onClick={() => {
                setRelationshipType(key);
                setStep('select-length');
              }}
            >
              <div className="card-icon">{value.icon}</div>
              <h3>{value.label}</h3>
              <p>{value.description}</p>
              <Button className="btn-card">
                Choose {value.label.split(' /')[0]}
              </Button>
            </div>
          ))}
        </div>

        <div className="selector-footer">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Choose questionnaire length
  if (step === 'select-length') {
    const options = questionnaires[relationshipType].options;
    const typeLabel = questionnaires[relationshipType].label;

    return (
      <div className="questionnaire-selector choose-length">
        <div className="selector-header">
          <button
            className="back-button"
            onClick={() => {
              setRelationshipType(null);
              setStep('choose');
            }}
          >
            ← Back
          </button>
          <h2>{typeLabel}</h2>
          <p className="subtitle">
            Choose a questionnaire length based on how much detail you want to provide
          </p>
        </div>

        <div className="length-options">
          {options.map(option => (
            <div
              key={option.id}
              className="length-card"
              onClick={() => {
                setQuestionnaireLength(option.id);
                setStep('questionnaire');
              }}
            >
              <div className="card-header">
                <h3>{option.label}</h3>
                <span className="time-badge">{option.time}</span>
              </div>
              <p>{option.description}</p>
              <Button className="btn-card">
                Start Questionnaire
              </Button>
            </div>
          ))}
        </div>

        <div className="selector-footer">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Display selected questionnaire
  if (step === 'questionnaire') {
    const questionnaire = questionnaires[relationshipType];
    const option = questionnaire.options.find(o => o.id === questionnnaireLength);
    
    if (!option.component) {
      return (
        <div className="questionnaire-selector coming-soon">
          <div className="selector-header">
            <button
              className="back-button"
              onClick={() => setStep('select-length')}
            >
              ← Back
            </button>
            <h2>{option.label}</h2>
          </div>

          <div className="coming-soon-message">
            <p>This questionnaire is coming soon!</p>
            <p className="subtitle">
              Please choose a different length or check back later.
            </p>
          </div>

          <div className="selector-footer">
            <Button
              type="button"
              onClick={() => setStep('select-length')}
              className="btn-primary"
            >
              Choose Different Length
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    const Component = option.component;
    return (
      <Component
        onSubmit={(data) => {
          handleQuestionnaireSubmit({
            ...data,
            relationshipType,
            length: questionnnaireLength,
          });
        }}
        onCancel={() => setStep('select-length')}
      />
    );
  }
}

// Wrap selector in error boundary
function CompatibilityQuestionnaireSelectorWithNotifications() {
  return <CompatibilityQuestionnaireSelector />;
}

export default CompatibilityQuestionnaireSelector;
