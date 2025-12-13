# Essential Questionnaire - Testing Guide

## Pre-Testing Checklist

- [ ] Run migration: `npx sequelize-cli db:migrate`
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] User logged in with valid auth token
- [ ] Database accessible

---

## Manual Testing

### Step 1: Load the Form

1. Navigate to: `http://localhost:3000/questionnaire/essential`
2. **Expected:** Form loads with 9 sections and 27 questions
3. **Verify:**
   - All section headers visible
   - No console errors
   - Form is responsive (check mobile view too)

### Step 2: Complete the Form

Fill out all fields with test data:

**Section 1: Love Languages**
- Select: Words of Affirmation, Quality Time

**Section 2: Values**
- Political: Center-Left
- Birth order: Middle child

**Section 3: Sleep & Personality**
- Sleep: Standard (sleep around midnight)
- Archetype: The Hero
- Social: Drag slider to 65

**Section 4: Humor**
- Humor: Dry/Sarcastic
- Laugh: Sometimes

**Section 5: Entertainment**
- Music: Select Rock, Indie, Electronic/EDM
- Indoor/Outdoor: Drag slider to 55
- Entertainment: Travel, Movies, Gaming
- Hobbies: Photography, Reading, Gaming
- Outdoor: Hiking, Cycling, Beach activities

**Section 6: Lifestyle**
- Socialize: Once a week
- Drinking: Social drinker
- Smoking: No
- Drugs: None
- Pets: Have pets

**Section 7: Communication**
- Era: '90s
- Conflict: Opinionated/Speak my mind
- Problem: Plan solutions methodically

**Section 8: Finances**
- Financial: Budget everything in advance
- Family: Regular phone calls

**Section 9: Timeline**
- Dating: 1-2 years
- Engagement: 6-12 months

### Step 3: Validate Form

1. Try submitting **without completing a field** (e.g., skip one)
2. **Expected:** Error message appears for that field
3. Complete the missing field
4. **Expected:** Error clears automatically

### Step 4: Submit Form

1. Click "Submit Questionnaire" button
2. **Expected:** Button shows "Submitting..." state
3. **Expected:** Request sent to `/api/questionnaires` (check Network tab)
4. **Expected:** Redirected to `/profile`
5. **Expected:** Success message or navigation confirms submission

### Step 5: Verify Database

Check that data was saved:

```bash
# Connect to database and query
SELECT * FROM "Questionnaires" WHERE "userId" = <your_user_id> AND "questionnaire" = 'ESSENTIAL';
```

**Verify:**
- All 27 question responses stored in `responses` JSON column
- `questionnaire` column = 'ESSENTIAL'
- `relationshipType` = 'ALL'
- `interests` array contains entertainment selections

---

## API Testing Script

### Using cURL

First, get your auth token:

```bash
# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'

# Copy the token from response
```

Then submit the questionnaire:

```bash
curl -X POST http://localhost:5000/api/questionnaires \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type": "ESSENTIAL",
    "relationshipType": "ALL",
    "completedAt": "2025-12-11T12:00:00Z",
    "responses": {
      "loveLangs": ["Words of Affirmation", "Quality Time"],
      "politicalCompass": "Center-Left",
      "birthOrder": "Middle child",
      "sleepTendency": "Standard (sleep around midnight)",
      "personalityArchetype": "The Hero",
      "socialInclination": 65,
      "senseOfHumor": "Dry/Sarcastic",
      "laughFrequency": "Sometimes",
      "musicalTastes": ["Rock", "Indie", "Electronic/EDM"],
      "indoorOutdoor": 55,
      "entertainment": ["Travel", "Movies", "Gaming"],
      "hobbies": ["Photography", "Reading", "Gaming"],
      "outdoorActivities": ["Hiking", "Cycling", "Beach activities"],
      "socializationFrequency": "Once a week",
      "drinkingHabits": "Social drinker",
      "smoking": "No",
      "recreationalDrugs": "None",
      "pets": "Have pets",
      "personalityEra": "'90s",
      "conflictStyle": "Opinionated/Speak my mind",
      "problemHandling": "Plan solutions methodically",
      "financialHabits": "Budget everything in advance",
      "familyRelationship": "Regular phone calls",
      "datingDuration": "1-2 years",
      "engagementDuration": "6-12 months"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Essential Questionnaire saved successfully",
  "questionnaire": {
    "id": 1,
    "userId": 1,
    "questionnaire": "ESSENTIAL",
    "relationshipType": "ALL",
    "responses": { /* all 27 responses */ },
    "datingGoal": null,
    "interests": ["Travel", "Movies", "Gaming"],
    "createdAt": "2025-12-11T12:00:00.000Z",
    "updatedAt": "2025-12-11T12:00:00.000Z"
  }
}
```

---

## Node.js Testing Script

Create `ESSENTIAL_QUESTIONNAIRE_API_TEST.js`:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const TEST_USER = {
  email: 'testuser@example.com',
  password: 'password123'
};

const testData = {
  type: 'ESSENTIAL',
  relationshipType: 'ALL',
  completedAt: new Date().toISOString(),
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
    outdoorActivities: ['Hiking', 'Cycling', 'Beach activities'],
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
  }
};

async function runTests() {
  try {
    console.log('🧪 Testing Essential Questionnaire...\n');

    // Step 1: Login
    console.log('1. Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    const token = loginRes.data.token;
    console.log('✅ Login successful\n');

    // Step 2: Submit questionnaire
    console.log('2. Submitting questionnaire...');
    const headers = { Authorization: `Bearer ${token}` };
    const submitRes = await axios.post(
      `${API_URL}/questionnaires`,
      testData,
      { headers }
    );

    const questionnaire = submitRes.data.questionnaire;
    console.log('✅ Questionnaire submitted\n');

    // Step 3: Verify response
    console.log('3. Verifying response...');
    console.log(`   - ID: ${questionnaire.id}`);
    console.log(`   - Type: ${questionnaire.questionnaire}`);
    console.log(`   - Relationship: ${questionnaire.relationshipType}`);
    console.log(`   - Responses stored: ${Object.keys(questionnaire.responses).length} fields`);
    console.log('✅ Response verified\n');

    // Step 4: Verify all responses
    console.log('4. Verifying all 27 responses...');
    const responseFields = Object.keys(testData.responses);
    const missingFields = responseFields.filter(
      field => !(field in questionnaire.responses)
    );
    
    if (missingFields.length === 0) {
      console.log(`✅ All ${responseFields.length} responses stored correctly\n`);
    } else {
      console.log(`❌ Missing fields: ${missingFields.join(', ')}\n`);
    }

    // Step 5: Retrieve questionnaire
    console.log('5. Retrieving questionnaire...');
    const getRes = await axios.get(
      `${API_URL}/questionnaires/${questionnaire.id}`,
      { headers }
    );
    console.log('✅ Questionnaire retrieved\n');

    // Step 6: Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL TESTS PASSED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('Summary:');
    console.log(`  Questionnaire ID: ${questionnaire.id}`);
    console.log(`  User ID: ${questionnaire.userId}`);
    console.log(`  Type: ${questionnaire.questionnaire}`);
    console.log(`  Questions answered: ${Object.keys(questionnaire.responses).length}`);
    console.log(`  Created: ${questionnaire.createdAt}`);

  } catch (error) {
    console.error('\n❌ TEST FAILED\n');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

runTests();
```

**Run it:**
```bash
node ESSENTIAL_QUESTIONNAIRE_API_TEST.js
```

---

## Error Scenarios to Test

### 1. Missing Token
```bash
curl -X POST http://localhost:5000/api/questionnaires \
  -H "Content-Type: application/json" \
  -d '{"type":"ESSENTIAL"}'
```
**Expected:** 401 Unauthorized

### 2. Invalid Token
```bash
curl -X POST http://localhost:5000/api/questionnaires \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{"type":"ESSENTIAL"}'
```
**Expected:** 401 Unauthorized

### 3. Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/questionnaires \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type":"ESSENTIAL"}'
```
**Expected:** 400 Bad Request (missing responses)

### 4. Empty Responses
```bash
curl -X POST http://localhost:5000/api/questionnaires \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type":"ESSENTIAL","responses":{}}'
```
**Expected:** 201 Created (accepts empty, but frontend validates)

---

## Testing Checklist

### Frontend Tests
- [ ] Form loads without errors
- [ ] All 27 questions visible
- [ ] Radio buttons work
- [ ] Checkboxes allow multi-select
- [ ] Sliders work and show values
- [ ] Form validation prevents submission of incomplete form
- [ ] Error messages display for missing fields
- [ ] Errors clear when field is completed
- [ ] Submit button shows loading state
- [ ] Submit button disabled during submission
- [ ] Form redirects to /profile after success
- [ ] Cancel button navigates back
- [ ] Works on mobile (< 600px)
- [ ] Works on tablet (600-1024px)
- [ ] Works on desktop (> 1024px)

### Backend Tests
- [ ] POST /api/questionnaires accepts request
- [ ] Requires valid auth token
- [ ] Extracts userId from token
- [ ] Creates questionnaire record with type 'ESSENTIAL'
- [ ] Stores all 27 responses in responses JSON column
- [ ] Returns success response
- [ ] Returns saved questionnaire object
- [ ] Data persists in database
- [ ] Can retrieve questionnaire by ID
- [ ] Entertainment responses stored in interests array
- [ ] Handles concurrent submissions

### Database Tests
- [ ] questionnaire column contains 'ESSENTIAL'
- [ ] relationshipType column contains 'ALL'
- [ ] responses column contains all 27 field responses
- [ ] interests array populated from entertainment field
- [ ] createdAt timestamp is set
- [ ] updatedAt timestamp is set
- [ ] Foreign key userId is correct

---

## Quick Test Summary

| Test | Command | Expected Result |
|------|---------|-----------------|
| Form Load | Navigate to `/questionnaire/essential` | 27 questions visible, no errors |
| Form Submit | Fill all fields, click submit | Data saved, redirect to /profile |
| API Direct | `curl` with test data | 201 response with saved questionnaire |
| Database | Query questionnaires table | Row with type 'ESSENTIAL' visible |
| Error | Submit without auth token | 401 Unauthorized |

---

## Success Criteria

✅ Form loads without errors  
✅ All 27 questions display correctly  
✅ Form validates required fields  
✅ Form submission succeeds with valid data  
✅ Data persists in database  
✅ API returns correct response  
✅ User is redirected to profile after submit  
✅ Works on all device sizes  

**All criteria met = Ready for deployment**
