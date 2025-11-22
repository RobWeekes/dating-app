# Frontend-Backend Integration Test Report

**Date**: November 20, 2025
**Status**: ✅ READY FOR TESTING
**Environment**: React 19.2.0 + Express.js + SQLite + Redux Toolkit

## Test Objectives

1. Verify frontend can display user data from Redux initialization
2. Test Profile Edit form with backend API integration
3. Validate API request/response flow (PUT /api/users/:id)
4. Confirm Redux state updates with API response
5. Test form validation and error handling
6. Verify UI reflects updated data

## Current Test Setup

### Frontend State

- **URL**: http://localhost:3000
- **Port**: 3000 (Development Server)
- **Redux State**: Initialized with Test User (Larry Dalton, ID: 1)
- **API Base URL**: http://localhost:3001/api
- **Proxy**: Configured to http://localhost:3001

### Test User Data (In Redux)

```javascript
{
  id: 1,
  email: 'larry.dalton0@datingapp.com',
  firstName: 'Larry',
  lastName: 'Dalton',
  age: 29,
  bio: 'Gym rat dedicated to health and fitness.',
  location: 'Glendale, Los Angeles, CA',
  profilePhotoUrl: 'https://i.pravatar.cc/150?img=0',
  isAuthenticated: true
}
```

### Backend State

- **URL**: http://localhost:3001
- **Port**: 3001 (Express Server)
- **Database**: SQLite (dating_app.db)
- **User in DB**: ID 1 (Larry Dalton) with matching data

---

## Test Cases

### Test 1: Profile View Page

**Objective**: Verify Profile page displays user data from Redux

**Steps**:

1. Navigate to http://localhost:3000/profile
2. Wait for page to render
3. Verify all fields display:
   - Profile photo (avatar)
   - Email: larry.dalton0@datingapp.com
   - Name: Larry Dalton
   - Age: 29
   - Location: Glendale, Los Angeles, CA
   - Bio: Gym rat dedicated to health and fitness.

**Expected Result**: ✅ All user data displays correctly from Redux initialization

**Actual Result**:

- [ ] Pass
- [ ] Fail - Issue: **********\_\_\_**********

---

### Test 2: Navigate to Edit Mode

**Objective**: Verify Edit Profile button navigates to edit form

**Steps**:

1. On Profile view page, click "Edit Profile" button
2. Verify URL changes to http://localhost:3000/profile/edit
3. Verify form displays with all fields pre-filled with current data

**Expected Result**: ✅ Edit form loads with user data

**Actual Result**:

- [ ] Pass
- [ ] Fail - Issue: **********\_\_\_**********

---

### Test 3: Form Validation

**Objective**: Test form validation before API submission

**Steps**:

1. On Edit form page, clear "First Name" field
2. Try to submit form
3. Verify error message appears: "First name is required"
4. Repeat for other required fields (Last Name, Email)
5. Enter invalid email (e.g., "notanemail")
6. Verify error: "Email is invalid"

**Expected Result**: ✅ Form validation prevents submission and shows error messages

**Actual Result**:

- [ ] Pass
- [ ] Fail - Issue: **********\_\_\_**********

---

### Test 4: Profile Edit API Integration

**Objective**: Test complete form submission to backend API

**Steps**:

1. On Edit form page, modify the Bio field to: "Love hiking and coffee!"
2. Keep other fields unchanged
3. Click "Save Changes" button
4. Monitor network tab for PUT request to http://localhost:3001/api/users/1

**Expected Request**:

```
PUT /api/users/1
Content-Type: application/json

{
  "email": "larry.dalton0@datingapp.com",
  "firstName": "Larry",
  "lastName": "Dalton",
  "age": 29,
  "bio": "Love hiking and coffee!",
  "location": "Glendale, Los Angeles, CA",
  "profilePhotoUrl": "https://i.pravatar.cc/150?img=0"
}
```

**Expected Response** (HTTP 200):

```json
{
  "id": 1,
  "email": "larry.dalton0@datingapp.com",
  "firstName": "Larry",
  "lastName": "Dalton",
  "age": 29,
  "bio": "Love hiking and coffee!",
  "location": "Glendale, Los Angeles, CA",
  "profilePhotoUrl": "https://i.pravatar.cc/150?img=0",
  "updatedAt": "2025-11-20T10:30:45.000Z",
  "createdAt": "2025-11-20T01:07:53.000Z"
}
```

**Expected Result**: ✅ API call succeeds, returns updated user data

**Actual Result**:

- [ ] Pass - API Response: ******\_\_\_******
- [ ] Fail - Error: **********\_\_\_**********

---

### Test 5: Redux State Update

**Objective**: Verify Redux updates with API response

**Steps**:

1. After Test 4 (API submission), open browser DevTools
2. Check Redux state in Redux DevTools extension
3. Verify `user.profile.bio` has changed to "Love hiking and coffee!"
4. Verify `user.isLoading` is false
5. Verify `user.error` is null

**Expected Result**: ✅ Redux state reflects updated data from API

**Actual Result**:

- [ ] Pass - Redux State: ******\_\_\_******
- [ ] Fail - Issue: **********\_\_\_**********

---

### Test 6: Navigation After Edit

**Objective**: Verify redirect after successful update

**Steps**:

1. After submitting form in Test 4
2. Wait 0.5 seconds
3. Verify URL changes back to http://localhost:3000/profile (view mode)
4. Verify profile view now displays "Love hiking and coffee!" in bio

**Expected Result**: ✅ Page redirects to profile view, displays updated data

**Actual Result**:

- [ ] Pass
- [ ] Fail - Issue: **********\_\_\_**********

---

### Test 7: Change Multiple Fields

**Objective**: Test updating multiple fields at once

**Steps**:

1. Navigate to /profile/edit
2. Change:
   - firstName: "Lawrence"
   - age: "30"
   - location: "Santa Monica, Los Angeles, CA"
3. Click "Save Changes"
4. Wait for redirect
5. Verify all three fields updated in profile view

**Expected Result**: ✅ Multiple field update succeeds

**Actual Result**:

- [ ] Pass - Updated Fields: ******\_\_\_******
- [ ] Fail - Issue: **********\_\_\_**********

---

### Test 8: Cancel Edit Without Saving

**Objective**: Test cancel functionality preserves original data

**Steps**:

1. Navigate to /profile/edit
2. Change bio to "Temporary change"
3. Click "Cancel" button (not Save)
4. Verify URL changes back to /profile (view mode)
5. Verify bio still shows "Love hiking and coffee!" (from Test 4)

**Expected Result**: ✅ Changes discarded, original data preserved

**Actual Result**:

- [ ] Pass
- [ ] Fail - Issue: **********\_\_\_**********

---

### Test 9: API Error Handling

**Objective**: Test error handling when API fails

**Steps**:

1. Stop the backend server (Ctrl+C in backend terminal)
2. Navigate to /profile/edit
3. Make a change to bio field
4. Click "Save Changes"
5. Wait for error response
6. Verify error message displays: "Failed to update profile" or similar

**Expected Result**: ✅ Error displays gracefully, user can retry

**Actual Result**:

- [ ] Pass - Error Message: ******\_\_\_******
- [ ] Fail - Issue: **********\_\_\_**********

**Cleanup**: Restart backend server

---

### Test 10: Database Persistence

**Objective**: Verify changes persist in database

**Steps**:

1. Make sure backend is running
2. On Edit form, change bio to "Database persistence test"
3. Click "Save Changes"
4. Verify profile updates in UI
5. Refresh page (F5)
6. Verify bio still shows "Database persistence test"

**Expected Result**: ✅ Data persists across page refresh

**Actual Result**:

- [ ] Pass
- [ ] Fail - Issue: **********\_\_\_**********

---

## Test Execution Log

**Test Date**: ******\_******
**Tester**: ******\_******
**Environment**: WSL Ubuntu 20.04 | Node v18.20.8

| Test # | Name                | Status | Notes |
| ------ | ------------------- | ------ | ----- |
| 1      | Profile View        | ⬜     |       |
| 2      | Edit Navigation     | ⬜     |       |
| 3      | Form Validation     | ⬜     |       |
| 4      | API Integration     | ⬜     |       |
| 5      | Redux Update        | ⬜     |       |
| 6      | Redirect After Edit | ⬜     |       |
| 7      | Multiple Fields     | ⬜     |       |
| 8      | Cancel Edit         | ⬜     |       |
| 9      | Error Handling      | ⬜     |       |
| 10     | DB Persistence      | ⬜     |       |

**Summary**: \_\_\_/10 tests passed

---

## API Endpoints Being Tested

### PUT /api/users/:id

- **Purpose**: Update user profile
- **Request Body**: User fields (email, firstName, lastName, age, bio, location, profilePhotoUrl)
- **Response**: Updated user object with timestamps
- **Error Codes**: 400 (validation), 404 (not found), 500 (server error)

### GET /api/users/:id

- **Purpose**: Fetch user by ID (used after page refresh to verify persistence)
- **Response**: User object

---

## Debugging Tips

**Issue: Form doesn't submit**

- Check browser console for errors
- Verify Redux DevTools shows user ID correctly
- Check that backend is running on 3001

**Issue: API returns 404**

- Verify user ID is 1
- Check that database has user with ID 1
- Run: `curl http://localhost:3001/api/users/1`

**Issue: Form data not updating Redux**

- Check Redux DevTools to see if action dispatched
- Verify API response matches expected format
- Check for any error messages in console

**Issue: Changes don't persist**

- Stop and restart backend (may need database migration)
- Check database file exists at backend/dating_app.db
- Verify Sequelize connection is working

---

## Notes

- Both frontend and backend are running
- Test user (ID 1) initialized in Redux
- Test user (ID 1) exists in SQLite database with matching data
- All API endpoints previously tested and verified working
- Ready for full integration test
