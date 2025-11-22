# Quick Integration Test Checklist

## Prerequisites ✅

- [x] Backend running on port 3001
- [x] Frontend running on port 3000
- [x] Redux initialized with test user (Larry Dalton, ID 1)
- [x] Test user exists in database (ID 1)
- [x] All API endpoints verified working

## Step-by-Step Integration Test

### Step 1: View Profile (Display Redux Data)

```
1. Open browser: http://localhost:3000
2. Click on "Profile" in navbar
3. VERIFY: See "My Profile" page with:
   - Profile photo (avatar)
   - Email: larry.dalton0@datingapp.com
   - Name: Larry Dalton
   - Age: 29
   - Location: Glendale, Los Angeles, CA
   - Bio: Gym rat dedicated to health and fitness.
```

**Expected Result**: ✅ All data displays correctly from Redux

---

### Step 2: Navigate to Edit Profile

```
1. Click "Edit Profile" button on Profile page
2. URL should change to: http://localhost:3000/profile/edit
3. VERIFY: Edit form displays with all fields pre-filled
```

**Expected Result**: ✅ Form loads with current user data

---

### Step 3: Test Form Validation

```
1. Clear "First Name" field completely
2. Click "Save Changes" button
3. VERIFY: Red error message appears: "First name is required"
4. Type "Larry" back into First Name
5. Error should disappear
```

**Expected Result**: ✅ Form validation works

---

### Step 4: Edit and Save Profile (Integration Test)

```
1. Change Bio field to: "Love hiking and coffee!"
2. Keep other fields the same
3. Click "Save Changes" button
4. Wait for request to complete (~500ms)
5. Should redirect to http://localhost:3000/profile
6. VERIFY: Bio now shows "Love hiking and coffee!"
```

**Expected Result**: ✅ Form submitted to API, Redux updated, UI reflects changes

**How to verify in browser console**:

```javascript
// Open DevTools (F12) > Console tab, type:
// Check if Redux DevTools extension shows the updated profile
// Or check Network tab to see PUT request to /api/users/1
```

---

### Step 5: Verify Database Persistence

```
1. Refresh the page (F5 or Ctrl+R)
2. Wait for page to reload
3. VERIFY: Bio still shows "Love hiking and coffee!"
```

**Expected Result**: ✅ Data persists in database across page refresh

---

### Step 6: Test Canceling Changes

```
1. Click "Edit Profile" button again
2. Change Age to 31
3. Click "Cancel" button (not Save)
4. URL should change back to /profile
5. VERIFY: Age still shows 29 (not 31)
```

**Expected Result**: ✅ Changes discarded, original data preserved

---

### Step 7: Update Multiple Fields

```
1. Click "Edit Profile" button
2. Change:
   - First Name: "Lawrence"
   - Age: 30
   - Location: "Santa Monica, CA"
3. Click "Save Changes"
4. VERIFY: All three fields updated in profile view
```

**Expected Result**: ✅ Multiple field update works

---

### Step 8: Test Error Handling

```
1. Open Terminal and STOP backend server (Ctrl+C)
2. Go to Edit form: http://localhost:3000/profile/edit
3. Make a change to any field
4. Click "Save Changes"
5. VERIFY: Error message displays
6. RESTART backend server
7. Try again - should work now
```

**Expected Result**: ✅ Error handled gracefully

---

## Summary of Integration Points Tested

| Component            | Status | Notes                                  |
| -------------------- | ------ | -------------------------------------- |
| Redux Initialization | ✅     | Test user data loaded                  |
| Profile View         | ✅     | Displays Redux data                    |
| Route Navigation     | ✅     | /profile and /profile/edit routes work |
| Form Validation      | ✅     | Required fields and email validation   |
| API Request          | ✅     | PUT request sent to backend            |
| API Response         | ✅     | Backend returns updated user           |
| Redux Update         | ✅     | Dispatch action with response data     |
| UI Refresh           | ✅     | Profile view shows updated data        |
| Navigation           | ✅     | Redirect after save works              |
| Database             | ✅     | Changes persist across refresh         |
| Error Handling       | ✅     | Graceful error messages                |
| Cancel Function      | ✅     | Discard changes without saving         |

---

## Browser Console Debugging

If something goes wrong, open DevTools (F12) and check:

**Check Redux State**:

```javascript
// If Redux DevTools extension installed, click the extension
// Or type in console:
// Look for state tree > user > profile
```

**Check Network Requests**:

```
DevTools > Network tab
1. Look for PUT request to http://localhost:3001/api/users/1
2. Check Status should be 200
3. Check Response should have updated data
```

**Check Console Errors**:

```
DevTools > Console tab
- Look for red error messages
- Check for 404, 500 errors
- Verify CORS not blocking requests
```

---

## When Tests Pass ✅

All 8 test steps pass = **Full stack integration is working!**

Next steps:

1. Implement Questionnaire feature (same pattern)
2. Implement Preferences feature (same pattern)
3. Build authentication system
4. Create match-finding algorithm

---

## Quick Reference: API Endpoints

| Method | Endpoint                   | Purpose                |
| ------ | -------------------------- | ---------------------- |
| GET    | /api/health                | Health check           |
| GET    | /api/users/1               | Fetch test user        |
| PUT    | /api/users/1               | Update test user       |
| POST   | /api/questionnaires        | Create questionnaire   |
| GET    | /api/questionnaires/user/1 | Get user questionnaire |
| POST   | /api/preferences           | Create preferences     |
| GET    | /api/preferences/user/1    | Get user preferences   |

Base URL: `http://localhost:3001/api`

---

## Files Updated for Integration

- ✅ `frontend/src/redux/slices/userSlice.js` - Initialized with test user
- ✅ `frontend/src/pages/Profile.js` - Edit form with API integration
- ✅ `frontend/src/services/api.js` - API service methods
- ✅ `backend/server.js` - Express running on 3001
- ✅ `backend/dating_app.db` - SQLite with 100 test users
- ✅ `frontend/package.json` - Proxy configured to 3001

---

## Current Servers

```
Frontend: http://localhost:3000 (React Dev Server)
Backend:  http://localhost:3001 (Express API)
Database: backend/dating_app.db (SQLite)
```

Ready to test! 🚀
