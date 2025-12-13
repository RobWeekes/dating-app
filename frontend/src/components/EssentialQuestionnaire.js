import { useState } from 'react';
import Button from './Button';
import '../styles/compatibility-questionnaire.css';

/**
 * Essential Questionnaire Component
 * Personality and lifestyle questionnaire focusing on core attributes
 * Single-page form with 27 questions covering:
 * - Love languages, political compass, birth order
 * - Sleep patterns, personality archetypes, social inclination
 * - Humor and entertainment preferences
 * - Activities and social habits
 * - Substance use and pets
 * - Personality era, conflict style
 * - Financial and family relationships
 * - Timeline expectations for engagement
 */
function EssentialQuestionnaire({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    // Love Languages
    loveLangs: [],
    
    // Political Compass
    politicalCompass: '',
    
    // Birth Order
    birthOrder: '',
    
    // Sleep Tendency
    sleepTendency: '',
    
    // Personality Archetype
    personalityArchetype: '',
    
    // Social Inclination (Slider)
    socialInclination: 50,
    
    // Sense of Humor
    senseOfHumor: '',
    
    // Laughter Frequency
    laughFrequency: '',
    
    // Musical Tastes
    musicalTastes: [],
    
    // Indoor vs Outdoor (Slider)
    indoorOutdoor: 50,
    
    // Entertainment Preferences
    entertainment: [],
    
    // Hobbies
    hobbies: [],
    
    // Outdoor Activities
    outdoorActivities: [],
    
    // Socialization Frequency
    socializationFrequency: '',
    
    // Drinking Habits
    drinkingHabits: '',
    
    // Smoking
    smoking: '',
    
    // Recreational Drugs
    recreationalDrugs: '',
    
    // Pets
    pets: '',
    
    // Personality Era
    personalityEra: '',
    
    // Conflict Style
    conflictStyle: '',
    
    // Problem Handling
    problemHandling: '',
    
    // Financial Habits
    financialHabits: '',
    
    // Family Relationship
    familyRelationship: '',
    
    // Dating Duration Before Engagement
    datingDuration: '',
    
    // Engagement Duration Before Wedding
    engagementDuration: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.loveLangs.length === 0) newErrors.loveLangs = 'Select at least 1 love language';
    if (!formData.politicalCompass) newErrors.politicalCompass = 'Required';
    if (!formData.birthOrder) newErrors.birthOrder = 'Required';
    if (!formData.sleepTendency) newErrors.sleepTendency = 'Required';
    if (!formData.personalityArchetype) newErrors.personalityArchetype = 'Required';
    if (!formData.senseOfHumor) newErrors.senseOfHumor = 'Required';
    if (!formData.laughFrequency) newErrors.laughFrequency = 'Required';
    if (formData.musicalTastes.length === 0) newErrors.musicalTastes = 'Select at least 1 genre';
    if (!formData.entertainment || formData.entertainment.length === 0) newErrors.entertainment = 'Select at least 1 activity';
    if (formData.hobbies.length === 0) newErrors.hobbies = 'Select at least 1 hobby';
    if (formData.outdoorActivities.length === 0) newErrors.outdoorActivities = 'Select at least 1 activity';
    if (!formData.socializationFrequency) newErrors.socializationFrequency = 'Required';
    if (!formData.drinkingHabits) newErrors.drinkingHabits = 'Required';
    if (!formData.smoking) newErrors.smoking = 'Required';
    if (!formData.recreationalDrugs) newErrors.recreationalDrugs = 'Required';
    if (!formData.pets) newErrors.pets = 'Required';
    if (!formData.personalityEra) newErrors.personalityEra = 'Required';
    if (!formData.conflictStyle) newErrors.conflictStyle = 'Required';
    if (!formData.problemHandling) newErrors.problemHandling = 'Required';
    if (!formData.financialHabits) newErrors.financialHabits = 'Required';
    if (!formData.familyRelationship) newErrors.familyRelationship = 'Required';
    if (!formData.datingDuration) newErrors.datingDuration = 'Required';
    if (!formData.engagementDuration) newErrors.engagementDuration = 'Required';
    
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

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [fieldName]: checked
        ? [...prev[fieldName], value]
        : prev[fieldName].filter(item => item !== value),
    }));
    if (errors[fieldName]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldName];
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
        type: 'ESSENTIAL',
        relationshipType: 'ALL',
        responses: formData,
        completedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loveLanguages = ['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'];
  const politicalCompassOptions = ['Left/Progressive', 'Center-Left', 'Center-Right', 'Right/Conservative'];
  const birthOrderOptions = ['Only child', 'First born', 'Middle child', 'Baby of the family'];
  const sleepOptions = ['Early bird', 'Standard (sleep around midnight)', 'Night owl', 'Vampire'];
  const archetypeOptions = ['The Hero', 'The Shadow', 'The Wise Old Man/Woman', 'The Innocent', 'The Explorer', 'The Lover', 'The Creator', 'The Caregiver', 'The Everyman', 'The Jester', 'The Sage', 'The Magician'];
  const humorOptions = ['Slapstick', 'Playful/Silly', 'Dry/Sarcastic', 'Serious/Only when in mood', "I don't like jokes"];
  const laughOptions = ['Easily & often', 'Sometimes', 'Only in the right company', 'Life is serious, I take it serious'];
  const musicGenres = ['Pop', 'Rock', 'Hip-Hop/Rap', 'Country', 'R&B/Soul', 'Jazz', 'Electronic/EDM', 'Classical', 'Indie', 'Metal', 'Latin', 'Folk', 'K-Pop', 'Disco', 'Reggae'];
  const entertainmentOptions = ['Travel', 'Movies', 'TV/Shows', 'Music/Concerts', 'Gaming', 'Exercise/Gym', 'Outdoor activities', 'Reading', 'Cooking', 'Art/Museums', 'Dining out', 'Nightlife/Clubs'];
  const hobbiesOptions = ['Photography', 'Painting/Drawing', 'Writing', 'Music (playing)', 'Sports', 'Yoga', 'Meditation', 'DIY/Crafts', 'Cooking', 'Gardening', 'Collecting', 'Volunteering', 'Gaming', 'Movies', 'Reading'];
  const outdoorActivitiesOptions = ['Hiking', 'Camping', 'Rock climbing', 'Water sports', 'Cycling', 'Picnicking', 'Beach activities', 'Skiing/Snowboarding', 'Fishing', 'Kayaking', 'Skateboarding', 'Running/Jogging'];
  const socializationOptions = ['Occasionally', 'Once a month', 'Once a week', 'More than once per week'];
  const drinkingOptions = ["I don't drink", 'Recovered alcoholic', 'Once in a while', 'Social drinker', 'Party animal'];
  const smokingOptions = ['No', 'Rarely', 'Weekly', 'Daily'];
  const drugsOptions = ['None', 'Cannabis', 'Psychedelics', 'Heavy user'];
  const petsOptions = ['Have pets', 'Want pets', "Don't want pets"];
  const eraOptions = ["'50s", "'60s", "'70s/'80s", "'90s"];
  const conflictOptions = ['Opinionated/Speak my mind', "Don't talk unless I have something to say", 'I prefer to avoid conflict'];
  const problemOptions = ['Avoid problems/do something else', 'Plan solutions methodically', "Tackle problems head on/'wing it'"];
  const financeOptions = ['Budget everything in advance', 'Check finances occasionally', "Don't worry about spending"];
  const familyOptions = ['Not speaking', 'Talk occasionally on the phone', 'Regular phone calls', 'Regular visits'];
  const datingDurationOptions = ['6 months or less', '6-12 months', '1-2 years', '3-4 years', '5 years+'];
  const engagementDurationOptions = ['6 months or less', '6-12 months', '1-2 years', '3-4 years', '5 years+'];

  const getSocialInclinationLabel = (value) => {
    if (value < 25) return 'Introvert - Shy';
    if (value < 50) return 'Introvert - Shy to Ambivert';
    if (value < 75) return 'Ambivert - Versatile';
    if (value < 100) return 'Extrovert';
    return 'Extrovert - Life of the party';
  };

  const getIndoorOutdoorLabel = (value) => {
    if (value < 25) return 'Homebody';
    if (value < 50) return 'Prefer indoors';
    if (value < 75) return 'Combination';
    if (value < 100) return 'Prefer outdoors';
    return 'Adventurer';
  };

  return (
    <div className="compatibility-questionnaire essential-form">
      <div className="questionnaire-header">
        <h2>Essential Questionnaire</h2>
        <p className="subtitle">Discover your personality, lifestyle, and compatibility traits</p>
      </div>

      <form onSubmit={handleSubmit} className="compatibility-form">
        
        {/* Section 1: Love Languages */}
        <div className="form-section">
          <h3>Love & Connection</h3>
          
          <div className="question-block">
            <label className="question-label">What is your love language? (Select top 2)</label>
            <div className="checkbox-group">
              {loveLanguages.map(lang => (
                <label key={lang} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={lang}
                    checked={formData.loveLangs.includes(lang)}
                    onChange={(e) => handleCheckboxChange(e, 'loveLangs')}
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
            {errors.loveLangs && <span className="error-text">{errors.loveLangs}</span>}
          </div>
        </div>

        {/* Section 2: Political & Background */}
        <div className="form-section">
          <h3>Values & Background</h3>
          
          <div className="question-block">
            <label className="question-label">What is your political compass? (Choose 1)</label>
            <div className="radio-group">
              {politicalCompassOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="politicalCompass"
                    value={opt}
                    checked={formData.politicalCompass === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.politicalCompass && <span className="error-text">{errors.politicalCompass}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">What is your birth order?</label>
            <div className="radio-group">
              {birthOrderOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="birthOrder"
                    value={opt}
                    checked={formData.birthOrder === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.birthOrder && <span className="error-text">{errors.birthOrder}</span>}
          </div>
        </div>

        {/* Section 3: Sleep & Personality */}
        <div className="form-section">
          <h3>Sleep & Personality</h3>
          
          <div className="question-block">
            <label className="question-label">What is your sleep tendency?</label>
            <div className="radio-group">
              {sleepOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="sleepTendency"
                    value={opt}
                    checked={formData.sleepTendency === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.sleepTendency && <span className="error-text">{errors.sleepTendency}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">What is your personality archetype?</label>
            <div className="radio-group">
              {archetypeOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="personalityArchetype"
                    value={opt}
                    checked={formData.personalityArchetype === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.personalityArchetype && <span className="error-text">{errors.personalityArchetype}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              Social Inclination: {getSocialInclinationLabel(formData.socialInclination)}
            </label>
            <input
              type="range"
              name="socialInclination"
              min="0"
              max="100"
              value={formData.socialInclination}
              onChange={handleSliderChange}
              className="slider"
            />
            <div className="slider-labels">
              <span>Introvert - Shy</span>
              <span>Ambivert - Versatile</span>
              <span>Extrovert - Life of the party</span>
            </div>
          </div>
        </div>

        {/* Section 4: Humor & Laughter */}
        <div className="form-section">
          <h3>Humor & Laughter</h3>
          
          <div className="question-block">
            <label className="question-label">What is your sense of humor?</label>
            <div className="radio-group">
              {humorOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="senseOfHumor"
                    value={opt}
                    checked={formData.senseOfHumor === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.senseOfHumor && <span className="error-text">{errors.senseOfHumor}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">I like to laugh:</label>
            <div className="radio-group">
              {laughOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="laughFrequency"
                    value={opt}
                    checked={formData.laughFrequency === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.laughFrequency && <span className="error-text">{errors.laughFrequency}</span>}
          </div>
        </div>

        {/* Section 5: Entertainment & Hobbies */}
        <div className="form-section">
          <h3>Entertainment & Hobbies</h3>
          
          <div className="question-block">
            <label className="question-label">Musical Tastes (Choose more than 1)</label>
            <div className="checkbox-group">
              {musicGenres.map(genre => (
                <label key={genre} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.musicalTastes.includes(genre)}
                    onChange={(e) => handleCheckboxChange(e, 'musicalTastes')}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
            {errors.musicalTastes && <span className="error-text">{errors.musicalTastes}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">
              Do you prefer: {getIndoorOutdoorLabel(formData.indoorOutdoor)}
            </label>
            <input
              type="range"
              name="indoorOutdoor"
              min="0"
              max="100"
              value={formData.indoorOutdoor}
              onChange={handleSliderChange}
              className="slider"
            />
            <div className="slider-labels">
              <span>Homebody</span>
              <span>Combination</span>
              <span>Adventurer</span>
            </div>
          </div>

          <div className="question-block">
            <label className="question-label">Select your preferred entertainment (Choose more than 1)</label>
            <div className="checkbox-group">
              {entertainmentOptions.map(opt => (
                <label key={opt} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={formData.entertainment.includes(opt)}
                    onChange={(e) => handleCheckboxChange(e, 'entertainment')}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.entertainment && <span className="error-text">{errors.entertainment}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Select your hobbies (Choose more than 1)</label>
            <div className="checkbox-group">
              {hobbiesOptions.map(hobby => (
                <label key={hobby} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={hobby}
                    checked={formData.hobbies.includes(hobby)}
                    onChange={(e) => handleCheckboxChange(e, 'hobbies')}
                  />
                  <span>{hobby}</span>
                </label>
              ))}
            </div>
            {errors.hobbies && <span className="error-text">{errors.hobbies}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">List any outdoor activities you enjoy (Choose more than 1)</label>
            <div className="checkbox-group">
              {outdoorActivitiesOptions.map(activity => (
                <label key={activity} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={activity}
                    checked={formData.outdoorActivities.includes(activity)}
                    onChange={(e) => handleCheckboxChange(e, 'outdoorActivities')}
                  />
                  <span>{activity}</span>
                </label>
              ))}
            </div>
            {errors.outdoorActivities && <span className="error-text">{errors.outdoorActivities}</span>}
          </div>
        </div>

        {/* Section 6: Social & Substance Habits */}
        <div className="form-section">
          <h3>Lifestyle & Habits</h3>
          
          <div className="question-block">
            <label className="question-label">How often do you socialize with friends or family?</label>
            <div className="radio-group">
              {socializationOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="socializationFrequency"
                    value={opt}
                    checked={formData.socializationFrequency === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.socializationFrequency && <span className="error-text">{errors.socializationFrequency}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">How often do you drink?</label>
            <div className="radio-group">
              {drinkingOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="drinkingHabits"
                    value={opt}
                    checked={formData.drinkingHabits === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.drinkingHabits && <span className="error-text">{errors.drinkingHabits}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Are you a smoker?</label>
            <div className="radio-group">
              {smokingOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="smoking"
                    value={opt}
                    checked={formData.smoking === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.smoking && <span className="error-text">{errors.smoking}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Other recreational drugs?</label>
            <div className="radio-group">
              {drugsOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="recreationalDrugs"
                    value={opt}
                    checked={formData.recreationalDrugs === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.recreationalDrugs && <span className="error-text">{errors.recreationalDrugs}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Do you: (Pets)</label>
            <div className="radio-group">
              {petsOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="pets"
                    value={opt}
                    checked={formData.pets === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.pets && <span className="error-text">{errors.pets}</span>}
          </div>
        </div>

        {/* Section 7: Personality & Communication */}
        <div className="form-section">
          <h3>Personality & Communication Style</h3>
          
          <div className="question-block">
            <label className="question-label">My personality is most like the:</label>
            <div className="radio-group">
              {eraOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="personalityEra"
                    value={opt}
                    checked={formData.personalityEra === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.personalityEra && <span className="error-text">{errors.personalityEra}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">Conflict preference style:</label>
            <div className="radio-group">
              {conflictOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="conflictStyle"
                    value={opt}
                    checked={formData.conflictStyle === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.conflictStyle && <span className="error-text">{errors.conflictStyle}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">How do you handle problems / stress?</label>
            <div className="radio-group">
              {problemOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="problemHandling"
                    value={opt}
                    checked={formData.problemHandling === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.problemHandling && <span className="error-text">{errors.problemHandling}</span>}
          </div>
        </div>

        {/* Section 8: Financial & Family */}
        <div className="form-section">
          <h3>Finances & Family</h3>
          
          <div className="question-block">
            <label className="question-label">How are you with finances?</label>
            <div className="radio-group">
              {financeOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="financialHabits"
                    value={opt}
                    checked={formData.financialHabits === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.financialHabits && <span className="error-text">{errors.financialHabits}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">How do you get along with your parents & family?</label>
            <div className="radio-group">
              {familyOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="familyRelationship"
                    value={opt}
                    checked={formData.familyRelationship === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.familyRelationship && <span className="error-text">{errors.familyRelationship}</span>}
          </div>
        </div>

        {/* Section 9: Relationship Timeline */}
        <div className="form-section">
          <h3>Relationship Timeline Expectations</h3>
          
          <div className="question-block">
            <label className="question-label">How long would you like to date someone before getting engaged?</label>
            <div className="radio-group">
              {datingDurationOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="datingDuration"
                    value={opt}
                    checked={formData.datingDuration === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.datingDuration && <span className="error-text">{errors.datingDuration}</span>}
          </div>

          <div className="question-block">
            <label className="question-label">How long would you like to be engaged before a wedding date?</label>
            <div className="radio-group">
              {engagementDurationOptions.map(opt => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name="engagementDuration"
                    value={opt}
                    checked={formData.engagementDuration === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors.engagementDuration && <span className="error-text">{errors.engagementDuration}</span>}
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
