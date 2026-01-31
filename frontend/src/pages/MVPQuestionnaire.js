import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserQuestionnaire, setLoading, setError } from '../redux/slices/userSlice';
import { selectUserProfile, selectIsUserLoading, selectUserError } from '../redux/selectors';
import { submitQuestionnaire } from '../services/api';
import Button from '../components/Button';
import '../styles/mvp-questionnaire.css';

/**
 * MVP Questionnaire with 50 essential questions for compatibility scoring
 * Estimated completion time: 8-12 minutes
 */
function MVPQuestionnaire() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProfile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectIsUserLoading);
  const error = useSelector(selectUserError);

  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showProgress, setShowProgress] = useState(true);
  const [responseId, setResponseId] = useState(null);

  // Load existing responses on component mount
  useEffect(() => {
    const fetchExistingResponses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        console.log('📋 Fetching existing MVP questionnaire responses...');
        
        // Get the MVP questionnaire template
        const templateResponse = await fetch('http://localhost:3001/api/questionnaires/type/MVP', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!templateResponse.ok) return;

        const template = await templateResponse.json();
        const questionnaireId = template.id;

        // Fetch user's responses for MVP questionnaire
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
          console.log('✅ Existing MVP responses found:', existingData);
          console.log('Answers array:', existingData.Answers);

          // Store the response ID for future updates
          if (existingData.id) {
            setResponseId(existingData.id);
          }

          // Map answers to question keys (q1, q2, etc.)
          const answersMap = {};
          if (existingData.Answers) {
            existingData.Answers.forEach(answer => {
              // Find the question to get its order
              const question = template.Questions.find(q => q.id === answer.questionId);
              if (question) {
                const questionKey = `q${question.order}`;
                try {
                  // Check if it's a JSON array (for multi-select)
                  const parsed = JSON.parse(answer.value);
                  answersMap[questionKey] = parsed;
                //   console.log(`  Parsed Q${question.order} as JSON:`, parsed);
                } catch {
                  // Not JSON, try parsing as number or use as-is
                  const numValue = parseInt(answer.value);
                  answersMap[questionKey] = isNaN(numValue) ? answer.value : numValue;
                //   console.log(`  Set Q${question.order} to:`, answersMap[questionKey]);
                }
              }
            });
          }
          console.log('Final answersMap:', answersMap);
          setFormData(answersMap);
        }
      } catch (err) {
        console.error('❌ Error fetching existing MVP responses:', err);
        // Don't set error, just continue with blank form
      }
    };

    fetchExistingResponses();
  }, []);

  // Define all 50 questions organized by section
  const sections = [
    {
      title: 'PERSONALITY (Big Five)',
      description: 'Questions 1-10',
      questions: [
        {
          id: 'q1',
          number: 1,
          question: 'I am curious about many different things and enjoy exploring new ideas.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        },
        {
          id: 'q2',
          number: 2,
          question: 'I prefer routines and familiar ways of doing things over trying new approaches.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          reversed: true,
        },
        {
          id: 'q3',
          number: 3,
          question: 'I keep my living space organized and things in their proper place.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        },
        {
          id: 'q4',
          number: 4,
          question: 'I often procrastinate on tasks and leave things for the last minute.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          reversed: true,
        },
        {
          id: 'q5',
          number: 5,
          question: 'I enjoy social gatherings and meeting new people.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        },
        {
          id: 'q6',
          number: 6,
          question: 'I prefer quiet activities and smaller groups over large social events.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          reversed: true,
        },
        {
          id: 'q7',
          number: 7,
          question: 'I am genuinely interested in other people\'s wellbeing and like helping them.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        },
        {
          id: 'q8',
          number: 8,
          question: 'I prioritize my own interests even if it affects others negatively.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          reversed: true,
        },
        {
          id: 'q9',
          number: 9,
          question: 'I frequently feel anxious or worried about things.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        },
        {
          id: 'q10',
          number: 10,
          question: 'I remain calm and level-headed even in stressful situations.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          reversed: true,
        },
      ],
    },
    {
      title: 'CORE VALUES & LIFE PRIORITIES',
      description: 'Questions 11-18',
      questions: [
        {
          id: 'q11',
          number: 11,
          question: 'Which one matters MOST to you in your life?',
          type: 'single',
          options: ['Personal achievement and career success', 'Family relationships and close connections', 'Financial security and stability', 'Adventure and new experiences', 'Helping others and making a difference'],
        },
        {
          id: 'q12',
          number: 12,
          question: 'Of the remaining options, which matters most?',
          type: 'single',
          options: ['Personal growth and self-improvement', 'Health and physical wellbeing', 'Creative expression and artistic pursuits', 'Leisure time and relaxation', 'Respect and social status'],
        },
        {
          id: 'q13',
          number: 13,
          question: 'In important life decisions, I prioritize...',
          type: 'slider10',
          labels: ['What\'s best for me personally', 'Balanced', 'What\'s best for us/family'],
        },
        {
          id: 'q14',
          number: 14,
          question: 'My approach to traditions and customs is...',
          type: 'slider10',
          labels: ['Maintain traditions', 'Balanced approach', 'Create new, discard old'],
        },
        {
          id: 'q15',
          number: 15,
          question: 'Which speaks more to what you want from life?',
          type: 'single',
          options: ['Career achievement, financial success, recognition', 'Deep relationships, family, meaningful connections', 'Balanced importance of both'],
        },
        {
          id: 'q16',
          number: 16,
          question: 'What gives your life the most meaning?',
          type: 'single',
          options: ['Relationships with loved ones', 'Romantic partnership and intimate connection', 'Career achievement and professional success', 'Helping others and social contribution', 'Personal growth and self-actualization'],
        },
        {
          id: 'q17',
          number: 17,
          question: 'What is your second most important source of life meaning?',
          type: 'single',
          options: ['Spiritual or religious faith', 'Adventure, experiences, and living fully', 'Creative or artistic expression', 'Building a legacy (children, impact, contribution)', 'Learning and accumulating knowledge'],
        },
        {
          id: 'q18',
          number: 18,
          question: 'I care deeply about helping others and contributing to society.',
          type: 'likert5',
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        },
      ],
    },
    {
      title: 'FAMILY PLANNING & RELATIONSHIPS',
      description: 'Questions 19-23 (CRITICAL)',
      questions: [
        {
          id: 'q19',
          number: 19,
          question: 'Do you want children? ⚠️ CRITICAL',
          type: 'single',
          options: ['Definitely yes, it\'s important to me', 'Probably yes, open to it', 'Uncertain, would decide with partner', 'Probably no, leaning toward not having', 'Definitely no, I don\'t want children'],
          critical: true,
        },
        {
          id: 'q20',
          number: 20,
          question: 'If you have children, how many do you envision?',
          type: 'single',
          options: ['One child', 'Two children', 'Three children', 'Four or more', 'Haven\'t thought about it specifically'],
          conditional: 'q19',
        },
        {
          id: 'q21',
          number: 21,
          question: 'My parenting approach would be...',
          type: 'single',
          options: ['Structured with warm, responsive parenting', 'Strong discipline with high expectations', 'Child-centered with flexible rules', 'Minimal structure; child self-directed', 'Haven\'t thought about it yet'],
          conditional: 'q19',
        },
        {
          id: 'q22',
          number: 22,
          question: 'I\'m looking for...',
          type: 'single',
          options: ['Long-term partnership or marriage', 'Committed long-term relationship (open to marriage)', 'Long-term relationship (no marriage plans)', 'Short-term dating and exploration', 'Open to whatever develops'],
          critical: true,
        },
        {
          id: 'q23',
          number: 23,
          question: 'My preferred relationship structure is... ⚠️ CRITICAL',
          type: 'single',
          options: ['Monogamous (exclusive romantic relationship)', 'Open to discussion/flexible', 'Open relationship (consensual non-monogamy)'],
          critical: true,
        },
      ],
    },
    {
      title: 'FINANCIAL ATTITUDES',
      description: 'Questions 24-29',
      questions: [
        {
          id: 'q24',
          number: 24,
          question: 'My approach to money is...',
          type: 'slider10',
          labels: ['Save as much as possible', 'Balanced approach', 'Spend freely and enjoy life now'],
        },
        {
          id: 'q25',
          number: 25,
          question: 'In a relationship, regarding finances I believe in...',
          type: 'single',
          options: ['Complete openness (combine finances, full visibility)', 'Mostly transparent (shared account + personal money)', 'Partially separate (separate accounts, split shared expenses)', 'Completely separate (minimal financial overlap)'],
        },
        {
          id: 'q26',
          number: 26,
          question: 'My comfort level with debt is...',
          type: 'slider10',
          labels: ['Avoid debt at all costs', 'Moderate comfort', 'Comfortable with significant debt'],
        },
        {
          id: 'q27',
          number: 27,
          question: 'Regarding investments, I prefer...',
          type: 'single',
          options: ['Safe, low-risk investments', 'Diversified portfolio with balanced risk', 'Willingness to take calculated risks for higher returns', 'High-risk, high-reward opportunities'],
        },
        {
          id: 'q28',
          number: 28,
          question: 'My financial priority is...',
          type: 'slider10',
          labels: ['Build maximum security', 'Balanced priorities', 'Maximize experiences and quality of life'],
        },
        {
          id: 'q29',
          number: 29,
          question: 'Which best describes my relationship with money?',
          type: 'single',
          options: ['I seek the best quality, research thoroughly', 'I prefer brand names; higher price often means better quality', 'I enjoy shopping and spending as a leisure activity', 'I\'m price-conscious and always seek discounts', 'I like trying new products and keeping up with trends'],
        },
      ],
    },
    {
      title: 'LIFESTYLE PREFERENCES',
      description: 'Questions 30-37',
      questions: [
        {
          id: 'q30',
          number: 30,
          question: 'What time do you naturally wake up?',
          type: 'single',
          options: ['Very early (5-6 AM)', 'Early (6-7 AM)', 'Regular (7-8 AM)', 'Late (8-9 AM)', 'Very late (9+ AM)'],
        },
        {
          id: 'q31',
          number: 31,
          question: 'What time do you naturally go to bed?',
          type: 'single',
          options: ['Very early (9-10 PM)', 'Early (10-11 PM)', 'Regular (11 PM-12 AM)', 'Late (12-1 AM)', 'Very late (1+ AM)'],
        },
        {
          id: 'q32',
          number: 32,
          question: 'How often do you exercise?',
          type: 'single',
          options: ['Rarely or never', '1-2 times per week', '3-4 times per week', '5+ times per week', 'Depends on season/circumstances'],
        },
        {
          id: 'q33',
          number: 33,
          question: 'My ideal frequency for social engagement is...',
          type: 'single',
          options: ['Multiple times per week (very social)', 'Once or twice per week (moderately social)', 'A few times per month (lower social frequency)', 'Monthly or less (prefer quiet/private time)', 'Varies greatly'],
        },
        {
          id: 'q34',
          number: 34,
          question: 'I prefer to spend free time...',
          type: 'slider10',
          labels: ['Indoors (reading, movies, games)', 'Mix of both equally', 'Outdoors (hiking, sports, parks)'],
        },
        {
          id: 'q35',
          number: 35,
          question: 'My standards for household cleanliness and organization are...',
          type: 'slider10',
          labels: ['Very fastidious, cleanliness important', 'Moderate standards', 'Very casual, comfortable with clutter'],
        },
        {
          id: 'q36',
          number: 36,
          question: 'I most enjoy spending time on...',
          type: 'single',
          options: ['Movies, TV, streaming content', 'Reading books or consuming media', 'Sports or physical activities', 'Creative hobbies (art, music, writing)', 'Social activities and going out', 'Quiet time at home', 'Mix of various activities'],
        },
        {
          id: 'q37',
          number: 37,
          question: 'My relationship with technology is...',
          type: 'slider10',
          labels: ['Minimal use, prefer offline', 'Balanced use', 'Heavy user, always connected'],
        },
      ],
    },
    {
      title: 'WORK-LIFE BALANCE',
      description: 'Questions 38-42',
      questions: [
        {
          id: 'q38',
          number: 38,
          question: 'How important is career in my life?',
          type: 'slider10',
          labels: ['Primary focus, main life goal', 'Important but balanced', 'Just a job; prioritize other areas'],
        },
        {
          id: 'q39',
          number: 39,
          question: 'How many hours per week do you ideally want to work?',
          type: 'single',
          options: ['20-30 hours (part-time emphasis)', '30-40 hours (standard full-time)', '40-50 hours (full-time with career focus)', '50-60 hours (significant career focus)', '60+ hours (very high career intensity)'],
        },
        {
          id: 'q40',
          number: 40,
          question: 'How important is flexibility in your work arrangement?',
          type: 'single',
          options: ['Very important (need flexible schedule)', 'Somewhat important (prefer it)', 'Neutral (okay either way)', 'Prefer structure (like traditional office)', 'Not applicable to my work'],
        },
        {
          id: 'q41',
          number: 41,
          question: 'At this point in my life, career is...',
          type: 'single',
          options: ['Building/establishing (early career focus)', 'Advancing (mid-career growth)', 'Stable (settled position)', 'Winding down (considering transition)', 'Transitioning (changing direction)'],
        },
        {
          id: 'q42',
          number: 42,
          question: 'When my partner\'s career demands time/energy, I...',
          type: 'slider10',
          labels: ['Expect them to prioritize us', 'Balanced support', 'Support them fully even if it affects couple time'],
        },
      ],
    },
    {
      title: 'HEALTH & WELLNESS',
      description: 'Questions 43-46',
      questions: [
        {
          id: 'q43',
          number: 43,
          question: 'My approach to health is...',
          type: 'slider10',
          labels: ['Reactive (address when problems arise)', 'Balanced approach', 'Proactive (preventative focus, health is priority)'],
        },
        {
          id: 'q44',
          number: 44,
          question: 'How would you describe your alcohol use?',
          type: 'single',
          options: ['Never or rarely drink', 'Social drinker (occasional, social settings)', 'Regular drinker (few times per week)', 'Heavy drinker (most days or significant consumption)'],
        },
        {
          id: 'q45',
          number: 45,
          question: 'Do you use tobacco or nicotine products?',
          type: 'single',
          options: ['Never used/don\'t use', 'Quit but used to', 'Occasional use', 'Regular use'],
        },
        {
          id: 'q46',
          number: 46,
          question: 'Regarding mental health and therapy, I...',
          type: 'single',
          options: ['See it as important, would use if needed', 'Open to it but prefer self-help first', 'Skeptical of therapy\'s value', 'Don\'t believe in professional mental health support'],
        },
      ],
    },
    {
      title: 'PHYSICAL PREFERENCES',
      description: 'Questions 47-50',
      questions: [
        {
          id: 'q47',
          number: 47,
          question: 'What age range are you interested in dating?',
          type: 'range',
          min: 18,
          max: 99,
        },
        {
          id: 'q48',
          number: 48,
          question: 'Physical attractiveness importance to me in a partner is...',
          type: 'slider10',
          labels: ['Not important (connection more important)', 'Moderately important', 'Very important (significant factor)'],
        },
        {
          id: 'q49',
          number: 49,
          question: 'Physical characteristics I\'m attracted to... (select all that apply)',
          type: 'multi',
          options: ['Slim/athletic', 'Average', 'Curvy/full-figured', 'Muscular/fit', 'No strong preference'],
        },
        {
          id: 'q50',
          number: 50,
          question: 'Regarding height, I prefer... (select all that apply)',
          type: 'multi',
          options: ['Taller than me', 'Similar height', 'Shorter than me', 'No strong preference'],
        },
      ],
    },
  ];

  const currentSectionData = sections[currentSection - 1];
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQuestions = Object.keys(formData).length;
  const progressPercent = (answeredQuestions / totalQuestions) * 100;

  // Handle question answer change
  const handleAnswer = (questionId, answer) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // Clear error if exists
    if (formErrors[questionId]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  // Validate current section
  const validateSection = () => {
    const errors = {};
    const visibleQuestions = currentSectionData.questions.filter((q) => {
      if (!q.conditional) return true;
      // Check if conditional question's answer allows this question to show
      const conditionalAnswer = formData[q.conditional];
      if (q.conditional === 'q19') {
        return ['Definitely yes, it\'s important to me', 'Probably yes, open to it'].includes(conditionalAnswer);
      }
      return true;
    });

    visibleQuestions.forEach((q) => {
      if (!formData[q.id]) {
        errors[q.id] = 'This question is required';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate sections
  const handleNext = async () => {
    if (validateSection()) {
      try {
        setIsSubmitting(true);

        // Save current section's answers
        const submissionData = {
          type: 'MVP',
          responses: formData,
        };

        const result = await submitQuestionnaire(submissionData);
        
        // Store the response ID for future updates
        if (!responseId && result.id) {
          setResponseId(result.id);
        }

        // Move to next section
        if (currentSection < sections.length) {
          setCurrentSection(currentSection + 1);
          window.scrollTo(0, 0);
        }
      } catch (err) {
        console.error('Error saving section:', err);
        dispatch(setError(err.message || 'Failed to save this section'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSection()) {
      return;
    }

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));

      // Save final section's answers
      const submissionData = {
        type: 'MVP',
        responses: formData,
      };

      const result = await submitQuestionnaire(submissionData);
      dispatch(setUserQuestionnaire(result));

      // Navigate to matches page
      setTimeout(() => {
        navigate('/matches');
      }, 500);
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      dispatch(setError(err.message || 'Failed to submit questionnaire'));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  // Render question based on type
  const renderQuestion = (question) => {
    const value = formData[question.id];
    const isRequired = !question.conditional || formData[question.conditional];
    const shouldShow = !question.conditional || isRequired;

    if (!shouldShow) return null;

    return (
      <div key={question.id} className={`question-item ${question.critical ? 'critical' : ''}`}>
        <label className="question-text">
          {question.critical && <span className="critical-badge">⚠️ CRITICAL</span>}
          {question.number}. {question.question}
        </label>

        {question.type === 'likert5' && (
          <div className="likert-group">
            {question.scale.map((label, idx) => (
              <label key={idx} className="likert-option">
                <input
                  type="radio"
                  name={question.id}
                  value={idx + 1}
                  checked={value == idx + 1}
                  onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'slider10' && (
          <div className="slider-group">
            <div className="slider-labels">
              <span>{question.labels[0]}</span>
              <span>{question.labels[1]}</span>
              <span>{question.labels[2]}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={value || 5}
              onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-value">{value || 5}</div>
          </div>
        )}

        {question.type === 'single' && (
          <div className="radio-group">
            {question.options.map((opt, idx) => (
              <label key={idx} className="radio-option">
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'multi' && (
          <div className="checkbox-group">
            {question.options.map((opt, idx) => (
              <label key={idx} className="checkbox-option">
                <input
                  type="checkbox"
                  name={question.id}
                  value={opt}
                  checked={(value || []).includes(opt)}
                  onChange={(e) => {
                    const selected = (value || []).includes(opt)
                      ? (value || []).filter((item) => item !== opt)
                      : [...(value || []), opt];
                    handleAnswer(question.id, selected);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'range' && (
          <div className="range-group">
            <div className="range-inputs">
              <div className="range-field">
                <label>Min age:</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={(value && value.min) || 18}
                  onChange={(e) =>
                    handleAnswer(question.id, {
                      min: parseInt(e.target.value),
                      max: (value && value.max) || 99,
                    })
                  }
                  className="form-input"
                />
              </div>
              <div className="range-field">
                <label>Max age:</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={(value && value.max) || 99}
                  onChange={(e) =>
                    handleAnswer(question.id, {
                      min: (value && value.min) || 18,
                      max: parseInt(e.target.value),
                    })
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {formErrors[question.id] && (
          <span className="error-text">{formErrors[question.id]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="mvp-questionnaire-page">
      {showProgress && (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="progress-text">
            {answeredQuestions} of {totalQuestions} questions answered ({Math.round(progressPercent)}%)
          </div>
        </div>
      )}

      <div className="questionnaire-container">
        <div className="section-header">
          <div className="section-info">
            <h1>{currentSectionData.title}</h1>
            <p>{currentSectionData.description}</p>
            <p className="section-number">Section {currentSection} of {sections.length}</p>
          </div>
          <button
            className="toggle-progress-btn"
            onClick={() => setShowProgress(!showProgress)}
            title={showProgress ? 'Hide progress' : 'Show progress'}
          >
            {showProgress ? '📊' : '○'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="questionnaire-form">
          <div className="questions-container">
            {currentSectionData.questions.map((question) => renderQuestion(question))}
          </div>

          <div className="form-actions">
            {currentSection > 1 && (
              <Button
                type="button"
                onClick={handlePrevious}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                ← Previous Section
              </Button>
            )}

            {currentSection < sections.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                disabled={isSubmitting}
              >
                Next Section →
              </Button>
            ) : (
              <Button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Complete Questionnaire'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default MVPQuestionnaire;
