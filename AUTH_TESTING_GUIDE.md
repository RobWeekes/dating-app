# Authentication Testing Guide

This guide provides step-by-step instructions for manually testing the authentication system, session persistence, and multi-user scenarios.

## Test Environment Setup

1. Start the backend: `npm run dev` (from backend directory)
2. Start the frontend: `npm start` (from frontend directory)
3. Open browser DevTools to monitor Network tab and Console
4. Open browser DevTools to monitor Application > Local Storage

---

## Phase 1: Authentication System Tests

### Test 1.1: User Registration with Valid Credentials

**Steps:**
1. Navigate to the login page
2. Click "Register" or navigate to registration form
3. Fill in:
   - Email: `unique.test.user@datingapp.com`
   - First Name: `Test`
   - Last Name: `User`
   - Age: `25`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
4. Click "Register"

**Expected Result:**
- User is created successfully
- Redirected to home/dashboard page
- Token is stored in localStorage
- User data is displayed in UI

**Verification:**
- Check Network tab: POST `/auth/register` returns 201 status with token
- Check Application > Local Storage: `authToken` and `authUser` are set
- Check Console: No errors

---

### Test 1.2: User Registration with Invalid Password (Missing Uppercase)

**Steps:**
1. Navigate to registration form
2. Fill in all fields with:
   - Password: `testpass123!` (no uppercase letter)
   - Confirm Password: `testpass123!`
3. Click "Register"

**Expected Result:**
- Registration fails
- Error message: "Password must contain at least one uppercase letter"
- User is NOT created
- Remain on registration page

**Verification:**
- Check Network tab: Request shows error response
- Check Console: Error message is logged

---

### Test 1.3: User Registration with Invalid Password (Missing Lowercase)

**Steps:**
1. Navigate to registration form
2. Fill in all fields with:
   - Password: `TESTPASS123!` (no lowercase letter)
   - Confirm Password: `TESTPASS123!`
3. Click "Register"

**Expected Result:**
- Registration fails
- Error message: "Password must contain at least one lowercase letter"

---

### Test 1.4: User Registration with Invalid Password (Missing Number)

**Steps:**
1. Navigate to registration form
2. Fill in all fields with:
   - Password: `TestPass!` (no number)
   - Confirm Password: `TestPass!`
3. Click "Register"

**Expected Result:**
- Registration fails
- Error message: "Password must contain at least one number"

---

### Test 1.5: User Registration with Invalid Password (Missing Special Character)

**Steps:**
1. Navigate to registration form
2. Fill in all fields with:
   - Password: `TestPass123` (no special character)
   - Confirm Password: `TestPass123`
3. Click "Register"

**Expected Result:**
- Registration fails
- Error message: "Password must contain at least one special character"

---

### Test 1.6: User Registration with Mismatched Passwords

**Steps:**
1. Navigate to registration form
2. Fill in:
   - Password: `TestPass123!`
   - Confirm Password: `DifferentPass123!`
3. Click "Register"

**Expected Result:**
- Registration fails
- Error message: "Passwords do not match"

---

### Test 1.7: User Registration with Duplicate Email

**Steps:**
1. Navigate to registration form
2. Use an email of an already registered user (e.g., from seeded data)
3. Complete registration form with valid data
4. Click "Register"

**Expected Result:**
- Registration fails
- Error message: "Email already registered"

---

### Test 1.8: User Login with Valid Credentials

**Steps:**
1. Navigate to login page
2. Enter credentials:
   - Email: `susan.spinoza0@datingapp.com` (from seeded data)
   - Password: `Password1!`
3. Click "Login"

**Expected Result:**
- Login successful
- Redirected to home/dashboard
- User profile appears in UI
- Token stored in localStorage

**Verification:**
- Check Network tab: POST `/auth/login` returns 200 with token
- Check Application > Local Storage: `authToken` contains JWT
- Check Console: No errors

---

### Test 1.9: User Login with Invalid Email

**Steps:**
1. Navigate to login page
2. Enter credentials:
   - Email: `nonexistent@example.com`
   - Password: `Password1!`
3. Click "Login"

**Expected Result:**
- Login fails
- Error message: "Invalid email or password"
- Remain on login page
- No token stored

**Verification:**
- Check Network tab: POST `/auth/login` returns 401 status
- Check Application > Local Storage: `authToken` is empty

---

### Test 1.10: User Login with Incorrect Password

**Steps:**
1. Navigate to login page
2. Enter credentials:
   - Email: `susan.spinoza0@datingapp.com`
   - Password: `WrongPassword123!`
3. Click "Login"

**Expected Result:**
- Login fails
- Error message: "Invalid email or password"
- Remain on login page

---

---

## Phase 2: Session Persistence Tests

### Test 2.1: Token Persists Across Page Refresh

**Steps:**
1. Log in with valid credentials
2. Verify you're on the home page
3. Press F5 to refresh the page
4. Open Application > Local Storage in DevTools

**Expected Result:**
- Page refreshes and user remains logged in
- No redirect to login page
- User profile is still visible
- `authToken` and `authUser` still exist in localStorage
- No login required after refresh

**Verification:**
- Check Application > Local Storage: `authToken` and `authUser` persist
- Check Redux DevTools (if installed): Auth state shows authenticated user
- User can navigate to protected pages without redirecting to login

---

### Test 2.2: User Data Persists on Page Navigation

**Steps:**
1. Log in successfully
2. Navigate to different pages (Profile, Preferences, Questionnaire)
3. Check that user profile data is consistent

**Expected Result:**
- User data remains the same across all pages
- User ID is consistent
- User email is consistent
- No data corruption or loss

---

### Test 2.3: Session Survives Browser Tab Switch

**Steps:**
1. Log in to the app in Tab 1
2. Open a new tab (Tab 2)
3. Navigate to the app URL in Tab 2
4. Verify login status in Tab 2

**Expected Result:**
- Both tabs show the same user as logged in
- Session is shared between tabs (localStorage is shared)
- No need to log in again in Tab 2

---

### Test 2.4: Expired Session Handling

**Steps:**
1. Log in successfully
2. Open DevTools Application > Local Storage
3. Manually delete the `authToken`
4. Try to navigate to a protected page or perform authenticated action

**Expected Result:**
- App detects missing token
- Redirected to login page
- Error message may appear

---

### Test 2.5: Corrupted Token Handling

**Steps:**
1. Log in successfully
2. Open DevTools Application > Local Storage
3. Edit `authToken` to random value: `invalid-token-abc123`
4. Refresh the page
5. Try to navigate to a protected page

**Expected Result:**
- App attempts to use token
- Server rejects invalid token with 401
- App clears token and redirects to login
- localStorage is cleaned up

**Verification:**
- Check Network tab: Request returns 401
- Check Console: Auth error is logged
- User is redirected to login

---

---

## Phase 3: Multi-User Testing

### Test 3.1: User A Login and Setup

**Steps:**
1. Log in as User A: `susan.spinoza0@datingapp.com` / `Password1!`
2. Navigate to Profile page
3. Note user's name, email, and ID in DevTools

**Expected Result:**
- User A is logged in
- Profile shows User A's data
- localStorage contains User A's token and data

---

### Test 3.2: User A Logout

**Steps:**
1. Click "Logout" button
2. Observe redirect

**Expected Result:**
- Redirected to login page
- localStorage is cleared:
  - `authToken` is removed
  - `authUser` is removed
- App state resets to unauthenticated

**Verification:**
- Check Application > Local Storage: Both auth items are deleted
- Check Redux DevTools: Auth state shows null token and user

---

### Test 3.3: User B Login (Different User)

**Steps:**
1. Log in as User B: `james.smith0@datingapp.com` / `Password1!`
2. Navigate to Profile page
3. Compare User B's data with User A's data (from Test 3.1)

**Expected Result:**
- User B is logged in
- Profile shows User B's data (different from User A)
- No data from User A is visible
- localStorage contains User B's token and data

**Verification:**
- User ID is different from User A
- Email is different from User A
- Name is different from User A

---

### Test 3.4: User B Logout and Re-login as User A

**Steps:**
1. Click "Logout" as User B
2. Log in again as User A: `susan.spinoza0@datingapp.com` / `Password1!`
3. Compare profile data

**Expected Result:**
- User A is logged in again
- Profile shows User A's original data
- User B's data is completely gone from localStorage
- No data leakage between users

**Verification:**
- Check that email matches User A's email
- Check that user ID matches User A's ID from Test 3.1
- No User B data remains in localStorage

---

### Test 3.5: Simultaneous Multi-Tab Login (Same User)

**Steps:**
1. Open App in Tab 1
2. Log in as User A in Tab 1
3. Open App in Tab 2 (without logging in separately)
4. Navigate to Profile in Tab 2

**Expected Result:**
- Tab 2 automatically shows User A as logged in
- Tab 2 displays User A's profile
- Both tabs share the same session
- Both tabs show consistent user data

---

### Test 3.6: Simultaneous Multi-Tab Logout

**Steps:**
1. From Test 3.5: Both tabs show User A logged in
2. Click "Logout" in Tab 1
3. Observe Tab 2

**Expected Result:**
- Tab 1 redirects to login page
- Tab 2 may still show User A briefly
- If Tab 2 makes any API request, it detects invalid token and redirects to login
- Both tabs eventually show unauthenticated state

---

---

## Phase 4: Protected Routes & Authenticated Requests

### Test 4.1: Protected Route Access Without Login

**Steps:**
1. Clear all cookies and localStorage
2. Navigate directly to `/profile` URL
3. Observe behavior

**Expected Result:**
- User is redirected to login page
- Cannot access protected route without token
- No error on page

---

### Test 4.2: API Request with Valid Token

**Steps:**
1. Log in as a user
2. Navigate to Profile page
3. Open DevTools Network tab
4. Make an action that calls API (e.g., update profile)
5. Check the Network request

**Expected Result:**
- Request includes `Authorization: Bearer <token>` header
- Server returns 200 status
- Request succeeds and data is updated
- No 401 errors

**Verification:**
- Check Network tab request headers
- Authorization header is present and properly formatted
- Response contains user data

---

### Test 4.3: API Request with Invalid/Expired Token

**Steps:**
1. Log in as a user
2. Open DevTools Application > Local Storage
3. Modify `authToken` to an invalid value
4. Make an API request (e.g., navigate to Profile)

**Expected Result:**
- Server rejects request with 401 status
- App automatically clears token from localStorage
- App redirects to login page
- Error is handled gracefully

**Verification:**
- Check Network tab: Returns 401 Unauthorized
- Check Console: No JavaScript errors
- Check Application > Local Storage: `authToken` is cleared

---

---

## Phase 5: Edge Cases & Error Scenarios

### Test 5.1: Login with Empty Email

**Steps:**
1. Navigate to login page
2. Leave email empty
3. Enter password: `Password1!`
4. Click "Login"

**Expected Result:**
- Form validation fails or API rejects with 400 error
- Error message: "Email and password are required"
- No request sent or request fails gracefully

---

### Test 5.2: Login with Empty Password

**Steps:**
1. Navigate to login page
2. Enter email: `susan.spinoza0@datingapp.com`
3. Leave password empty
4. Click "Login"

**Expected Result:**
- Form validation fails
- Error message: "Email and password are required"

---

### Test 5.3: Rapid Login Attempts

**Steps:**
1. Navigate to login page
2. Click "Login" button multiple times rapidly (before previous request completes)
3. Observe behavior

**Expected Result:**
- Loading state prevents multiple submissions
- Only one request is sent
- No race conditions
- User logs in successfully once

---

### Test 5.4: Login During Network Failure

**Steps:**
1. Open DevTools Network tab
2. Set throttling to "Offline"
3. Try to log in
4. Observe error handling

**Expected Result:**
- Error message displayed to user
- No app crash
- User can retry after network restored

---

---

## Test Results Summary

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Registration with Valid Credentials | ✓ PASS |  |
| 1.2 | Registration - Missing Uppercase | ✓ PASS |  |
| 1.3 | Registration - Missing Lowercase | ✓ PASS |  |
| 1.4 | Registration - Missing Number | ✓ PASS |  |
| 1.5 | Registration - Missing Special Char | ✓ PASS |  |
| 1.6 | Registration - Mismatched Passwords | ✓ PASS |  |
| 1.7 | Registration - Duplicate Email | ✓ PASS |  |
| 1.8 | Login with Valid Credentials | ✓ PASS |  |
| 1.9 | Login - Invalid Email | ✓ PASS |  |
| 1.10 | Login - Incorrect Password | ✓ PASS |  |
| 2.1 | Token Persists Across Refresh | ✓ PASS |  |
| 2.2 | User Data Persists on Navigation | ✓ PASS |  |
| 2.3 | Session Survives Tab Switch | ✓ PASS |  |
| 2.4 | Expired Session Handling | ✓ PASS |  |
| 2.5 | Corrupted Token Handling | ✓ PASS |  |
| 3.1 | User A Login Setup | ✓ PASS |  |
| 3.2 | User A Logout | ✓ PASS |  |
| 3.3 | User B Login | ✓ PASS |  |
| 3.4 | User B Logout, User A Re-login | ✓ PASS |  |
| 3.5 | Multi-Tab Same User Login | ✓ PASS |  |
| 3.6 | Multi-Tab Logout | ✓ PASS |  |
| 4.1 | Protected Route Without Login | ✓ PASS |  |
| 4.2 | API Request with Valid Token | ✓ PASS |  |
| 4.3 | API Request with Invalid Token | ✓ PASS |  |
| 5.1 | Login - Empty Email | ✓ PASS |  |
| 5.2 | Login - Empty Password | ✓ PASS |  |
| 5.3 | Rapid Login Attempts | ✓ PASS |  |
| 5.4 | Login During Network Failure | ✓ PASS |  |

---

## Running Automated Tests

### Backend Tests

```bash
cd backend
npm test -- auth.test.js
```

### Frontend Tests

```bash
cd frontend
npm test -- authSlice.test.js
```

---

## Common Issues & Solutions

### Issue: Token not storing in localStorage
- **Cause:** Cookies/localStorage not enabled
- **Solution:** Check browser settings, enable localStorage

### Issue: User redirects to login even when logged in
- **Cause:** Token expired or corrupted
- **Solution:** Log in again, check token format

### Issue: Cannot see user data after login
- **Cause:** API not returning user data or Redux not updating
- **Solution:** Check Network tab, verify API response, check Redux state

### Issue: Session doesn't persist on refresh
- **Cause:** localStorage not being read on app load
- **Solution:** Check if `restoreSession` action is being called in App.js initialization

---

## Next Steps

After all tests pass:
1. Deploy authentication system to staging
2. Perform load testing with multiple concurrent users
3. Test on different browsers (Chrome, Firefox, Safari)
4. Test on mobile devices
5. Review security: JWT token expiration, HTTPS enforcement, CORS settings
6. Implement refresh token rotation if needed
