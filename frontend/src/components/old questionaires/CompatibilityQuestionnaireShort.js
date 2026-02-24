import { useState } from 'react';
import Button from '../Button';
import '../styles/compatibility-questionnaire.css';

/**
 * Short Compatibility Questionnaire (10 questions)
 * For casual/short-term dating relationships
 */
function CompatibilityQuestionnaireShort({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    // Physical Intimacy & Attraction
    physicalChemistry: '',
    intimacyFrequency: '',

    // Emotional Connection & Communication
    emotionalOpenness: '',
    communicationImportance: '',

    // Lifestyle & Time Commitment
    timeSpent: '',

    // Values & Life Goals
    sharedValues: '',

    // Honesty & Clarity
    upfrontHonesty: '',
    exclusivityExpectation: '',

    // Future Intentions
    seriousEvolution: '',
    compatibilityView: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.physicalChemistry) newErrors.physicalChemistry = 'Required';
    if (!formData.intimacyFrequency) newErrors.intimacyFrequency = 'Required';
    if (!formData.emotionalOpenness) newErrors.emotionalOpenness = 'Required';
    if (!formData.communicationImportance) newErrors.communicationImportance = 'Required';
    if (!formData.timeSpent) newErrors.timeSpent = 'Required';
    if (!formData.sharedValues) newErrors.sharedValues = 'Required';
    if (!formData.upfrontHonesty) newErrors.upfrontHonesty = 'Required';
    if (!formData.exclusivityExpectation) newErrors.exclusivityExpectation = 'Required';
    if (!formData.seriousEvolution) newErrors.seriousEvolution = 'Required';
    if (!formData.compatibilityView) newErrors.compatibilityView = 'Required';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        type: 'SHORT',
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

  return (
    <div className="compatibility-questionnaire short-form">
      <div className="questionnaire-header">
        <h2>Casual Dating Compatibility (Quick)</h2>
        <p className="subtitle">10 essential questions about short-term relationship compatibility</p>
      </div>

      <form onSubmit={handleSubmit} className="compatibility-form">

        {/* Section 1: Physical Intimacy & Attraction */}
        <div className="form-section">
          <h3>Physical Intimacy & Attraction</h3>

          <div className="question-block">
            <label className="question-label">
              How important is physical chemistry and sexual attraction in a potential partner?
            </label>
            <div className="radio-group">
              {['Essential', 'Very important', 'Somewhat important', 'Not very important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="physicalChemistry"
                    value={opt}
                    checked={formData.physicalChemistry === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.physicalChemistry && <span className="error-text">{errors.physicalChemistry}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              What is your preferred frequency of physical intimacy?
            </label>
            <div className="radio-group">
              {['Very frequent (multiple times weekly)', 'Regular (1-2 times weekly)', 'Moderate (1-2 times monthly)', 'No preference'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="intimacyFrequency"
                    value={opt}
                    checked={formData.intimacyFrequency === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.intimacyFrequency && <span className="error-text">{errors.intimacyFrequency}</span>}
          </div>
        </div>

        {/* Section 2: Emotional Connection & Communication */}
        <div className="form-section">
          <h3>Emotional Connection & Communication</h3>

          <div className="question-block">
            <label className="question-label">
              How emotionally open do you prefer your dating partner to be?
            </label>
            <div className="radio-group">
              {['Very open and vulnerable', 'Open but with boundaries', 'Casual and light', 'No strong preference'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="emotionalOpenness"
                    value={opt}
                    checked={formData.emotionalOpenness === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.emotionalOpenness && <span className="error-text">{errors.emotionalOpenness}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is good communication in a dating relationship?
            </label>
            <div className="radio-group">
              {['Essential—deal breaker if poor', 'Very important', 'Somewhat important', 'Not a priority for casual dating'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="communicationImportance"
                    value={opt}
                    checked={formData.communicationImportance === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.communicationImportance && <span className="error-text">{errors.communicationImportance}</span>}
          </div>
        </div>

        {/* Section 3: Lifestyle & Time Commitment */}
        <div className="form-section">
          <h3>Lifestyle & Time Commitment</h3>

          <div className="question-block">
            <label className="question-label">
              How much time do you want to spend with a casual dating partner?
            </label>
            <div className="radio-group">
              {['Frequently (multiple times weekly)', 'Regularly (1-2 times weekly)', 'Occasionally (2-3 times monthly)', 'Spontaneous/flexible'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="timeSpent"
                    value={opt}
                    checked={formData.timeSpent === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.timeSpent && <span className="error-text">{errors.timeSpent}</span>}
          </div>
        </div>

        {/* Section 4: Values & Life Goals */}
        <div className="form-section">
          <h3>Values & Life Goals</h3>

          <div className="question-block">
            <label className="question-label">
              How important is it that your partner shares your core values?
            </label>
            <div className="radio-group">
              {['Very important', 'Somewhat important', 'Not very important', "Doesn't matter for casual dating"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="sharedValues"
                    value={opt}
                    checked={formData.sharedValues === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.sharedValues && <span className="error-text">{errors.sharedValues}</span>}
          </div>
        </div>

        {/* Section 5: Honesty & Clarity About Intentions */}
        <div className="form-section">
          <h3>Honesty & Clarity About Intentions</h3>

          <div className="question-block">
            <label className="question-label">
              Do you prefer partners who are explicit about what they want from dating?
            </label>
            <div className="radio-group">
              {['Absolutely—honesty is essential', "Yes, it's important", 'Somewhat', 'It\'s flexible'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="upfrontHonesty"
                    value={opt}
                    checked={formData.upfrontHonesty === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.upfrontHonesty && <span className="error-text">{errors.upfrontHonesty}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              What are your expectations about exclusivity?
            </label>
            <div className="radio-group">
              {['Exclusive from the start', 'Exclusive after some time', 'Casual/non-exclusive', "Haven't decided"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="exclusivityExpectation"
                    value={opt}
                    checked={formData.exclusivityExpectation === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.exclusivityExpectation && <span className="error-text">{errors.exclusivityExpectation}</span>}
          </div>
        </div>

        {/* Section 6: Future Intentions */}
        <div className="form-section">
          <h3>Future Intentions</h3>

          <div className="question-block">
            <label className="question-label">
              Are you open to a relationship eventually becoming serious?
            </label>
            <div className="radio-group">
              {['Yes, would be open to it', 'Maybe, depends on the person', 'Probably not', 'Not interested in commitment'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="seriousEvolution"
                    value={opt}
                    checked={formData.seriousEvolution === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.seriousEvolution && <span className="error-text">{errors.seriousEvolution}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              What's your view on casual dating compatibility?
            </label>
            <div className="radio-group">
              {["It's mostly about attraction", 'Both attraction and personality matter', 'It requires compatibility in values too', 'No particular view'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="compatibilityView"
                    value={opt}
                    checked={formData.compatibilityView === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.compatibilityView && <span className="error-text">{errors.compatibilityView}</span>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
          </Button>
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

export default CompatibilityQuestionnaireShort;
