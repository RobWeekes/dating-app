# Essential Questionnaire Integration Guide

Quick-start guide for integrating the Essential Questionnaire component into your application.

---

## 1. Component Import

```javascript
import EssentialQuestionnaire from '../components/EssentialQuestionnaire';
```

---

## 2. Basic Usage

```javascript
import { useNavigate } from 'react-router-dom';
import EssentialQuestionnaire from '../components/EssentialQuestionnaire';

function MyQuestionnaireePage() {
  const navigate = useNavigate();

  const handleQuestionnaireSubmit = async (data) => {
    try {
      // Send to your API
      const response = await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        navigate('/profile'); // or wherever you want to redirect
      }
    } catch (error) {
      console.error('Error saving questionnaire:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <EssentialQuestionnaire
      onSubmit={handleQuestionnaireSubmit}
      onCancel={handleCancel}
    />
  );
}

export default MyQuestionnaireePage;
```

---

## 3. Routing Setup

```javascript
// In your main router file (e.g., App.js or routes.js)
import EssentialQuestionnaire from './components/EssentialQuestionnaire';

const routes = [
  // ... other routes
  {
    path: '/essential-questionnaire',
    element: <EssentialQuestionnaire onSubmit={handleSubmit} onCancel={handleCancel} />,
  },
];
```

Or with React Router:

```javascript
<Route 
  path="/essential-questionnaire" 
  element={
    <EssentialQuestionnaire 
      onSubmit={handleSubmit} 
      onCancel={handleCancel} 
    />
  } 
/>
```

---

## 4. Redux Integration (Optional)

### Store Setup

```javascript
// questionnairesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const questionnairesSlice = createSlice({
  name: 'questionnaires',
  initialState: {
    essential: null,
    loading: false,
    error: null,
  },
  reducers: {
    submitEssentialQuestionnaire(state, action) {
      state.loading = true;
    },
    submitEssentialQuestionnaireSuccess(state, action) {
      state.essential = action.payload;
      state.loading = false;
      state.error = null;
    },
    submitEssentialQuestionnaireFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default questionnairesSlice.reducer;
```

### Component Usage with Redux

```javascript
import { useDispatch } from 'react-redux';
import { submitEssentialQuestionnaire } from './questionnairesSlice';
import EssentialQuestionnaire from '../components/EssentialQuestionnaire';

function QuestionnaireContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    dispatch(submitEssentialQuestionnaire(data));
    navigate('/profile');
  };

  return (
    <EssentialQuestionnaire
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
}
```

---

## 5. API Endpoint Example

### POST /api/questionnaires

```javascript
// Backend route handler (Express.js example)
app.post('/api/questionnaires', authenticate, async (req, res) => {
  const { type, relationshipType, responses, completedAt } = req.body;
  
  try {
    const questionnaire = await db.Questionnaire.create({
      userId: req.user.id,
      personalityType: type,
      relationshipType: relationshipType,
      responses: responses,
      createdAt: completedAt,
      updatedAt: completedAt,
    });

    // Optionally calculate personality scores here
    const personalityScores = calculatePersonalityScores(responses);
    
    // Save scores to user model if needed
    await db.User.update(
      { personalityScores: personalityScores },
      { where: { id: req.user.id } }
    );

    res.json({
      message: 'Questionnaire saved successfully',
      questionnaire,
      personalityScores,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 6. Database Schema

### Questionnaires Table

```sql
CREATE TABLE questionnaires (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  personalityType VARCHAR(50),
  relationshipType VARCHAR(50),
  responses JSON NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Users Table (Optional - for storing scores)

```sql
ALTER TABLE users ADD COLUMN personalityScores JSON;
```

---

## 7. Data Validation

### Validate Required Fields

```javascript
const validateEssentialQuestionnaire = (data) => {
  const errors = {};
  
  // Check required single-select fields
  if (!data.responses.politicalCompass) errors.politicalCompass = 'Required';
  if (!data.responses.birthOrder) errors.birthOrder = 'Required';
  if (!data.responses.sleepTendency) errors.sleepTendency = 'Required';
  // ... etc
  
  // Check required multi-select fields (minimum 1)
  if (!data.responses.loveLangs || data.responses.loveLangs.length === 0) {
    errors.loveLangs = 'Select at least 1';
  }
  if (!data.responses.musicalTastes || data.responses.musicalTastes.length === 0) {
    errors.musicalTastes = 'Select at least 1';
  }
  // ... etc
  
  return errors;
};
```

---

## 8. Styling Customization

The component uses classes from `compatibility-questionnaire.css`. To customize:

### Update Colors

Edit `/frontend/src/styles/compatibility-questionnaire.css`:

```css
/* Original colors */
--primary-color: #667eea;
--secondary-color: #764ba2;

/* Change to your brand colors */
--primary-color: #your-color;
--secondary-color: #your-color;
```

### Update Layout Width

```css
.compatibility-questionnaire {
  max-width: 900px; /* Change this value */
}
```

---

## 9. Hook into Scoring Algorithm

After questionnaire submission, calculate personality scores:

```javascript
const calculatePersonalityScores = (responses) => {
  return {
    socialCompatibility: calculateSocial(responses),
    lifestyleCompatibility: calculateLifestyle(responses),
    communicationStyle: calculateCommunication(responses),
    personalityMatch: calculatePersonality(responses),
    valuesAlignment: calculateValues(responses),
    entertainmentCompatibility: calculateEntertainment(responses),
    emotionalCompatibility: calculateEmotional(responses),
    relationshipReadiness: calculateReadiness(responses),
  };
};

const calculateSocial = (responses) => {
  // Score based on socialInclination, socializationFrequency, etc.
  const inclination = responses.socialInclination / 100;
  const frequency = mapFrequencyToScore(responses.socializationFrequency);
  return Math.round(((inclination + frequency) / 2) * 100);
};

// ... implement other scoring functions
```

---

## 10. Conditional Display

Show questionnaire based on user status:

```javascript
import EssentialQuestionnaire from '../components/EssentialQuestionnaire';

function ProfilePage({ user }) {
  if (user.hasCompletedEssentialQuestionnaire) {
    return <div>Questionnaire already completed</div>;
  }

  return (
    <EssentialQuestionnaire
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
```

---

## 11. Test Data Example

For testing/development:

```javascript
const testData = {
  type: 'ESSENTIAL',
  relationshipType: 'ALL',
  responses: {
    loveLangs: ['Words of Affirmation', 'Quality Time'],
    politicalCompass: 'Center-Left',
    birthOrder: 'Middle child',
    sleepTendency: 'Standard (sleep around midnight)',
    personalityArchetype: 'The Hero',
    socialInclination: 65,
    senseOfHumor: 'Dry/Sarcastic',
    laughFrequency: 'Sometimes',
    musicalTastes: ['Rock', 'Indie', 'Electronic/EDM'],
    indoorOutdoor: 55,
    entertainment: ['Travel', 'Movies', 'Gaming'],
    hobbies: ['Photography', 'Reading', 'Gaming'],
    outdoorActivities: ['Hiking', 'Cycling'],
    socializationFrequency: 'Once a week',
    drinkingHabits: 'Social drinker',
    smoking: 'No',
    recreationalDrugs: 'None',
    pets: 'Have pets',
    personalityEra: "'90s",
    conflictStyle: 'Opinionated/Speak my mind',
    problemHandling: 'Plan solutions methodically',
    financialHabits: 'Budget everything in advance',
    familyRelationship: 'Regular phone calls',
    datingDuration: '1-2 years',
    engagementDuration: '6-12 months',
  },
  completedAt: new Date().toISOString(),
};
```

---

## 12. Error Handling

```javascript
const handleSubmit = async (data) => {
  try {
    const response = await fetch('/api/questionnaires', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Questionnaire saved:', result);
    navigate('/profile');
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    setError('Failed to save questionnaire. Please try again.');
  }
};
```

---

## Props Reference

### EssentialQuestionnaire Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | function | Yes | Callback when form is submitted with completed responses |
| `onCancel` | function | Yes | Callback when user clicks cancel button |

### onSubmit Callback Data

```javascript
{
  type: 'ESSENTIAL',
  relationshipType: 'ALL',
  responses: { /* all form responses */ },
  completedAt: ISO timestamp string,
}
```

---

## Common Implementation Patterns

### With Loading State

```javascript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (data) => {
  setIsLoading(true);
  try {
    await api.post('/questionnaires', data);
    navigate('/profile');
  } finally {
    setIsLoading(false);
  }
};
```

### With Success Message

```javascript
const [message, setMessage] = useState('');

const handleSubmit = async (data) => {
  try {
    await api.post('/questionnaires', data);
    setMessage('Questionnaire saved successfully!');
    setTimeout(() => navigate('/profile'), 1500);
  } catch (error) {
    setMessage('Error saving questionnaire');
  }
};
```

### With User Preferences

```javascript
const handleSubmit = async (data) => {
  // Calculate scores immediately
  const scores = calculatePersonalityScores(data.responses);
  
  // Store with preferences
  const payload = {
    ...data,
    personalityScores: scores,
  };
  
  await api.post('/questionnaires', payload);
};
```

---

## Next Steps

1. Import component into your page/route
2. Create submission handler
3. Set up API endpoint to receive data
4. Optionally: Implement scoring algorithm
5. Optionally: Store scores in user model
6. Test with test data
7. Deploy

---

## Troubleshooting

### Component Not Rendering
- Check that CSS file is imported: `import '../styles/compatibility-questionnaire.css'`
- Verify Button component is available
- Check console for import errors

### Submit Not Working
- Ensure onSubmit and onCancel props are provided
- Check that form validation is passing (watch browser console)
- Verify API endpoint is correct

### Styling Issues
- Check CSS file location: `/frontend/src/styles/compatibility-questionnaire.css`
- Verify class names match
- Check for CSS conflicts with other stylesheets

---

For complete documentation, see: `ESSENTIAL_QUESTIONNAIRE.md`
