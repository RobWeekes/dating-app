# Authentication Testing Checklist

Quick reference for testing the authentication system.

## Pre-Test Setup
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Database seeded with demo users
- [ ] DevTools open with Network, Application, and Console tabs visible
- [ ] localStorage visible in Application tab

## Quick Test Users (Seeded Data)
```
Email: susan.spinoza0@datingapp.com
Password: Password1!

Email: james.smith0@datingapp.com
Password: Password1!

Email: michael.jones1@datingapp.com
Password: Password2!

(Pattern: {firstName}.{lastName}{index}@datingapp.com / Password{index+1}!)
```

---

## Phase 1: Registration Validation
- [ ] Valid registration succeeds
  - Email: `test.reg@datingapp.com`
  - Password: `ValidPass123!`
  
- [ ] Missing uppercase letter rejected
  - Password: `validpass123!`
  
- [ ] Missing lowercase letter rejected
  - Password: `VALIDPASS123!`
  
- [ ] Missing number rejected
  - Password: `ValidPass!`
  
- [ ] Missing special character rejected
  - Password: `ValidPass123`
  
- [ ] Too short (< 8 chars) rejected
  - Password: `Pass1!`
  
- [ ] Mismatched passwords rejected
- [ ] Duplicate email rejected
- [ ] Missing required fields rejected

## Phase 2: Login Validation
- [ ] Valid login succeeds
  - Check token in localStorage
  - Check user data in localStorage
  - Check Redux state
  
- [ ] Invalid email rejected
- [ ] Incorrect password rejected
- [ ] Missing email rejected
- [ ] Missing password rejected
- [ ] Empty fields rejected

## Phase 3: Session Persistence
- [ ] Token persists on page refresh
  - [ ] F5 refresh
  - [ ] Ctrl+R refresh
  - [ ] Close tab and reopen URL
  
- [ ] User data persists on refresh
- [ ] Multiple page navigations maintain session
- [ ] Session survives tab switch (2+ tabs)
- [ ] Closing browser tab doesn't affect other tabs
- [ ] Reopening browser restores session (if within expiry)

## Phase 4: Multi-User Testing
- [ ] User A logs in successfully
  - [ ] Check profile data (name, email, ID)
  
- [ ] User A logs out
  - [ ] localStorage is cleared
  - [ ] Redux state reset
  - [ ] Redirected to login
  
- [ ] User B logs in successfully
  - [ ] No User A data visible
  - [ ] User B's correct data displayed
  - [ ] New token in localStorage
  
- [ ] User B logs out and User A logs back in
  - [ ] User A's original data restored
  - [ ] No User B data present
  
- [ ] Simultaneous login in two tabs (same user)
  - [ ] Both tabs show logged in
  - [ ] Same user data in both
  
- [ ] Logout in one tab affects other tabs

## Phase 5: Protected Routes
- [ ] Cannot access `/profile` without login
  - [ ] Redirected to login
  
- [ ] Can access `/profile` when logged in
- [ ] API requests include `Authorization: Bearer <token>` header
- [ ] Invalid token triggers 401 response
- [ ] App handles 401 by clearing session and redirecting

## Phase 6: Edge Cases
- [ ] Empty email/password on login
- [ ] Rapid login attempts (no race conditions)
- [ ] Network timeout gracefully handled
- [ ] Manual token modification detected and handled
- [ ] Manual localStorage deletion handled
- [ ] Case-sensitive email validation (if applicable)
- [ ] Special characters in password work correctly
- [ ] Very long passwords handled (>100 chars)
- [ ] Password with spaces works

## Phase 7: Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browser (if applicable)

## Phase 8: Console & Network Checks
- [ ] No JavaScript errors in console
- [ ] No 4xx/5xx errors for auth endpoints
- [ ] No CORS errors
- [ ] Token format is valid JWT (3 parts separated by dots)
- [ ] No sensitive data in console logs
- [ ] Network requests are reasonable (no excessive retries)

## Token Validation (Backend)
- [ ] Token includes user ID and email
- [ ] Token has expiration time
- [ ] Token can be decoded (check in jwt.io)
- [ ] Signing key is consistent

## Security Checks
- [ ] Password never logged or displayed
- [ ] Token never exposed in URL parameters
- [ ] HTTPS enforcement (in production)
- [ ] HTTP-only cookies considered (optional enhancement)
- [ ] CORS properly configured
- [ ] No token in error messages

## Performance Checks
- [ ] Login completes within 2 seconds
- [ ] Page refresh with cached session is instant
- [ ] No memory leaks after multiple logins/logouts
- [ ] localStorage operations don't block UI

## Final Sign-Off
- [ ] All Phase 1 tests passed ✓
- [ ] All Phase 2 tests passed ✓
- [ ] All Phase 3 tests passed ✓
- [ ] All Phase 4 tests passed ✓
- [ ] All Phase 5 tests passed ✓
- [ ] All Phase 6 tests passed ✓
- [ ] All Phase 7 tests passed ✓
- [ ] All Phase 8 tests passed ✓
- [ ] All security checks passed ✓
- [ ] All performance checks passed ✓

---

## Quick Debug Commands

### Check localStorage (in browser console)
```javascript
// View all auth data
console.log(localStorage.getItem('authToken'));
console.log(JSON.parse(localStorage.getItem('authUser')));

// Clear all auth data
localStorage.removeItem('authToken');
localStorage.removeItem('authUser');

// Corrupt token (for testing error handling)
localStorage.setItem('authToken', 'invalid-token-xyz');
```

### Check Redux State (if Redux DevTools installed)
- Open Redux DevTools tab
- Look for auth slice
- Verify token, user, isAuthenticated, isLoading, error

### Check Network Requests
1. Network tab > Filter by "XHR/Fetch"
2. Look for `/auth/login` or `/auth/register`
3. Check Request headers: `Authorization`, `Content-Type`
4. Check Response: `token`, `user`, `message`
5. Check Response status: 200 (success), 400/401 (error)

### Check API Response Format
Expected login response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 25,
    "bio": "...",
    "location": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Test Result Template

**Test Date:** _______  
**Tester Name:** _______  
**Browser:** _______  
**Environment:** Development / Staging / Production  

### Failed Tests
| Test ID | Issue | Resolution | Status |
|---------|-------|-----------|--------|
|  |  |  |  |
|  |  |  |  |

### Overall Status: ✓ PASS / ✗ FAIL

**Notes:**
