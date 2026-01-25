# Form Loading Fix - Using Question Order Instead of Question ID

## Problem
When fetching previously submitted answers, the forms were being populated with the wrong question IDs:
- Lifestyle questions were loaded with IDs 28-48 (database question IDs)
- But the form component expected keys 1-21 (question order numbers)
- This caused all form fields to be empty even though answers were being fetched

**Example from the bug:**
```javascript
// Answers were mapped like this:
{
  28: 'Personal growth and self-improvement',  // Wrong! Should be 1
  29: 'Trust my gut and go for it',            // Wrong! Should be 2
  30: 'At large social events and gatherings', // Wrong! Should be 3
  ...
}

// But form expected:
{
  1: '',  // Life priorities
  2: '',  // Risk approach
  3: '',  // Social comfort level
  ...
}
```

## Root Cause
The database has:
- **Question ID**: Unique identifier in the database (incremental, 1-27 for Essential, 28-48 for Lifestyle)
- **Question Order**: Position within each questionnaire (1-27 for Essential, 1-21 for Lifestyle)

The form components use question **order** as the state key, but the fetch was mapping by question **ID**.

## Solution

### 1. Backend Changes (routes/questionnaires.js)

Added `'order'` to the Question attributes when fetching user responses:

```javascript
// Before
attributes: ['id', 'text', 'type']

// After
attributes: ['id', 'text', 'type', 'order']
```

**Updated two routes:**
- `/responses/user/me/questionnaire/:questionnaireId` (authenticated user)
- `/responses/user/:userId/questionnaire/:questionnaireId` (any user)

### 2. Frontend Changes

#### EssentialQuestionnairePage.js
Changed the answer mapping to use question order:

```javascript
// Before
const questionId = answer.questionId.toString();
answersMap[questionId] = value;

// After
const questionOrder = answer.Question?.order?.toString() || answer.questionId.toString();
answersMap[questionOrder] = value;
```

#### LifestyleQuestionnairePage.js
Same fix applied:

```javascript
// Map answers to question order (1-21) not database ID (28-48)
const questionOrder = answer.Question?.order?.toString() || answer.questionId.toString();
answersMap[questionOrder] = value;
```

## Key Implementation Details

**Safe fallback:**
```javascript
answer.Question?.order?.toString() || answer.questionId.toString()
```
- Uses optional chaining to safely access nested properties
- Falls back to `questionId` if `order` is not available (backward compatibility)

**Why this works:**
- Each questionnaire has its own set of questions with orders 1-N
- Questions are stored globally in the database with unique IDs
- Answers reference the global question ID
- But the form component expects the order within its questionnaire
- Mapping through `order` connects the two systems correctly

## Testing

After restarting the backend, test with:

1. **New submission:**
   - Navigate to `/questionnaire/lifestyle`
   - Form should be blank
   - Fill out and submit

2. **Load existing answers:**
   - Navigate back to `/questionnaire/lifestyle`
   - Form should populate with all previous answers
   - Check browser console:
     - "Answers array: (21) [{…}, {…}, ...]"
     - "Updating lifestyle form with existing responses: {1: 'value', 2: 'value', ...}"

3. **Edit and resubmit:**
   - Change some answers
   - Click Submit
   - Navigate back to confirm changes persisted

## Files Modified

1. **backend/routes/questionnaires.js**
   - Lines 97: Added `'order'` to question attributes
   - Line 127: Added `'order'` to question attributes

2. **frontend/src/pages/EssentialQuestionnairePage.js**
   - Lines 52-68: Changed mapping to use question order

3. **frontend/src/pages/LifestyleQuestionnairePage.js**
   - Lines 52-68: Changed mapping to use question order

## Why Essential Questionnaire Still Worked

The Essential Questionnaire's question IDs happen to match their order (1-27) because they were created first in the database. So the bug existed but wasn't visible. Now it's fixed for both questionnaires.

## Compatibility

✅ Works with questionnaires that have any number of questions
✅ Works with future questionnaires added to the system
✅ Backward compatible (falls back to questionId if order is unavailable)
✅ No database migration needed
