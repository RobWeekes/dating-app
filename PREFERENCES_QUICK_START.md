# Preferences Feature - Quick Start Guide

## What Was Built

A complete dating preferences form with:

- **Age range sliders** - Interactive dual sliders (18-120 years)
- **Location preferences** - Optional location + search radius (1-500 miles)
- **Interest selection** - 16 interest options with checkboxes
- **Relationship type** - Dropdown with 4 options
- **View mode** - Display saved preferences with edit button
- **Edit mode** - Update preferences form
- **Full validation** - Real-time error clearing
- **Redux integration** - State management
- **Mobile responsive** - Works on all devices
- **Database persistence** - Saves to SQLite

## Files Created/Updated

```
frontend/src/
├── pages/
│   └── Preferences.js (380 lines) ✨ COMPLETELY REWRITTEN
├── services/
│   └── api.js ✅ ADDED: submitPreferences()
└── styles/
    └── preferences.css (450 lines) ✨ COMPLETELY REWRITTEN

backend/
├── routes/
│   └── preferences.js (unchanged - already complete)
└── models/
    └── Preference.js (unchanged - already complete)
```

## How to Test

### Step 1: Start Servers

```bash
# Terminal 1 - Frontend
cd frontend && npm start

# Terminal 2 - Backend
cd backend && npm start
```

### Step 2: Navigate to Preferences

1. Go to http://localhost:3000
2. Click "Preferences" in navbar
3. See empty form (first-time user)

### Step 3: Configure Preferences

1. **Age Range**: Drag sliders from 25 to 45 (or your preference)
2. **Location**: Type "Los Angeles, CA" (optional)
3. **Search Radius**: Drag to 30 miles (or your preference)
4. **Relationship Type**: Select "Monogamous"
5. **Interests**: Check 5-10 interests (e.g., Travel, Fitness, Art & Music)
6. Click **"Save Preferences"**

### Step 4: Verify Success

- Should redirect to Profile page
- Navigate back to Preferences
- Should show View Mode with all your data
- Click **"Edit"** to modify

### Step 5: Test Mobile

1. Press F12 (DevTools)
2. Click device toggle (mobile icon)
3. Verify form works on iPhone size
4. Check that sliders are usable on touch

## Key Features

### 1. Age Range Sliders

- Dual interactive sliders (18-120 years)
- Real-time value display
- Cannot cross: min ≤ max always
- Visual feedback on hover
- Works with keyboard and touch

### 2. Location Preferences

- Optional location input
- Search radius slider (1-500 miles)
- Real-time radius display
- Validation prevents invalid ranges

### 3. Interest Selection

- 16 interest options in grid
- Checkboxes for multiple selection
- No minimum/maximum selection
- Visual feedback on hover
- Grid adapts to screen size

### 4. Relationship Type

- Dropdown with 4 options:
  - Any (default)
  - Monogamous
  - Open relationship
  - Not sure

### 5. Validation

```
✅ Age range: 18-120 both values
✅ Min ≤ Max (min cannot be greater than max)
✅ Radius: 1-500 miles
✅ At least 1 interest selected
❌ Errors show in red
❌ Errors clear when user types
```

### 6. View/Edit Modes

- **First time**: Shows empty form
- **After saving**: Shows View Mode with data
- **Edit button**: Switches to form
- **Cancel button**: Reverts unsaved changes

## Question Types Included

### Age Range (Dual Sliders)

```
Min Age: 25 ——●———— Max: 45
         18      120
```

### Location (Text Input + Radius Slider)

```
Location: [Los Angeles, CA        ]
Radius:   ———●———— 30 miles
          1      500
```

### Interests (Checkbox Grid)

```
☐ Travel        ☐ Fitness       ☐ Cooking       ☐ Art & Music
☐ Reading       ☐ Outdoor activities ☐ Movies & TV  ☐ Gaming
☐ Sports        ☐ Photography   ☐ Volunteering  ☐ Meditation
☐ Fashion       ☐ Technology    ☐ Animals       ☐ Gardening
```

### Relationship Type (Dropdown)

```
[Monogamous ▼]
- Any
- Monogamous
- Open relationship
- Not sure
```

## Browser Console Test

### Test Preferences Submission

```javascript
const testPreferences = async () => {
  const data = {
    userId: 1,
    minAge: 22,
    maxAge: 45,
    location: "Los Angeles, CA",
    locationRadius: 30,
    interests: [
      "Travel",
      "Fitness",
      "Art & Music",
      "Reading",
      "Outdoor activities",
    ],
    relationshipType: "Monogamous",
  };

  const res = await fetch("http://localhost:3001/api/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log("Result:", await res.json());
};

testPreferences();
```

### Fetch Existing Preferences

```javascript
fetch("http://localhost:3001/api/preferences/user/1")
  .then((r) => r.json())
  .then(console.log);
```

### Update Preferences

```javascript
const updatePrefs = async () => {
  const res = await fetch("http://localhost:3001/api/preferences/user/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 1,
      minAge: 25,
      maxAge: 50,
      location: "Venice Beach, CA",
      locationRadius: 25,
      interests: ["Travel", "Fitness", "Reading"],
      relationshipType: "Any",
    }),
  });

  console.log("Updated:", await res.json());
};

updatePrefs();
```

## Expected Behavior

| Action                   | Expected Result                      |
| ------------------------ | ------------------------------------ |
| Load page first time     | Empty form visible                   |
| Drag age slider          | Min/Max age updates in real-time     |
| Set min > max            | Slider prevents invalid state        |
| Type location (optional) | Text updates form                    |
| Drag radius slider       | Radius value displays next to slider |
| Check interests          | Checked items update count           |
| Select relationship type | Dropdown shows selection             |
| Submit form              | Redirects to profile page            |
| Navigate back            | View mode shows all saved data       |
| Click Edit               | Form shows with existing data        |
| Update preferences       | Changes persist in database          |
| Click Cancel             | Reverts to last saved state          |
| Refresh page             | Data persists from database          |
| Test on mobile           | Form stacks properly                 |

## Form Validation Rules

```javascript
Validation checks:
✗ minAge < 18 or > 120 → "Age must be 18-120"
✗ maxAge < 18 or > 120 → "Age must be 18-120"
✗ minAge > maxAge → "Min age cannot exceed max age"
✗ radius < 1 or > 500 → "Radius must be 1-500 miles"
✗ no interests selected → "Select at least one interest"
```

## Data Structure

### Preferences Table

```javascript
{
  id: 1,
  userId: 1,
  minAge: 22,
  maxAge: 45,
  location: 'Los Angeles, CA',
  locationRadius: 30,
  interests: ['Travel', 'Fitness', 'Art & Music', 'Reading'],
  relationshipType: 'Monogamous',
  createdAt: '2025-11-21T10:00:00.000Z',
  updatedAt: '2025-11-21T10:35:00.000Z'
}
```

## Architecture Pattern

Follows established patterns from Profile Edit and Questionnaire:

```
Component → Form State → Validation → Redux → API → Database
```

1. Component loads and fetches existing data
2. User modifies form fields
3. Real-time validation on input
4. Submit handler validates full form
5. API call (POST create or PUT update)
6. Redux dispatch to store data
7. Navigate or show success
8. View mode displays saved data

## Interest Options (16 Total)

```
Travel, Fitness, Cooking, Art & Music,
Reading, Outdoor activities, Movies & TV, Gaming,
Sports, Photography, Volunteering, Meditation,
Fashion, Technology, Animals, Gardening
```

## API Endpoints Used

### GET /api/preferences/user/:userId

Fetch user's preferences

```bash
curl http://localhost:3001/api/preferences/user/1
```

### POST /api/preferences

Create new preferences

```bash
curl -X POST http://localhost:3001/api/preferences \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"minAge":22,"maxAge":45,...}'
```

### PUT /api/preferences/user/:userId

Update existing preferences

```bash
curl -X PUT http://localhost:3001/api/preferences/user/1 \
  -H "Content-Type: application/json" \
  -d '{"minAge":25,"maxAge":50,...}'
```

## CSS Features

### Range Sliders

- Custom styled thumb (circle with shadow)
- Color feedback on hover
- Smooth transitions
- Works on desktop and touch devices
- No browser defaults visible

### Grid Layout

- Interests in responsive grid (4 columns desktop, 2 mobile)
- Auto-fills based on screen size
- Equal-width checkbox items
- Touch-friendly sizing

### Color Scheme

- Primary color: #ff6b6b (red/pink)
- Error color: #dc3545 (red)
- Neutral: #999 (gray text)
- Background: #fff with subtle borders

### Mobile Responsive

- Desktop (>1024px): Full width, 4-column grid
- Tablet (600-1024px): Adjusted spacing, 3-column grid
- Mobile (<600px): Single column, 2-column grid, full-width buttons

## Testing Checklist

- [ ] Load page first time - see empty form
- [ ] Age range sliders work smoothly
- [ ] Min/Max values update in real-time
- [ ] Cannot set min > max
- [ ] Location input optional (can be empty)
- [ ] Radius slider 1-500 range works
- [ ] Interest checkboxes work
- [ ] Can select/deselect interests
- [ ] Relationship dropdown shows 4 options
- [ ] Form validates before submit
- [ ] Errors show in red
- [ ] Errors clear when typing
- [ ] Submit button shows "Saving..."
- [ ] Successful submit redirects
- [ ] Can view saved preferences
- [ ] Edit button works
- [ ] Cancel reverts changes
- [ ] Data persists on refresh
- [ ] Mobile layout works
- [ ] Sliders work on touch devices
- [ ] API calls successful (console)
- [ ] Database has persisted data

## Troubleshooting

| Issue                         | Solution                                     |
| ----------------------------- | -------------------------------------------- |
| Sliders stuck                 | Clear browser cache, refresh page            |
| Form won't submit             | Ensure at least 1 interest selected          |
| Data won't save               | Check backend running on :3001               |
| View mode not showing         | Must save successfully first                 |
| Mobile looks broken           | Zoom to 100% in browser                      |
| Validation errors won't clear | Errors clear when you type in that field     |
| Can't drag slider             | Try mouse instead of touch, check CSS loaded |

## Success Indicators

✅ Form loads with empty state
✅ Age sliders work and display values
✅ Location and radius work
✅ Interest checkboxes functional
✅ Relationship dropdown shows options
✅ Validation prevents bad data
✅ Submit redirects to profile
✅ View mode shows saved data
✅ Edit mode allows updates
✅ Cancel reverts changes
✅ Data persists on refresh
✅ Mobile responsive works
✅ No console errors

## Next Steps

After Preferences is tested:

1. ✅ **Profile** - Complete
2. ✅ **Questionnaire** - Complete
3. ✅ **Preferences** - Complete
4. ⏳ **Discovery** - Browse other users
5. ⏳ **Matching** - Find matches based on preferences
6. ⏳ **Messaging** - Chat with matches
