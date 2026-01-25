import { useState, useEffect } from 'react';
import Button from './Button';
import '../styles/compatibility-questionnaire.css';

/**
 * Lifestyle Questionnaire Component
 * 21-question form covering lifestyle values, financial attitudes, work-life balance,
 * health/wellness, family planning, and parenting philosophy
 */
function LifestyleQuestionnaire({ onSubmit, onCancel, initialResponses }) {
  const getInitialState = () => {
    const defaults = {
      1: '',  // Life priorities
      2: '',  // Risk approach
      3: '',  // Alone time vs social
      4: '',  // Individual vs collective
      5: '',  // Self-improvement
      6: '',  // Tradition vs innovation
      7: '',  // Money spending philosophy
      8: '',  // Financial transparency
      9: '',  // Debt tolerance
      10: '', // Investment & risk
      11: '', // Career priority
      12: '', // Ideal work hours
      13: '', // Work-life flexibility
      14: '', // Partner's career support
      15: '', // Health consciousness
      16: '', // Substance use philosophy
      17: '', // Mental health attitudes
      18: '', // Children desired
      19: '', // Family involvement
      20: '', // Parenting philosophy
      21: '', // Wake time preference
    };

    if (initialResponses) {
      return { ...defaults, ...initialResponses };
    }

    return defaults;
  };

  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialResponses arrive
  useEffect(() => {
    if (initialResponses && Object.keys(initialResponses).length > 0) {
      console.log('Updating lifestyle form with existing responses:', initialResponses);
      setFormData(prev => ({ ...prev, ...initialResponses }));
    }
  }, [initialResponses]);

  const validateForm = () => {
    const newErrors = {};
    
    for (let i = 1; i <= 21; i++) {
      const value = formData[i.toString()];
      // Use strict equality check to allow 0 for range sliders
      if (value === '' || value === null || value === undefined) {
        newErrors[i] = 'Required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRadioChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value,
    }));
    if (errors[questionId]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      onSubmit({
        type: 'lifestyle',
        relationshipType: 'monogamous',
        responses: formData,
      });
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="compatibility-questionnaire lifestyle-form">
      <div className="questionnaire-header">
        <h2>Lifestyle & Values Questionnaire</h2>
        <p className="subtitle">Tell us about your lifestyle choices, values, and priorities</p>
      </div>

      <form onSubmit={handleSubmit} className="compatibility-form">
        
        {/* Section 1: Core Values */}
        <div className="form-section">
          <h3>Core Values & Life Priorities</h3>
          
          <div className="question-block">
            <label className="question-label">1. In life, what matters most to me:</label>
            <div className="radio-group">
              {['Personal growth and self-improvement', 'Close relationships and family', 'Making a difference in the world', 'Enjoying life and having fun', 'Security and stability'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q1"
                    value={opt}
                    checked={formData['1'] === opt}
                    onChange={() => handleRadioChange('1', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['1'] && <span className="error-text">{errors['1']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">2. When facing a major decision, I:</label>
            <div className="radio-group">
              {['Play it safe and minimize risk', 'Take measured risks after careful thought', 'Trust my gut and go for it', 'Seek advice from people I trust', 'Research thoroughly before deciding'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q2"
                    value={opt}
                    checked={formData['2'] === opt}
                    onChange={() => handleRadioChange('2', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['2'] && <span className="error-text">{errors['2']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">3. I feel my best when:</label>
            <div className="radio-group">
              {['Alone or with my close partner', 'With a small group of close friends', 'With larger groups and meeting new people', 'Balancing alone time and social time equally', 'At large social events and gatherings'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q3"
                    value={opt}
                    checked={formData['3'] === opt}
                    onChange={() => handleRadioChange('3', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['3'] && <span className="error-text">{errors['3']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">4. I identify most as:</label>
            <div className="radio-group">
              {['Highly independent, self-reliant', 'Mostly independent with some interdependence', 'Balanced between independence and togetherness', 'Strong family/community ties are central', 'Family/group needs come before personal wants'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q4"
                    value={opt}
                    checked={formData['4'] === opt}
                    onChange={() => handleRadioChange('4', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['4'] && <span className="error-text">{errors['4']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">5. My focus on self-improvement is:</label>
            <div className="radio-group">
              {['Constant, always working on myself', 'Important, regularly focused on growth', 'Moderate, work on issues as they arise', 'Low priority, content with who I am', 'Not important, I am who I am'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q5"
                    value={opt}
                    checked={formData['5'] === opt}
                    onChange={() => handleRadioChange('5', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['5'] && <span className="error-text">{errors['5']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">6. I approach traditions and customs as:</label>
            <div className="radio-group">
              {['Important to maintain as passed down', 'Worth keeping but can modernize', 'Fine if they serve a purpose, otherwise discard', 'Would prefer to create new traditions'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q6"
                    value={opt}
                    checked={formData['6'] === opt}
                    onChange={() => handleRadioChange('6', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['6'] && <span className="error-text">{errors['6']}</span>}
          </div>
        </div>

        {/* Section 2: Financial Values */}
        <div className="form-section">
          <h3>Financial Values</h3>
          
          <div className="question-block">
            <label className="question-label">7. My approach to money is mostly:</label>
            <div className="radio-group">
              {['Save for future security', 'Enjoy life now, save moderately', 'Spend freely, don\'t worry about money', 'Balanced between spending and saving'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q7"
                    value={opt}
                    checked={formData['7'] === opt}
                    onChange={() => handleRadioChange('7', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['7'] && <span className="error-text">{errors['7']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">8. Regarding finances in a relationship, I believe:</label>
            <div className="radio-group">
              {['Complete transparency, combined accounts', 'Mostly transparent with some personal spending money', 'Mostly separate finances with shared household expenses', 'Completely separate finances'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q8"
                    value={opt}
                    checked={formData['8'] === opt}
                    onChange={() => handleRadioChange('8', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['8'] && <span className="error-text">{errors['8']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">9. My comfort level with debt is:</label>
            <div className="radio-group">
              {['Avoid debt at all costs', 'Acceptable for large purchases (home, education)', 'Comfortable with credit cards for flexibility', 'Finances are complex, use various debt tools'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q9"
                    value={opt}
                    checked={formData['9'] === opt}
                    onChange={() => handleRadioChange('9', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['9'] && <span className="error-text">{errors['9']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">10. Regarding money and risk, I prefer:</label>
            <div className="radio-group">
              {['Safe, conservative investments', 'Moderate, diversified approach', 'Growth-oriented, willing to take calculated risks', 'High-risk, high-reward opportunities'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q10"
                    value={opt}
                    checked={formData['10'] === opt}
                    onChange={() => handleRadioChange('10', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['10'] && <span className="error-text">{errors['10']}</span>}
          </div>
        </div>

        {/* Section 3: Work-Life Balance */}
        <div className="form-section">
          <h3>Work-Life Balance</h3>
          
          <div className="question-block">
            <label className="question-label">11. Career importance to me is:</label>
            <div className="radio-group">
              {['Primary life focus, willing to sacrifice for advancement', 'Very important, but balanced with personal life', 'Important, but secondary to family/relationships', 'Just a job, doesn\'t define me'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q11"
                    value={opt}
                    checked={formData['11'] === opt}
                    onChange={() => handleRadioChange('11', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['11'] && <span className="error-text">{errors['11']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">12. Ideal weekly work situation for me is:</label>
            <div className="radio-group">
              {['30-35 hours (part-time emphasis on other life areas)', '35-40 hours (standard, clear boundaries)', '40-50 hours (career-focused but some personal time)', '50+ hours (very career-focused)'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q12"
                    value={opt}
                    checked={formData['12'] === opt}
                    onChange={() => handleRadioChange('12', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['12'] && <span className="error-text">{errors['12']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">13. I require flexibility in my work because:</label>
            <div className="radio-group">
              {['I don\'t need flexibility, I prefer structure', 'Family responsibilities may require some flexibility', 'Health/wellness needs require flexible schedule', 'I prefer autonomy in when/where I work'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q13"
                    value={opt}
                    checked={formData['13'] === opt}
                    onChange={() => handleRadioChange('13', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['13'] && <span className="error-text">{errors['13']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">14. When my partner's career demands time, I:</label>
            <div className="radio-group">
              {['Expect them to prioritize our relationship', 'Understand periods of high demand and adapt', 'Support them fully even if it stresses our time together', 'Would struggle with this regularly'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q14"
                    value={opt}
                    checked={formData['14'] === opt}
                    onChange={() => handleRadioChange('14', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['14'] && <span className="error-text">{errors['14']}</span>}
          </div>
        </div>

        {/* Section 4: Health & Wellness */}
        <div className="form-section">
          <h3>Health & Wellness</h3>
          
          <div className="question-block">
            <label className="question-label">15. My approach to health is:</label>
            <div className="radio-group">
              {['Preventative/proactive, health is top priority', 'Moderate attention, reasonable healthy habits', 'Casual, I react when health issues arise', 'I don\'t think much about health'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q15"
                    value={opt}
                    checked={formData['15'] === opt}
                    onChange={() => handleRadioChange('15', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['15'] && <span className="error-text">{errors['15']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">16. My comfort with alcohol/drugs is:</label>
            <div className="radio-group">
              {['None, prefer not to use', 'Social use only, occasional', 'Regular social use, part of my lifestyle', 'Frequent use is normal and acceptable'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q16"
                    value={opt}
                    checked={formData['16'] === opt}
                    onChange={() => handleRadioChange('16', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['16'] && <span className="error-text">{errors['16']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">17. Regarding therapy/mental health support, I:</label>
            <div className="radio-group">
              {['See it as important tool, would use if needed', 'Open to it but prefer to handle things myself', 'Skeptical of therapy\'s value', 'Don\'t believe in psychological issues needing professional help'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q17"
                    value={opt}
                    checked={formData['17'] === opt}
                    onChange={() => handleRadioChange('17', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['17'] && <span className="error-text">{errors['17']}</span>}
          </div>
        </div>

        {/* Section 5: Family & Parenting */}
        <div className="form-section">
          <h3>Family & Parenting</h3>
          
          <div className="question-block">
            <label className="question-label">18. My feelings about having children:</label>
            <div className="radio-group">
              {['Want children, planning to have them', 'Open to children, would be happy either way', 'Uncertain about children', 'Prefer not to have children'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q18"
                    value={opt}
                    checked={formData['18'] === opt}
                    onChange={() => handleRadioChange('18', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['18'] && <span className="error-text">{errors['18']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">19. Regarding extended family involvement in my life:</label>
            <div className="radio-group">
              {['Very close, important regular involvement', 'Moderate involvement, family is important', 'Limited involvement by preference', 'Minimal involvement, independence priority'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q19"
                    value={opt}
                    checked={formData['19'] === opt}
                    onChange={() => handleRadioChange('19', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['19'] && <span className="error-text">{errors['19']}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">20. If I become a parent, my approach would be:</label>
            <div className="radio-group">
              {['Structured, rules-focused (authoritarian)', 'Balanced rules with warm engagement (authoritative)', 'Permissive, child-focused, flexible', 'Uncertain/would figure out with partner'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q20"
                    value={opt}
                    checked={formData['20'] === opt}
                    onChange={() => handleRadioChange('20', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['20'] && <span className="error-text">{errors['20']}</span>}
          </div>
        </div>

        {/* Section 6: Daily Rhythm */}
        <div className="form-section">
          <h3>Daily Rhythm & Energy</h3>
          
          <div className="question-block">
            <label className="question-label">21. I'm most energized and productive:</label>
            <div className="radio-group">
              {['Very early morning person (5-6 AM wake)', 'Morning person (6-7 AM wake)', 'Midday (8-9 AM wake)', 'Evening person (9+ AM wake)', 'Night person (midnight or later)'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="q21"
                    value={opt}
                    checked={formData['21'] === opt}
                    onChange={() => handleRadioChange('21', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors['21'] && <span className="error-text">{errors['21']}</span>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LifestyleQuestionnaire;
