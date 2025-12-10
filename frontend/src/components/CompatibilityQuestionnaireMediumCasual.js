import { useState } from 'react';
import Button from './Button';
import '../styles/compatibility-questionnaire.css';

/**
 * Medium Compatibility Questionnaire - Casual (25 questions)
 * For casual/short-term dating relationships
 */
function CompatibilityQuestionnaireMediumCasual({ onSubmit, onCancel }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // Physical Intimacy & Attraction (5)
    physicalChemistry: '',
    intimacyFrequency: '',
    physicalAffection: '',
    sexualBoundariesComfort: '',
    emotionalPhysicalConnection: '',
    
    // Emotional Intimacy & Communication (5)
    emotionalOpenness: '',
    supportReceiving: '',
    supportGiving: '',
    disagreementHandling: '',
    beingHeard: '',
    
    // Lifestyle & Time (5)
    timeFrequency: '',
    dateActivities: '',
    sharedInterests: '',
    activityLevelCompatibility: '',
    scheduleCompatibility: '',
    
    // Values & Compatibility (5)
    coreValues: '',
    beliefAlignment: '',
    financialResponsibility: '',
    longTermCompatibility: '',
    mutualRespect: '',
    
    // Honesty, Expectations & Growth (5)
    upfrontAboutWants: '',
    exclusivityPreference: '',
    honestAboutFeelings: '',
    endingRelationshipMaturity: '',
    growthImportance: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    {
      title: 'Physical Intimacy & Attraction',
      questions: [
        {
          name: 'physicalChemistry',
          question: 'How important is sexual chemistry in your dating decisions?',
          options: ['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'],
        },
        {
          name: 'intimacyFrequency',
          question: "What's your preferred frequency of sexual activity?",
          options: ['4+ times per week', '2-3 times per week', '1 time per week', '1-2 times per month', 'Once per month or less', 'No preference'],
        },
        {
          name: 'physicalAffection',
          question: 'How do you feel about physical affection outside of sexual activity?',
          options: ['Must have—cuddling, kissing important', 'Should have—regular physical touch preferred', 'Could have—it\'s nice but not required', "Don't need much physical affection"],
        },
        {
          name: 'sexualBoundariesComfort',
          question: 'Are you comfortable discussing sexual preferences and boundaries upfront?',
          options: ['Yes, very comfortable', 'Somewhat comfortable', 'Uncomfortable but willing', 'No, prefer not to discuss'],
        },
        {
          name: 'emotionalPhysicalConnection',
          question: 'How do you feel about emotional intimacy alongside physical intimacy?',
          options: ['Must go together', 'Should go together', 'Can be separate', 'Physical alone is preferred'],
        },
      ],
    },
    {
      title: 'Emotional Intimacy & Communication',
      questions: [
        {
          name: 'emotionalOpenness',
          question: 'How much emotional openness do you want from a casual partner?',
          options: ['Very open and vulnerable', 'Open about emotions but boundaried', 'Moderate emotional expression', 'Light and surface-level preferred'],
        },
        {
          name: 'supportReceiving',
          question: 'How comfortable are you receiving emotional support from a casual partner?',
          options: ["Very comfortable—I appreciate it", 'Somewhat comfortable', 'Uncomfortable asking for support', 'I prefer to be independent'],
        },
        {
          name: 'supportGiving',
          question: 'Do you offer emotional support to partners?',
          options: ["Yes, I'm naturally supportive", 'Yes, but with healthy boundaries', 'Sometimes, depending on mood', "Not really—that's not my style"],
        },
        {
          name: 'disagreementHandling',
          question: 'How do you handle disagreements?',
          options: ['Address immediately and work through thoroughly', 'Take time and discuss calmly', 'Try to avoid conflict', 'Conflict is too stressful for casual dating'],
        },
        {
          name: 'beingHeard',
          question: 'How important is being heard and understood by your partner?',
          options: ['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important for casual'],
        },
      ],
    },
    {
      title: 'Lifestyle & Time',
      questions: [
        {
          name: 'timeFrequency',
          question: 'How much quality time do you want to spend with a casual partner?',
          options: ['Very frequent (4+ times weekly)', 'Regular (2-3 times weekly)', 'Moderate (weekly)', 'Occasional (2-3 times monthly)', 'Spontaneous/no expectations'],
        },
        {
          name: 'dateActivities',
          question: 'What kinds of activities do you enjoy on dates?',
          options: ['Outdoor adventures and active things', 'Dining, drinks, social venues', 'Cultural events (shows, museums, concerts)', 'Quiet time together at home', 'Flexible—open to anything'],
        },
        {
          name: 'sharedInterests',
          question: 'How important is lifestyle compatibility (e.g., sleep schedule, activity level, cleanliness)?',
          options: ['Very important', 'Somewhat important', 'Not important for casual dating', 'Open to different lifestyles'],
        },
        {
          name: 'activityLevelCompatibility',
          question: 'Do you prefer partners with similar interests to you?',
          options: ['Must share my interests', 'Should share some interests', 'Could share interests but not necessary', 'Differences are actually appealing'],
        },
        {
          name: 'scheduleCompatibility',
          question: 'How important is it that your schedules are compatible?',
          options: ['Very important', 'Somewhat important', 'Can work around it', 'Not a concern'],
        },
      ],
    },
    {
      title: 'Values & Compatibility',
      questions: [
        {
          name: 'coreValues',
          question: 'How important is it that you share core values (honesty, respect, kindness)?',
          options: ['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important for casual dating'],
        },
        {
          name: 'beliefAlignment',
          question: 'How important are shared beliefs about major life topics (politics, religion, social issues)?',
          options: ['Must align', 'Should mostly align', "Don't need to align for casual dating", 'Differences can be interesting'],
        },
        {
          name: 'financialResponsibility',
          question: 'How important is it that your partner is financially responsible?',
          options: ['Very important', 'Somewhat important', 'Not important for casual dating', 'Open to any financial situation'],
        },
        {
          name: 'longTermCompatibility',
          question: 'Are you compatible with someone who wants very different things long-term?',
          options: ["No—deal breaker", "Possible if we're clear about it", "Yes—we're not planning forever anyway", "Haven't thought about it"],
        },
        {
          name: 'mutualRespect',
          question: 'How important is mutual respect and reciprocal interest?',
          options: ['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Less important for casual'],
        },
      ],
    },
    {
      title: 'Honesty, Expectations & Growth',
      questions: [
        {
          name: 'upfrontAboutWants',
          question: 'How comfortable are you being upfront about what you want from dating?',
          options: ["Very comfortable—I'm clear about my intentions", 'Somewhat comfortable', 'Uncomfortable but willing', 'Prefer to let things develop naturally'],
        },
        {
          name: 'exclusivityPreference',
          question: 'What\'s your view on exclusive vs. non-exclusive casual dating?',
          options: ['Must be exclusive', 'Prefer exclusive but flexible', 'Open to non-exclusive dating', "Doesn't matter to me"],
        },
        {
          name: 'honestAboutFeelings',
          question: 'Are you honest if you develop feelings beyond what you initially wanted?',
          options: ['Yes, always communicate', 'Usually, yes', 'Sometimes', 'I avoid that conversation'],
        },
        {
          name: 'endingRelationshipMaturity',
          question: 'How do you feel if a casual relationship ends or doesn\'t develop into something serious?',
          options: ["I'm mature about it and can handle it well", 'I can handle it but it\'s difficult', 'I avoid relationships that might end', 'I struggle with endings'],
        },
        {
          name: 'growthImportance',
          question: 'Is being with someone who challenges you to grow important?',
          options: ['Yes, very important', 'Somewhat important', 'Not important for casual dating', 'I prefer comfort over growth'],
        },
      ],
    },
  ];

  const validateSection = (sectionIndex) => {
    const section = sections[sectionIndex];
    const newErrors = {};
    section.questions.forEach(q => {
      if (!formData[q.name]) {
        newErrors[q.name] = 'Required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSection(currentSection)) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        type: 'MEDIUM',
        relationshipType: 'CASUAL',
        responses: formData,
        completedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const section = sections[currentSection];
  const progressPercent = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="compatibility-questionnaire medium-form">
      <div className="questionnaire-header">
        <h2>Casual Dating Compatibility</h2>
        <p className="subtitle">25 questions about short-term relationship compatibility</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="progress-text">Section {currentSection + 1} of {sections.length}</p>
      </div>

      <form onSubmit={handleSubmit} className="compatibility-form">
        
        <div className="form-section">
          <h3>{section.title}</h3>
          
          {section.questions.map(q => (
            <div key={q.name} className="question-block">
              <label className="question-label">
                {q.question}
              </label>
              <div className="radio-group">
                {q.options.map(opt => (
                  <label key={opt} className="radio-option">
                    <input
                      type="radio"
                      name={q.name}
                      value={opt}
                      checked={formData[q.name] === opt}
                      onChange={handleChange}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {errors[q.name] && <span className="error-text">{errors[q.name]}</span>}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          {currentSection > 0 && (
            <Button
              type="button"
              onClick={handlePrevious}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
          
          {currentSection < sections.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="btn-primary"
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
            </Button>
          )}
          
          <Button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CompatibilityQuestionnaireMediumCasual;
