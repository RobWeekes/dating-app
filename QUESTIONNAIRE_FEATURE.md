# Questionnaire Feature Testing Guide

## Overview

The Questionnaire feature allows users to complete a comprehensive personality and dating preferences questionnaire. The form includes:

- **7 Dynamic Questions** with different input types
- **View & Edit modes** with data persistence
- **Full Redux integration** for state management
- **Form validation** with error messages
- **Responsive design** for mobile/tablet/desktop
- **Backend API integration** for data persistence

## Features Implemented

### 1. Question Types

- **Dropdown Selects**: Personality type, dating goal, relationship type
- **Checkboxes**: Multiple interest selection (12 options, min 3 required)
- **Textareas**: Open-ended questions (ideal date, 5-year goals, about you)

### 2. Validation Rules

- All fields required
- Interests: minimum 3 selections
- Textareas: non-empty text required
- Real-time error clearing when user starts typing
- Visual error indicators on invalid fields

### 3. View/Edit Modes

- **View Mode**: Display saved questionnaire with edit button (shown if data exists)
- **Edit Mode**: Full form interface for creating or updating
- **Seamless switching**: Cancel button resets to last saved state

### 4. Redux Integration

- `setUserQuestionnaire()` - Save questionnaire to Redux state
- `setLoading()` - Handle loading states
- `setError()` - Display error messages
- Selectors for accessing questionnaire data

### 5. API Integration

- `getUserQuestionnaire(userId)` - Fetch user's questionnaire
- `submitQuestionnaire(data)` - Create new questionnaire
- `updateUserQuestionnaire(id, data)` - Update existing questionnaire
- Automatic redirect to profile page after successful submission

## Testing Steps

### Test 1: Navigate to Questionnaire Page

1. Start both frontend (npm start) and backend (npm start in backend/)
2. Go to http://localhost:3000
3. Click "Questionnaire" in navigation
4. Should see form (first time user) or view + edit button (returning user)

### Test 2: Complete Questionnaire (First Time)

1. Select "Introvert" for personality
2. Select "Long-term relationship" for dating goal
3. Select "Monogamous" for relationship type
4. Check 4 interests (e.g., Travel, Fitness, Art & Music, Reading)
5. Fill in all three text fields with sample responses
6. Click "Submit"
7. Should redirect to Profile page after 1 second
8. Should show success in Redux DevTools

### Test 3: Validation Errors

1. Try submitting empty form - should show all error messages
2. Select only 2 interests - should show "select at least 3" error
3. Fill personality but leave others empty - should show multiple errors
4. Errors should clear when user starts typing

### Test 4: View Saved Questionnaire

1. After submission, navigate to /questionnaire
2. Should show view mode with all data displayed
3. Interests shown as colored tags
4. "Edit" button visible in top right

### Test 5: Edit Existing Questionnaire

1. Click "Edit" button on questionnaire view
2. Form should populate with existing data
3. Change personality type to "Extrovert"
4. Change one interest selection
5. Update one text field
6. Click "Update"
7. Should see updated view with new data

### Test 6: Cancel Edit

1. Click "Edit" and modify some fields
2. Click "Cancel"
3. Should return to view mode
4. Form should be reset to last saved state

### Test 7: Mobile Responsiveness

1. Open DevTools (F12)
2. Toggle Device Toolbar
3. Test on iPhone/iPad sizes
4. Verify:
   - Form stacks vertically
   - Buttons full width
   - Text readable without zoom
   - Checkboxes single column
   - No horizontal scroll

### Test 8: Database Persistence

1. Complete questionnaire and submit
2. Open browser console (F12)
3. Run: `fetch('http://localhost:3001/api/questionnaires/user/1').then(r => r.json()).then(console.log)`
4. Should see full questionnaire data in database
5. Refresh page - data should persist

### Test 9: Backend Validation

1. Open browser console
2. Try invalid POST:
   ```javascript
   fetch("http://localhost:3001/api/questionnaires", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ personalityType: "Invalid" }),
   })
     .then((r) => r.json())
     .then(console.log);
   ```
3. Should get 400 error "User ID is required"

### Test 10: Duplicate Questionnaire

1. Submit questionnaire as user 1
2. Try submitting again without updating:
   ```javascript
   fetch("http://localhost:3001/api/questionnaires", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       userId: 1,
       personalityType: "Extrovert",
       datingGoal: "Casual",
       relationshipType: "Open",
       interests: [],
       responses: {},
     }),
   })
     .then((r) => r.json())
     .then(console.log);
   ```
3. Should get 409 error "Questionnaire already exists for this user"

## Browser Console Test Script

```javascript
// Test questionnaire submission with validation
const testQuestionnaire = async () => {
  const userId = 1;

  // 1. Get existing questionnaire
  console.log("1. Fetching existing questionnaire...");
  const existing = await fetch(
    `http://localhost:3001/api/questionnaires/user/${userId}`
  )
    .then((r) => r.json())
    .then((d) => {
      console.log("Existing:", d);
      return d;
    })
    .catch(() => {
      console.log("No existing questionnaire");
      return null;
    });

  // 2. Prepare questionnaire data
  const questionnaireData = {
    userId,
    personalityType: "Ambivert",
    datingGoal: "Long-term relationship",
    relationshipType: "Monogamous",
    interests: ["Travel", "Fitness", "Art & Music", "Reading", "Gaming"],
    responses: {
      idealDate:
        "A cozy coffee date at a local cafe, followed by a walk in the park.",
      fiveYearGoal:
        "Settled down with someone special, pursuing career goals, and traveling.",
      aboutYou:
        "I love adventure, fitness, and meeting new people. Always up for trying new things!",
    },
  };

  // 3. Submit or update
  if (existing) {
    console.log("2. Updating existing questionnaire...");
    const updated = await fetch(
      `http://localhost:3001/api/questionnaires/${existing.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionnaireData),
      }
    )
      .then((r) => r.json())
      .then((d) => {
        console.log("Updated:", d);
        return d;
      });
  } else {
    console.log("2. Creating new questionnaire...");
    const created = await fetch("http://localhost:3001/api/questionnaires", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionnaireData),
    })
      .then((r) => r.json())
      .then((d) => {
        console.log("Created:", d);
        return d;
      });
  }

  // 4. Verify in database
  console.log("3. Verifying submission...");
  const verified = await fetch(
    `http://localhost:3001/api/questionnaires/user/${userId}`
  )
    .then((r) => r.json())
    .then((d) => {
      console.log("Verified in database:", d);
      return d;
    });

  return verified;
};

// Run the test
testQuestionnaire().then(() => console.log("✅ Test complete!"));
```

## File Structure

```
frontend/src/
├── pages/
│   └── Questionnaire.js (420 lines) - Full questionnaire component
├── services/
│   └── api.js (UPDATED) - Added updateUserQuestionnaire() function
├── styles/
│   └── questionnaire.css (NEW) - Complete styling with responsive design
├── redux/
│   └── slices/
│       └── userSlice.js (unchanged) - Already supports questionnaire state
└── components/
    ├── Button.js - Used for form submission
    └── FormInput.js - Available for future question types
```

## API Endpoints Used

### GET /api/questionnaires/user/:userId

**Purpose**: Fetch user's existing questionnaire
**Response**:

```json
{
  "id": 1,
  "userId": 1,
  "personalityType": "Introvert",
  "datingGoal": "Long-term relationship",
  "relationshipType": "Monogamous",
  "interests": ["Travel", "Fitness", ...],
  "responses": {
    "idealDate": "...",
    "fiveYearGoal": "...",
    "aboutYou": "..."
  }
}
```

### POST /api/questionnaires

**Purpose**: Create new questionnaire
**Body**: Same structure as response above
**Response**: Created questionnaire with ID

### PUT /api/questionnaires/:id

**Purpose**: Update existing questionnaire
**Body**: Updated questionnaire data
**Response**: Updated questionnaire

## Known Features

✅ Full form validation with error messages
✅ View mode for displaying saved data
✅ Edit mode for updating questionnaire
✅ Redux state management integration
✅ Mobile-responsive design (3 breakpoints)
✅ Real-time error clearing
✅ Backend API integration with error handling
✅ Interest tags display with color coding
✅ Loading and submission states
✅ Automatic redirect after successful submission

## Next Steps

After testing questionnaire feature:

1. Implement Preferences feature (age range slider, location, interests)
2. Build match-finding algorithm
3. Create user browsing/discovery interface
4. Add messaging between matched users
5. Implement authentication system

## Troubleshooting

**Issue**: Form shows errors immediately

- Solution: Clear localStorage and refresh page

**Issue**: Questionnaire won't save

- Solution: Ensure backend is running on port 3001 and database migrations are applied

**Issue**: Changes don't persist on refresh

- Solution: Check browser console for API errors; verify backend is responding correctly

**Issue**: Mobile form looks cramped

- Solution: Browser zoom should be at 100%; test on actual mobile device
