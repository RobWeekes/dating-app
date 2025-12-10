# Compatibility Questionnaire - Quick Start Guide

Get the compatibility questionnaires up and running in 5 minutes.

---

## Files to Copy

Copy these 6 files from the `frontend` directory:

### Components (4 files)
```
frontend/src/components/
├── CompatibilityQuestionnaireShort.js
├── CompatibilityQuestionnaireMediumCasual.js
├── CompatibilityQuestionnaireLongTermShort.js
└── CompatibilityQuestionnaireSelector.js
```

### Styles (2 files)
```
frontend/src/styles/
├── compatibility-questionnaire.css
└── questionnaire-selector.css
```

---

## Step 1: Add Route (1 minute)

In `frontend/src/routes/index.js` or your router configuration:

```javascript
import CompatibilityQuestionnaireSelector from '../components/CompatibilityQuestionnaireSelector';

// Add this route:
<Route 
  path="/compatibility-questionnaire" 
  element={<CompatibilityQuestionnaireSelector />} 
/>
```

---

## Step 2: Add Navigation Link (1 minute)

In your navigation or profile component:

```javascript
import { Link } from 'react-router-dom';

// Add button or link:
<Link to="/compatibility-questionnaire" className="btn-primary">
  Answer Compatibility Questions
</Link>
```

---

## Step 3: Create API Handler (2 minutes)

In `frontend/src/services/api.js`:

```javascript
export async function submitCompatibilityQuestionnaire(data) {
  const response = await fetch('/api/questionnaires/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit questionnaire');
  }
  
  return response.json();
}
```

---

## Step 4: Wire Up Submission (1 minute)

Update `CompatibilityQuestionnaireSelector.js` to call your API:

```javascript
// Near the top, after imports:
import { submitCompatibilityQuestionnaire } from '../services/api';

// Find where the component handles onSubmit
// Modify the onSubmit handler:
const handleQuestionnaireSubmit = async (data) => {
  try {
    await submitCompatibilityQuestionnaire(data);
    // Show success message
    // Navigate to profile or success page
  } catch (error) {
    // Show error message
  }
};

// Pass to selector:
<CompatibilityQuestionnaireSelector
  onSubmit={handleQuestionnaireSubmit}
  onCancel={() => navigate(-1)}
/>
```

---

## Done!

The questionnaires are now live. Visit:
```
http://localhost:3000/compatibility-questionnaire
```

---

## Testing

Test each questionnaire:

1. **Short Casual** - Fill out 10 questions (~2 min)
2. **Medium Casual** - Fill out 25 questions in sections (~5 min)
3. **Short Long-Term** - Fill out 15 questions (~3 min)

Verify:
- ✅ Questions display correctly
- ✅ Radio buttons work
- ✅ Progress bar advances (medium form)
- ✅ Submit button sends data
- ✅ Responsive on mobile

---

## Available Questionnaires

### Ready to Use
- ✅ **Short Form (10 Q)** - Casual dating - 5 min
- ✅ **Medium Form (25 Q)** - Casual dating - 15 min  
- ✅ **Short Form (15 Q)** - Long-term - 8 min

### Coming Soon (Placeholder)
- ⏳ **Medium Form (35 Q)** - Long-term - 20 min
- ⏳ **Long Form (50 Q)** - Casual - 25 min
- ⏳ **Long Form (100 Q)** - Long-term - 45 min

---

## Data Structure

Each questionnaire returns:

```javascript
{
  type: 'SHORT',              // SHORT, MEDIUM, LONG
  relationshipType: 'CASUAL', // CASUAL or LONG_TERM
  responses: {
    physicalChemistry: 'Essential',
    intimacyFrequency: 'Regular (1-2 times weekly)',
    // ... all responses
  },
  completedAt: '2024-11-28T12:34:56Z',
  length: 'SHORT'
}
```

---

## Database Setup

Optional: Create a table to store responses:

```sql
CREATE TABLE questionnaire_responses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questionnaire_type VARCHAR(50),
  relationship_type VARCHAR(50),
  responses JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Customization

### Change Colors
Edit `compatibility-questionnaire.css`:
```css
/* Find these and change */
--primary: #667eea;
--secondary: #764ba2;
```

### Change Questions
Edit each component's hardcoded questions, or import from a config file:
```javascript
// Create: frontend/src/config/questionnaires.js
export const CASUAL_SHORT_QUESTIONS = [ ... ];

// Import in component:
import { CASUAL_SHORT_QUESTIONS } from '../config/questionnaires';
```

### Add More Questionnaires
Create new component following this pattern:
```javascript
import { useState } from 'react';
import Button from './Button';

function CustomQuestionnaire({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ /* fields */ });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => { /* ... */ };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit({
        type: 'YOUR_TYPE',
        relationshipType: 'YOUR_TYPE',
        responses: formData,
        completedAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="compatibility-questionnaire">
      {/* Your form JSX */}
    </div>
  );
}

export default CustomQuestionnaire;
```

Then add to `CompatibilityQuestionnaireSelector.js`:
```javascript
import CustomQuestionnaire from './CustomQuestionnaire';

// In questionnaires object:
options: [
  // ... existing options ...
  {
    id: 'YOUR_ID',
    label: 'Your Label',
    description: 'Your description',
    time: '10 min',
    component: CustomQuestionnaire,
  },
]
```

---

## Integration Checklist

- [ ] Routes updated with questionnaire path
- [ ] Navigation link added
- [ ] API handler created in services
- [ ] Submission logic implemented
- [ ] Components tested in browser
- [ ] Mobile responsive verified
- [ ] Error handling implemented
- [ ] Success message displayed
- [ ] Database table created (optional)
- [ ] Backend endpoint ready

---

## Troubleshooting

**Questionnaire doesn't load**
- Check component import paths
- Verify CSS files are imported
- Check browser console for errors

**Styles look wrong**
- Ensure CSS files are in correct directory
- Check CSS imports in components
- Clear browser cache

**Submit doesn't work**
- Check API endpoint is correct
- Verify authentication token is included
- Check backend endpoint exists
- Look at network tab in dev tools

**Questions not showing**
- Check component is rendering
- Verify state initialization
- Check for JavaScript errors

---

## What's Next?

1. **Add more questionnaires** - Use template above
2. **Build matching algorithm** - Compare questionnaire responses
3. **Create match discovery page** - Show compatible users
4. **Add analytics** - Track completion and responses
5. **Improve matching** - Use ML/AI for better matches

---

## Support

- Review `COMPATIBILITY_QUESTIONNAIRES_IMPLEMENTATION.md` for detailed integration
- Check `COMPATIBILITY_QUESTIONNAIRES.md` for all questions and options
- See `QUESTIONNAIRE_COMPONENTS_SUMMARY.md` for technical details

---

## Quick Links

**Documentation Files:**
- COMPATIBILITY_QUESTIONNAIRES.md - Full questionnaire content
- COMPATIBILITY_QUESTIONNAIRES_IMPLEMENTATION.md - Developer guide
- QUESTIONNAIRE_COMPONENTS_SUMMARY.md - Technical overview

**Component Files:**
- CompatibilityQuestionnaireSelector.js - Main entry point
- CompatibilityQuestionnaireShort.js - 10-question form
- CompatibilityQuestionnaireMediumCasual.js - 25-question form
- CompatibilityQuestionnaireLongTermShort.js - 15-question form

**Style Files:**
- compatibility-questionnaire.css - Form styles
- questionnaire-selector.css - Selector styles

---

**Total setup time: ~5-10 minutes**
**Time saved vs building from scratch: 8-10 hours**

Enjoy your compatibility questionnaires! 🎉
