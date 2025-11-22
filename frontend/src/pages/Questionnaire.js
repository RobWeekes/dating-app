import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserQuestionnaire, setLoading, setError } from '../redux/slices/userSlice';
import { selectUserProfile, selectUserQuestionnaire, selectIsUserLoading, selectUserError } from '../redux/selectors';
import { getUserQuestionnaire, submitQuestionnaire, updateUserQuestionnaire } from '../services/api';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import '../styles/questionnaire.css';

/**
 * Comprehensive questionnaire with dating preference and personality questions
 */
function Questionnaire() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const userProfile = useSelector(selectUserProfile);
  const existingQuestionnaire = useSelector(selectUserQuestionnaire);
  const isLoading = useSelector(selectIsUserLoading);
  const error = useSelector(selectUserError);

  // Form state
  const [formData, setFormData] = useState({
    personalityType: 'Introvert', // Introvert, Ambivert, Extrovert
    datingGoal: 'Long-term relationship', // Long-term relationship, Casual dating, Friendship
    relationshipType: 'Monogamous', // Monogamous, Open relationship, Not sure
    interests: [], // Array of selected interests
    responses: {}, // Store all questionnaire responses
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Define questionnaire questions
  const questionsConfig = [
    {
      id: 'personality',
      question: 'What best describes your personality?',
      type: 'select',
      options: ['Introvert', 'Ambivert', 'Extrovert'],
      fieldName: 'personalityType',
    },
    {
      id: 'dating-goal',
      question: 'What is your primary dating goal?',
      type: 'select',
      options: ['Long-term relationship', 'Casual dating', 'Friendship', 'Not sure yet'],
      fieldName: 'datingGoal',
    },
    {
      id: 'relationship-type',
      question: 'What type of relationship are you looking for?',
      type: 'select',
      options: ['Monogamous', 'Open relationship', 'Not sure'],
      fieldName: 'relationshipType',
    },
    {
      id: 'interests',
      question: 'Select your interests (choose at least 3)',
      type: 'checkbox',
      options: [
        'Travel',
        'Fitness',
        'Cooking',
        'Art & Music',
        'Reading',
        'Outdoor activities',
        'Movies & TV',
        'Gaming',
        'Sports',
        'Photography',
        'Volunteering',
        'Meditation',
      ],
      fieldName: 'interests',
    },
    {
      id: 'ideal-date',
      question: 'What would be your ideal first date?',
      type: 'textarea',
      fieldName: 'responses.idealDate',
      placeholder: 'Share what you think makes a great first date...',
    },
    {
      id: 'five-years',
      question: 'Where do you see yourself in 5 years?',
      type: 'textarea',
      fieldName: 'responses.fiveYearGoal',
      placeholder: 'Tell us about your future plans and aspirations...',
    },
    {
      id: 'about-you',
      question: 'Describe yourself in 3-4 sentences',
      type: 'textarea',
      fieldName: 'responses.aboutYou',
      placeholder: 'Tell us what makes you unique...',
    },
  ];

  // Load existing questionnaire if available
  useEffect(() => {
    const loadQuestionnaire = async () => {
      if (userProfile?.id) {
        try {
          dispatch(setLoading(true));
          const data = await getUserQuestionnaire(userProfile.id);
          if (data) {
            setFormData({
              personalityType: data.personalityType || formData.personalityType,
              datingGoal: data.datingGoal || formData.datingGoal,
              relationshipType: data.relationshipType || formData.relationshipType,
              interests: data.interests || [],
              responses: data.responses || {},
            });
            dispatch(setUserQuestionnaire(data));
          }
        } catch (err) {
          console.log('No existing questionnaire found - this is expected for new users');
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    loadQuestionnaire();
  }, [userProfile?.id]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.personalityType) {
      errors.personalityType = 'Please select your personality type';
    }

    if (!formData.datingGoal) {
      errors.datingGoal = 'Please select your dating goal';
    }

    if (!formData.relationshipType) {
      errors.relationshipType = 'Please select relationship type';
    }

    if (formData.interests.length < 3) {
      errors.interests = 'Please select at least 3 interests';
    }

    if (!formData.responses.idealDate || formData.responses.idealDate.trim() === '') {
      errors.idealDate = 'Please describe your ideal first date';
    }

    if (!formData.responses.fiveYearGoal || formData.responses.fiveYearGoal.trim() === '') {
      errors.fiveYearGoal = 'Please share your 5-year goals';
    }

    if (!formData.responses.aboutYou || formData.responses.aboutYou.trim() === '') {
      errors.aboutYou = 'Please tell us about yourself';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle checkbox arrays (interests)
      setFormData((prev) => {
        const interests = prev.interests.includes(value)
          ? prev.interests.filter((i) => i !== value)
          : [...prev.interests, value];

        return { ...prev, interests };
      });
    } else if (name.includes('.')) {
      // Handle nested responses
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle regular inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const questionnaireData = {
        userId: userProfile.id,
        personalityType: formData.personalityType,
        datingGoal: formData.datingGoal,
        relationshipType: formData.relationshipType,
        interests: formData.interests,
        responses: formData.responses,
      };

      const result = existingQuestionnaire
        ? await updateUserQuestionnaire(existingQuestionnaire.id, questionnaireData)
        : await submitQuestionnaire(questionnaireData);

      dispatch(setUserQuestionnaire(result));
      setIsEditing(false);

      // Show success notification
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      dispatch(setError(err.message || 'Failed to submit questionnaire'));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to last saved state
    if (existingQuestionnaire) {
      setFormData({
        personalityType: existingQuestionnaire.personalityType,
        datingGoal: existingQuestionnaire.datingGoal,
        relationshipType: existingQuestionnaire.relationshipType,
        interests: existingQuestionnaire.interests || [],
        responses: existingQuestionnaire.responses || {},
      });
    }
  };

  // Render view mode
  if (!isEditing && existingQuestionnaire) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-header">
          <h1>Your Questionnaire</h1>
          <Button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit
          </Button>
        </div>

        <div className="questionnaire-view">
          <div className="question-group">
            <label>Personality Type</label>
            <p>{existingQuestionnaire.personalityType}</p>
          </div>

          <div className="question-group">
            <label>Dating Goal</label>
            <p>{existingQuestionnaire.datingGoal}</p>
          </div>

          <div className="question-group">
            <label>Relationship Type</label>
            <p>{existingQuestionnaire.relationshipType}</p>
          </div>

          <div className="question-group">
            <label>Interests</label>
            <div className="interests-display">
              {existingQuestionnaire.interests?.map((interest) => (
                <span key={interest} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="question-group">
            <label>Ideal First Date</label>
            <p>{existingQuestionnaire.responses?.idealDate}</p>
          </div>

          <div className="question-group">
            <label>5-Year Goals</label>
            <p>{existingQuestionnaire.responses?.fiveYearGoal}</p>
          </div>

          <div className="question-group">
            <label>About You</label>
            <p>{existingQuestionnaire.responses?.aboutYou}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render edit form
  return (
    <div className="questionnaire-page">
      <div className="questionnaire-header">
        <h1>{existingQuestionnaire ? 'Update Your Questionnaire' : 'Complete Your Questionnaire'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="questionnaire-form">
        {questionsConfig.map((q) => (
          <div key={q.id} className="question-block">
            <label htmlFor={q.id} className="question-label">
              {q.question}
              <span className="required">*</span>
            </label>

            {q.type === 'select' && (
              <>
                <select
                  id={q.id}
                  name={q.fieldName}
                  value={formData[q.fieldName] || ''}
                  onChange={handleChange}
                  className={`form-select ${formErrors[q.fieldName] ? 'error' : ''}`}
                >
                  <option value="">-- Select an option --</option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {formErrors[q.fieldName] && (
                  <span className="error-text">{formErrors[q.fieldName]}</span>
                )}
              </>
            )}

            {q.type === 'checkbox' && (
              <>
                <div className={`checkbox-group ${formErrors.interests ? 'error' : ''}`}>
                  {q.options.map((opt) => (
                    <label key={opt} className="checkbox-label">
                      <input
                        type="checkbox"
                        name={q.fieldName}
                        value={opt}
                        checked={formData.interests.includes(opt)}
                        onChange={handleChange}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {formErrors.interests && (
                  <span className="error-text">{formErrors.interests}</span>
                )}
                <span className="selected-count">
                  {formData.interests.length} selected
                </span>
              </>
            )}

            {q.type === 'textarea' && (
              <>
                <textarea
                  id={q.id}
                  name={q.fieldName}
                  value={q.fieldName.includes('.')
                    ? formData.responses[q.fieldName.split('.')[1]] || ''
                    : formData[q.fieldName] || ''}
                  onChange={handleChange}
                  placeholder={q.placeholder}
                  className={`form-textarea ${formErrors[q.id] ? 'error' : ''}`}
                  rows="4"
                />
                {formErrors[q.id] && (
                  <span className="error-text">{formErrors[q.id]}</span>
                )}
              </>
            )}
          </div>
        ))}

        <div className="form-actions">
          <Button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : existingQuestionnaire ? 'Update' : 'Submit'}
          </Button>
          {isEditing && (
            <Button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Questionnaire;
