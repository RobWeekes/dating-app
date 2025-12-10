import { useState } from 'react';
import Button from './Button';
import '../styles/compatibility-questionnaire.css';

/**
 * Short Compatibility Questionnaire - Long-Term (15 questions)
 * For people explicitly seeking long-term or marriage partners
 */
function CompatibilityQuestionnaireLongTermShort({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    // Trust & Commitment Foundation (3)
    trustImportance: '',
    partnerCommitmentKnowing: '',
    seekingLongTerm: '',
    
    // Intimacy Dimensions (4)
    sexualCompatibility: '',
    emotionalIntimacy: '',
    intellectualCompatibility: '',
    sharedActivities: '',
    
    // Communication & Conflict (2)
    communicationImportance: '',
    defensiveResponse: '',
    
    // Values & Future Alignment (3)
    financialAlignment: '',
    parentingAlignment: '',
    majorLifeGoals: '',
    
    // Emotional Health & Growth (3)
    attachmentSecurity: '',
    bestSelfBringing: '',
    workThroughDifficulty: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'trustImportance', 'partnerCommitmentKnowing', 'seekingLongTerm',
      'sexualCompatibility', 'emotionalIntimacy', 'intellectualCompatibility', 'sharedActivities',
      'communicationImportance', 'defensiveResponse',
      'financialAlignment', 'parentingAlignment', 'majorLifeGoals',
      'attachmentSecurity', 'bestSelfBringing', 'workThroughDifficulty',
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = 'Required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        type: 'SHORT',
        relationshipType: 'LONG_TERM',
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
        <h2>Long-Term/Marriage Compatibility (Quick)</h2>
        <p className="subtitle">15 essential questions for marriage-oriented relationships</p>
      </div>

      <form onSubmit={handleSubmit} className="compatibility-form">
        
        {/* Section 1: Trust & Commitment Foundation */}
        <div className="form-section">
          <h3>Trust & Commitment Foundation</h3>
          
          <div className="question-block">
            <label className="question-label">
              How important is absolute trust in a long-term partner?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="trustImportance"
                    value={opt}
                    checked={formData.trustImportance === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.trustImportance && <span className="error-text">{errors.trustImportance}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is knowing your partner is truly committed to the relationship?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', "Don't need to know"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="partnerCommitmentKnowing"
                    value={opt}
                    checked={formData.partnerCommitmentKnowing === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.partnerCommitmentKnowing && <span className="error-text">{errors.partnerCommitmentKnowing}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              Are you genuinely looking for a long-term partnership or marriage?
            </label>
            <div className="radio-group">
              {['Yes, definitely', 'Yes, probably', 'Maybe—if the right person comes along', 'Not really'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="seekingLongTerm"
                    value={opt}
                    checked={formData.seekingLongTerm === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.seekingLongTerm && <span className="error-text">{errors.seekingLongTerm}</span>}
          </div>
        </div>

        {/* Section 2: Intimacy Dimensions */}
        <div className="form-section">
          <h3>Intimacy Dimensions</h3>
          
          <div className="question-block">
            <label className="question-label">
              How important is sexual compatibility and regular intimacy?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="sexualCompatibility"
                    value={opt}
                    checked={formData.sexualCompatibility === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.sexualCompatibility && <span className="error-text">{errors.sexualCompatibility}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is emotional intimacy (vulnerability, being understood)?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="emotionalIntimacy"
                    value={opt}
                    checked={formData.emotionalIntimacy === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.emotionalIntimacy && <span className="error-text">{errors.emotionalIntimacy}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is intellectual compatibility (shared interests, growth)?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="intellectualCompatibility"
                    value={opt}
                    checked={formData.intellectualCompatibility === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.intellectualCompatibility && <span className="error-text">{errors.intellectualCompatibility}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is doing activities and lifestyle compatibility?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="sharedActivities"
                    value={opt}
                    checked={formData.sharedActivities === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.sharedActivities && <span className="error-text">{errors.sharedActivities}</span>}
          </div>
        </div>

        {/* Section 3: Communication & Conflict */}
        <div className="form-section">
          <h3>Communication & Conflict</h3>
          
          <div className="question-block">
            <label className="question-label">
              How important is healthy communication and conflict resolution?
            </label>
            <div className="radio-group">
              {['Must/Essential—deal breaker if poor', 'Should/Very important', 'Could/Nice to have', 'Not a priority'].map(opt => (
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

          <div className="question-block">
            <label className="question-label">
              Can you handle your partner bringing up concerns without getting defensive?
            </label>
            <div className="radio-group">
              {['Yes, I respond calmly', 'Usually, though sometimes reactive', 'I struggle with criticism', 'No, I get very defensive'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="defensiveResponse"
                    value={opt}
                    checked={formData.defensiveResponse === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.defensiveResponse && <span className="error-text">{errors.defensiveResponse}</span>}
          </div>
        </div>

        {/* Section 4: Values & Future Alignment */}
        <div className="form-section">
          <h3>Values & Future Alignment</h3>
          
          <div className="question-block">
            <label className="question-label">
              How important is alignment on financial values and goals?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="financialAlignment"
                    value={opt}
                    checked={formData.financialAlignment === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.financialAlignment && <span className="error-text">{errors.financialAlignment}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is alignment on children/parenting philosophy?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="parentingAlignment"
                    value={opt}
                    checked={formData.parentingAlignment === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.parentingAlignment && <span className="error-text">{errors.parentingAlignment}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is alignment on major life values and goals?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="majorLifeGoals"
                    value={opt}
                    checked={formData.majorLifeGoals === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.majorLifeGoals && <span className="error-text">{errors.majorLifeGoals}</span>}
          </div>
        </div>

        {/* Section 5: Emotional Health & Growth */}
        <div className="form-section">
          <h3>Emotional Health & Growth</h3>
          
          <div className="question-block">
            <label className="question-label">
              How important is your partner having secure attachment and emotional stability?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="attachmentSecurity"
                    value={opt}
                    checked={formData.attachmentSecurity === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.attachmentSecurity && <span className="error-text">{errors.attachmentSecurity}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              How important is your partner bringing out your best self?
            </label>
            <div className="radio-group">
              {['Must/Essential', 'Should/Very important', 'Could/Nice to have', 'Not important'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="bestSelfBringing"
                    value={opt}
                    checked={formData.bestSelfBringing === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.bestSelfBringing && <span className="error-text">{errors.bestSelfBringing}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              Are you willing to work through difficult times together and grow as a couple?
            </label>
            <div className="radio-group">
              {['Yes, absolutely', 'Yes, probably', 'Maybe, depends on circumstances', 'Not sure'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="workThroughDifficulty"
                    value={opt}
                    checked={formData.workThroughDifficulty === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.workThroughDifficulty && <span className="error-text">{errors.workThroughDifficulty}</span>}
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

export default CompatibilityQuestionnaireLongTermShort;
