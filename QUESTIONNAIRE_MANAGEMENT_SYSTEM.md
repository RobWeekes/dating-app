# Questionnaire Management System - Single Source of Truth

## Overview

This system ensures questionnaire changes are automatically reflected everywhere without manual synchronization.

**Single Source of Truth:** `backend/data/questionnaire-templates.js`

Everything else derives from it automatically.

---

## Architecture

```
backend/data/questionnaire-templates.js (SINGLE SOURCE OF TRUTH)
    ↓
    ├─→ Database (seeded via Sequelize)
    ├─→ Backend API Metadata Endpoint (/api/questionnaires/metadata/:type)
    │   └─→ Frontend fetches this dynamically
    └─→ Validation Script (checks consistency)
```

---

## How It Works

### 1. **Add/Edit/Delete Questions**

Only modify: `backend/data/questionnaire-templates.js`

```javascript
// Simply add/edit/delete questions in the questionnaire object
{
  type: 'essential',
  title: 'Essential Questionnaire 2',
  questions: [
    {
      text: 'Your question...',
      order: 1,  // Keep sequential: 1, 2, 3, etc.
      section: 'Your Section',
      // ... other fields
    },
    // Add or remove questions here
  ]
}
```

### 2. **Everything Else Updates Automatically**

- **Database**: Next seed will pick up the new count
  ```bash
  npm run seed
  ```

- **Frontend**: API endpoint returns dynamic counts
  ```javascript
  // Frontend automatically fetches updated count
  const { metadata } = useQuestionnaireMetadata('essential');
  console.log(metadata.totalQuestions); // Always current!
  ```

- **Validation**: Check consistency before deployment
  ```bash
  node scripts/validate-questionnaires.js essential
  ```

---

## API Endpoints

### Get Questionnaire Metadata

```http
GET /api/questionnaires/metadata/:type
```

**Response:**
```json
{
  "type": "essential",
  "title": "Essential Questionnaire 2",
  "totalQuestions": 31,
  "sections": {
    "Behavioral Dynamics": 9,
    "Conflict & Repair": 4,
    "Compatibility & Friction": 11,
    "Values & Alignment": 5,
    "Personality & Stability": 2
  },
  "questionList": [...],
  "validation": {
    "isValid": true,
    "errors": [],
    "warnings": []
  }
}
```

---

## Frontend Usage

### Option 1: Use Dynamic Metadata (Recommended)

```javascript
import useQuestionnaireMetadata from '../hooks/useQuestionnaireMetadata';

function MyComponent() {
  const { metadata, loading, error } = useQuestionnaireMetadata('essential');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <p>Total Questions: {metadata.totalQuestions}</p>
      <p>Sections: {Object.keys(metadata.sections).join(', ')}</p>
    </div>
  );
}
```

### Option 2: Fallback Hardcoded Values

If the API fails, the system gracefully falls back to hardcoded `QUESTION_COUNTS` in `useQuestionnaires.js`:

```javascript
// Only used as fallback if API is unavailable
const QUESTION_COUNTS = {
  essential: 31,  // Keep this in sync manually if API not available
  // ...
};
```

---

## Validation Script

### Run Before Deployment

```bash
# Validate all questionnaires
node scripts/validate-questionnaires.js

# Validate specific questionnaire
node scripts/validate-questionnaires.js essential
```

**Checks:**
- ✅ Sequential ordering (1, 2, 3, ... no gaps)
- ✅ No duplicate orders
- ✅ All questions have required fields
- ✅ All sections are assigned

---

## Workflow: Adding a Question

### Example: Add a new question to Essential

1. **Edit questionnaire template:**
   ```bash
   # Open: backend/data/questionnaire-templates.js
   # Find the essential questionnaire
   # Add new question at the end with order = (lastOrder + 1)
   ```

2. **Validate the changes:**
   ```bash
   node scripts/validate-questionnaires.js essential
   ```

3. **Reseed the database:**
   ```bash
   npm run seed:undo:all
   npm run seed
   ```

4. **Frontend automatically picks up the change:**
   - No code changes needed!
   - `useQuestionnaireMetadata()` will return updated count
   - Hardcoded fallback will eventually need updating (but API works first)

---

## Workflow: Connecting Questions to Scoring Indices

For the TypeScript scoring engine:

1. Add your question to the template (above)
2. Add mapping to `backend/scoring-engine/config/item-deltas.json`
3. Run validation:
   ```bash
   node backend/scoring-engine/scripts/validate-mappings.js
   ```

---

## Files Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `backend/data/questionnaire-templates.js` | Questionnaire definitions | When adding/editing questions |
| `backend/routes/api/questionnaires.js` | API endpoints | Only if adding new endpoints |
| `backend/utils/questionnaireUtils.js` | Metadata computation | Rarely - only if changing validation logic |
| `frontend/src/hooks/useQuestionnaireMetadata.js` | Fetch metadata | Rarely - only if changing fetch strategy |
| `scripts/validate-questionnaires.js` | Validation script | Rarely - only if changing validation rules |
| `frontend/src/hooks/useQuestionnaires.js` | Legacy hook with fallback counts | **DEPRECATED** - See comment at top |

---

## Troubleshooting

### Question count still shows old value in frontend

**Cause:** Browser cache, backend not running, or API endpoint error

**Fix:**
1. Clear browser cache (Cmd/Ctrl + Shift + Delete)
2. Hard refresh (Cmd/Ctrl + Shift + R or Cmd/Ctrl + F5)
3. Check backend is running: `npm start` in `/backend`
4. Check API endpoint: `curl http://localhost:3001/api/questionnaires/metadata/essential`

### Validation script shows errors

**Example:** "Question ordering gap: expected 2, found 3"

**Fix:** Edit `questionnaire-templates.js` and ensure questions have sequential orders: 1, 2, 3, 4, etc.

---

## Best Practices

1. ✅ **Always validate before seeding:**
   ```bash
   node scripts/validate-questionnaires.js essential && npm run seed
   ```

2. ✅ **Keep section names consistent** - Used for UI grouping

3. ✅ **Use meaningful order numbers** - Makes questions appear in correct UI order

4. ✅ **Test metadata endpoint after changes:**
   ```bash
   curl http://localhost:3001/api/questionnaires/metadata/essential | jq
   ```

5. ❌ **Don't hardcode question counts** in frontend - they become stale

---

## Future Enhancements

Potential improvements to this system:

- [ ] Auto-generate item-deltas.json mappings from questionnaire
- [ ] Database migrations auto-generated from template changes
- [ ] Automated testing for questionnaire consistency on commit
- [ ] Admin UI for editing questionnaires without code changes
- [ ] Real-time validation in VS Code for questionnaire-templates.js
