import { useState } from 'react';
import Button from './Button';
import '../styles/compatibility-questionnaire.css';

/**
 * Essential Questionnaire Component
 * Comprehensive 27-question form for dating compatibility
 */
function EssentialQuestionnaire({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    1: [],  // Love languages (checkbox)
    2: '',  // Political views (radio)
    3: '',  // Birth order (radio)
    4: '',  // Sleep pattern (radio)
    5: '',  // Personality archetype (radio)
    6: 50,  // Social inclination (range)
    7: '',  // Sense of humor (radio)
    8: '',  // Laughter frequency (radio)
    9: [],  // Music genres (checkbox)
    10: 50, // Indoor vs outdoor (range)
    11: [], // Entertainment preferences (checkbox)
    12: [], // Hobbies (checkbox)
    13: [], // Outdoor activities (checkbox)
    14: '', // Socialization frequency (radio)
    15: '', // Drinking habits (radio)
    16: '', // Smoking (radio)
    17: '', // Recreational drugs (radio)
    18: '', // Pets (radio)
    19: '', // Personality era (radio)
    20: '', // Conflict style (radio)
    21: '', // Problem handling (radio)
    22: '', // Financial habits (radio)
    23: '', // Family relationship (radio)
    24: '', // Dating duration (radio)
    25: '', // Engagement duration (radio)
    26: '', // What are you looking for (radio)
    27: '', // Do you want kids (radio)
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Check all required fields
    for (let i = 1; i <= 27; i++) {
      const value = formData[i.toString()];
      if (Array.isArray(value)) {
        if (value.length === 0) newErrors[i] = 'Required';
      } else if (!value) {
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

  const handleCheckboxChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: prev[questionId].includes(value)
        ? prev[questionId].filter(item => item !== value)
        : [...prev[questionId], value],
    }));
    if (errors[questionId]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const handleSliderChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: parseInt(value, 10),
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
        type: 'essential',
        relationshipType: 'monogamous',
        responses: formData,
      });
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialLabel = (value) => {
    if (value < 25) return 'Introvert - Shy';
    if (value < 50) return 'Introvert to Ambivert';
    if (value < 75) return 'Ambivert';
    return 'Extrovert';
  };

  const getIndoorLabel = (value) => {
    if (value < 25) return 'Homebody';
    if (value < 50) return 'Prefer indoors';
    if (value < 75) return 'Mixed';
    return 'Adventurer';
  };

  return (
    <div className="compatibility-questionnaire essential-form">
      <div className="questionnaire-header">
        <h2>Essential Questionnaire</h2>
        <p className="subtitle">Discover your personality, lifestyle, and compatibility traits</p>
      </div>

      <form onSubmit={handleSubmit} className="compatibility-form">
        
        {/* Section 1: Love & Connection */}
        <div className="form-section">
          <h3>Love & Connection</h3>
          <div className="question-block">
            <label className="question-label">What is your love language? (Select top 2)</label>
            <div className="checkbox-group">
              {['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'].map(lang => (
                <label key={lang} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData[1].includes(lang)}
                    onChange={() => handleCheckboxChange(1, lang)}
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
            {errors[1] && <span className="error-text">{errors[1]}</span>}
          </div>
        </div>

        {/* Section 2: Core Beliefs */}
        <div className="form-section">
          <h3>Core Beliefs & Values</h3>
          
          <div className="question-block">
            <label className="question-label">My political views are:</label>
            <div className="radio-group">
              {['Left/Progressive', 'Center-Left', 'Center-Right', 'Right/Conservative'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="political"
                    value={opt}
                    checked={formData[2] === opt}
                    onChange={() => handleRadioChange(2, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[2] && <span className="error-text">{errors[2]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Birth order:</label>
            <div className="radio-group">
              {['Only child', 'First born', 'Middle child', 'Baby of the family'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="birth-order"
                    value={opt}
                    checked={formData[3] === opt}
                    onChange={() => handleRadioChange(3, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[3] && <span className="error-text">{errors[3]}</span>}
          </div>
        </div>

        {/* Section 3: Sleep & Rest */}
        <div className="form-section">
          <h3>Sleep & Rest</h3>
          <div className="question-block">
            <label className="question-label">Sleep pattern:</label>
            <div className="radio-group">
              {['Early bird', 'Standard (sleep around midnight)', 'Night owl', 'Vampire'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="sleep"
                    value={opt}
                    checked={formData[4] === opt}
                    onChange={() => handleRadioChange(4, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[4] && <span className="error-text">{errors[4]}</span>}
          </div>
        </div>

        {/* Section 4: Personality */}
        <div className="form-section">
          <h3>Personality & Demeanor</h3>
          
          <div className="question-block">
            <label className="question-label">My personality archetype is:</label>
            <div className="radio-group">
              {['The Hero', 'The Shadow', 'The Wise Old Man/Woman', 'The Innocent', 'The Explorer', 'The Lover', 'The Creator', 'The Caregiver', 'The Everyman', 'The Jester', 'The Sage', 'The Magician'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="archetype"
                    value={opt}
                    checked={formData[5] === opt}
                    onChange={() => handleRadioChange(5, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[5] && <span className="error-text">{errors[5]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Social inclination: <strong>{getSocialLabel(formData[6])}</strong></label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData[6]}
              onChange={(e) => handleSliderChange(6, e.target.value)}
              className="slider"
            />
            {errors[6] && <span className="error-text">{errors[6]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">My sense of humor is:</label>
            <div className="radio-group">
              {['Slapstick', 'Playful/Silly', 'Dry/Sarcastic', 'Serious/Only when in mood', "I don't like jokes"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="humor"
                    value={opt}
                    checked={formData[7] === opt}
                    onChange={() => handleRadioChange(7, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[7] && <span className="error-text">{errors[7]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">How often do you laugh?</label>
            <div className="radio-group">
              {['Easily & often', 'Sometimes', 'Only in the right company', 'Life is serious, I take it serious'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="laugh"
                    value={opt}
                    checked={formData[8] === opt}
                    onChange={() => handleRadioChange(8, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[8] && <span className="error-text">{errors[8]}</span>}
          </div>
        </div>

        {/* Section 5: Entertainment & Activities */}
        <div className="form-section">
          <h3>Entertainment & Activities</h3>
          
          <div className="question-block">
            <label className="question-label">What music genres do you enjoy?</label>
            <div className="checkbox-group">
              {['Pop', 'Rock', 'Hip-Hop/Rap', 'Country', 'R&B/Soul', 'Jazz', 'Electronic/EDM', 'Classical', 'Indie', 'Metal', 'Latin', 'Folk', 'K-Pop', 'Disco', 'Reggae'].map(genre => (
                <label key={genre} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData[9].includes(genre)}
                    onChange={() => handleCheckboxChange(9, genre)}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
            {errors[9] && <span className="error-text">{errors[9]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Indoor vs Outdoor: <strong>{getIndoorLabel(formData[10])}</strong></label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData[10]}
              onChange={(e) => handleSliderChange(10, e.target.value)}
              className="slider"
            />
            {errors[10] && <span className="error-text">{errors[10]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Entertainment preferences:</label>
            <div className="checkbox-group">
              {['Travel', 'Movies', 'TV/Shows', 'Music/Concerts', 'Gaming', 'Exercise/Gym', 'Outdoor activities', 'Reading', 'Cooking', 'Art/Museums', 'Dining out', 'Nightlife/Clubs'].map(opt => (
                <label key={opt} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData[11].includes(opt)}
                    onChange={() => handleCheckboxChange(11, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[11] && <span className="error-text">{errors[11]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">What are your hobbies?</label>
            <div className="checkbox-group">
              {['Photography', 'Painting/Drawing', 'Writing', 'Music (playing)', 'Sports', 'Yoga', 'Meditation', 'DIY/Crafts', 'Cooking', 'Gardening', 'Collecting', 'Volunteering', 'Gaming', 'Movies', 'Reading'].map(opt => (
                <label key={opt} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData[12].includes(opt)}
                    onChange={() => handleCheckboxChange(12, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[12] && <span className="error-text">{errors[12]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Outdoor activities:</label>
            <div className="checkbox-group">
              {['Hiking', 'Camping', 'Rock climbing', 'Water sports', 'Cycling', 'Picnicking', 'Beach activities', 'Skiing/Snowboarding', 'Fishing', 'Kayaking', 'Skateboarding', 'Running/Jogging'].map(opt => (
                <label key={opt} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData[13].includes(opt)}
                    onChange={() => handleCheckboxChange(13, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[13] && <span className="error-text">{errors[13]}</span>}
          </div>
        </div>

        {/* Section 6: Social & Lifestyle */}
        <div className="form-section">
          <h3>Social & Lifestyle Habits</h3>
          
          <div className="question-block">
            <label className="question-label">How often do you socialize?</label>
            <div className="radio-group">
              {['Occasionally', 'Once a month', 'Once a week', 'More than once per week'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="social"
                    value={opt}
                    checked={formData[14] === opt}
                    onChange={() => handleRadioChange(14, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[14] && <span className="error-text">{errors[14]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Drinking habits:</label>
            <div className="radio-group">
              {["I don't drink", 'Recovered alcoholic', 'Once in a while', 'Social drinker', 'Party animal'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="drinking"
                    value={opt}
                    checked={formData[15] === opt}
                    onChange={() => handleRadioChange(15, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[15] && <span className="error-text">{errors[15]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Do you smoke?</label>
            <div className="radio-group">
              {['No', 'Rarely', 'Weekly', 'Daily'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="smoking"
                    value={opt}
                    checked={formData[16] === opt}
                    onChange={() => handleRadioChange(16, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[16] && <span className="error-text">{errors[16]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Recreational drugs:</label>
            <div className="radio-group">
              {['None', 'Cannabis', 'Psychedelics', 'Heavy user'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="drugs"
                    value={opt}
                    checked={formData[17] === opt}
                    onChange={() => handleRadioChange(17, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[17] && <span className="error-text">{errors[17]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Regarding pets:</label>
            <div className="radio-group">
              {['Have pets', 'Want pets', "Don't want pets"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="pets"
                    value={opt}
                    checked={formData[18] === opt}
                    onChange={() => handleRadioChange(18, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[18] && <span className="error-text">{errors[18]}</span>}
          </div>
        </div>

        {/* Section 7: Personality & Communication */}
        <div className="form-section">
          <h3>Personality & Communication Style</h3>
          
          <div className="question-block">
            <label className="question-label">My personality is most like the:</label>
            <div className="radio-group">
              {["'50s", "'60s", "'70s/'80s", "'90s"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="era"
                    value={opt}
                    checked={formData[19] === opt}
                    onChange={() => handleRadioChange(19, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[19] && <span className="error-text">{errors[19]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Conflict preference style:</label>
            <div className="radio-group">
              {['Opinionated/Speak my mind', "Don't talk unless I have something to say", 'I prefer to avoid conflict'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="conflict"
                    value={opt}
                    checked={formData[20] === opt}
                    onChange={() => handleRadioChange(20, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[20] && <span className="error-text">{errors[20]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">How do you handle problems/stress?</label>
            <div className="radio-group">
              {['Avoid problems/do something else', 'Plan solutions methodically', "Tackle problems head on/'wing it'"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="problems"
                    value={opt}
                    checked={formData[21] === opt}
                    onChange={() => handleRadioChange(21, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[21] && <span className="error-text">{errors[21]}</span>}
          </div>
        </div>

        {/* Section 8: Financial & Family */}
        <div className="form-section">
          <h3>Finances & Family</h3>
          
          <div className="question-block">
            <label className="question-label">Financial approach:</label>
            <div className="radio-group">
              {['Budget everything in advance', 'Check finances occasionally', "Don't worry about spending"].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="finance"
                    value={opt}
                    checked={formData[22] === opt}
                    onChange={() => handleRadioChange(22, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[22] && <span className="error-text">{errors[22]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Family relationship:</label>
            <div className="radio-group">
              {['Not speaking', 'Talk occasionally on the phone', 'Regular phone calls', 'Regular visits'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="family"
                    value={opt}
                    checked={formData[23] === opt}
                    onChange={() => handleRadioChange(23, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[23] && <span className="error-text">{errors[23]}</span>}
          </div>
        </div>

        {/* Section 9: Relationship Timeline */}
        <div className="form-section">
          <h3>Relationship Timeline Expectations</h3>
          
          <div className="question-block">
            <label className="question-label">Dating duration before engagement:</label>
            <div className="radio-group">
              {['6 months or less', '6-12 months', '1-2 years', '3-4 years', '5 years+'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="dating-duration"
                    value={opt}
                    checked={formData[24] === opt}
                    onChange={() => handleRadioChange(24, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[24] && <span className="error-text">{errors[24]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Engagement duration before wedding:</label>
            <div className="radio-group">
              {['6 months or less', '6-12 months', '1-2 years', '3-4 years', '5 years+'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="engagement-duration"
                    value={opt}
                    checked={formData[25] === opt}
                    onChange={() => handleRadioChange(25, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[25] && <span className="error-text">{errors[25]}</span>}
          </div>
        </div>

        {/* Section 10: Relationship Expectations */}
        <div className="form-section">
          <h3>Relationship Expectations</h3>
          
          <div className="question-block">
            <label className="question-label">What are you looking for?</label>
            <div className="radio-group">
              {['Something serious', 'Casual dating', 'Not sure'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="looking-for"
                    value={opt}
                    checked={formData[26] === opt}
                    onChange={() => handleRadioChange(26, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[26] && <span className="error-text">{errors[26]}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Do you want kids?</label>
            <div className="radio-group">
              {['Yes', 'No', 'Maybe'].map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="kids"
                    value={opt}
                    checked={formData[27] === opt}
                    onChange={() => handleRadioChange(27, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[27] && <span className="error-text">{errors[27]}</span>}
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

export default EssentialQuestionnaire;
