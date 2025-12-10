/**
 * Authentication Manual Testing Script
 * 
 * Run this in the browser console to help with manual testing.
 * Copy and paste commands into the console to test various scenarios.
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Print a styled header for test output
 */
function testHeader(name) {
  console.log('%c========================================', 'color: blue; font-size: 14px; font-weight: bold;');
  console.log(`%c${name}`, 'color: blue; font-size: 14px; font-weight: bold;');
  console.log('%c========================================', 'color: blue; font-size: 14px; font-weight: bold;');
}

/**
 * Print a success message
 */
function testPass(message) {
  console.log(`%c✓ PASS: ${message}`, 'color: green; font-weight: bold;');
}

/**
 * Print a failure message
 */
function testFail(message) {
  console.log(`%c✗ FAIL: ${message}`, 'color: red; font-weight: bold;');
}

/**
 * Print general info
 */
function testInfo(message) {
  console.log(`%cℹ INFO: ${message}`, 'color: blue;');
}

// ============================================
// LOCALSTORAGE TESTS
// ============================================

/**
 * Test 1: Check if localStorage contains auth data
 */
function checkAuthStorage() {
  testHeader('Test: Check Auth Storage');
  
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');
  
  if (token) {
    testPass('Token exists in localStorage');
    console.log('Token:', token.substring(0, 50) + '...');
  } else {
    testFail('No token in localStorage');
  }
  
  if (user) {
    testPass('User data exists in localStorage');
    const userData = JSON.parse(user);
    console.log('User:', userData);
  } else {
    testFail('No user data in localStorage');
  }
}

/**
 * Test 2: Clear all auth storage
 */
function clearAuthStorage() {
  testHeader('Test: Clear Auth Storage');
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  
  if (!localStorage.getItem('authToken') && !localStorage.getItem('authUser')) {
    testPass('Auth storage cleared');
  } else {
    testFail('Failed to clear auth storage');
  }
}

/**
 * Test 3: Corrupt the token (test error handling)
 */
function corruptToken() {
  testHeader('Test: Corrupt Token');
  
  const token = localStorage.getItem('authToken');
  if (token) {
    localStorage.setItem('authToken', 'invalid-corrupted-token-' + Date.now());
    testPass('Token corrupted. Refresh page or make API call to trigger error handling');
  } else {
    testFail('No token to corrupt');
  }
}

/**
 * Test 4: Restore valid token (for testing)
 */
function restoreAuthStorage() {
  testHeader('Test: Restore Auth Storage');
  
  testInfo('Copy your valid token from Network tab or a working session');
  testInfo('Then run: localStorage.setItem("authToken", "your-token-here");');
}

// ============================================
// API TESTS
// ============================================

/**
 * Test 5: Check auth headers on API call
 */
async function checkAuthHeaders() {
  testHeader('Test: Check Auth Headers');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    const data = await response.json();
    
    if (response.status === 200) {
      testPass('Auth header accepted by server');
      console.log('User data from server:', data);
    } else if (response.status === 401) {
      testFail('Server rejected auth token (401 Unauthorized)');
      testInfo('Token may be expired. Please log in again.');
    } else {
      testFail(`Server returned ${response.status}`);
    }
  } catch (error) {
    testFail(`Request failed: ${error.message}`);
  }
}

/**
 * Test 6: Simulate login request
 */
async function simulateLogin(email, password) {
  testHeader('Test: Simulate Login');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.status === 200) {
      testPass('Login successful');
      console.log('Response:', data);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      testInfo('Token and user saved to localStorage');
    } else {
      testFail(`Login failed: ${data.error}`);
    }
  } catch (error) {
    testFail(`Request failed: ${error.message}`);
  }
}

/**
 * Test 7: Validate JWT token format
 */
function validateTokenFormat() {
  testHeader('Test: Validate Token Format');
  
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    testFail('No token found in localStorage');
    return;
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    testFail(`Invalid token format. Expected 3 parts, got ${parts.length}`);
    return;
  }
  
  testPass('Token has valid JWT format (3 parts)');
  
  try {
    // Decode header
    const header = JSON.parse(atob(parts[0]));
    testPass(`Header: ${JSON.stringify(header)}`);
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    testPass(`Payload: ${JSON.stringify(payload)}`);
    
    if (payload.exp) {
      const expiryDate = new Date(payload.exp * 1000);
      const now = new Date();
      if (expiryDate > now) {
        testPass(`Token expires at: ${expiryDate.toLocaleString()}`);
      } else {
        testFail(`Token expired at: ${expiryDate.toLocaleString()}`);
      }
    }
  } catch (error) {
    testFail(`Failed to decode token: ${error.message}`);
  }
}

// ============================================
// SESSION PERSISTENCE TESTS
// ============================================

/**
 * Test 8: Simulate page refresh (session restoration)
 */
function testSessionRestore() {
  testHeader('Test: Session Restoration');
  
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');
  
  if (token && user) {
    testPass('Token and user data available for session restoration');
    testInfo('The app should automatically restore session on page load');
    testInfo('Try: Press F5 to refresh page');
    testInfo('Expected: Remain logged in without re-entering credentials');
  } else {
    testFail('Cannot test session restoration - no auth data found');
  }
}

/**
 * Test 9: Check Redux auth state (if Redux DevTools available)
 */
function checkReduxState() {
  testHeader('Test: Check Redux State');
  
  // Check if Redux DevTools extension is available
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    testPass('Redux DevTools extension detected');
    testInfo('Open Redux tab in DevTools to view auth state');
  } else {
    testInfo('Redux DevTools extension not installed');
    testInfo('Install Redux DevTools browser extension to debug Redux state');
  }
}

// ============================================
// MULTI-USER TESTS
// ============================================

/**
 * Test 10: Simulate user switch (logout and login different user)
 */
async function testUserSwitch(newEmail, newPassword) {
  testHeader('Test: User Switch');
  
  const currentUser = localStorage.getItem('authUser');
  console.log('Current user:', JSON.parse(currentUser));
  
  // Clear auth
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  testPass('Logged out current user');
  
  // Log in new user
  await simulateLogin(newEmail, newPassword);
  
  const newUser = localStorage.getItem('authUser');
  if (newUser) {
    const userData = JSON.parse(newUser);
    console.log('New user logged in:', userData);
    testPass('User switched successfully');
  }
}

/**
 * Test 11: Multi-tab detection
 */
function checkMultiTab() {
  testHeader('Test: Multi-Tab Detection');
  
  const windowName = 'dating-app-test-' + Date.now();
  testInfo(`Open this app in another tab/window`);
  testInfo(`Expected: Both tabs share the same localStorage`);
  testInfo(`Expected: Logout in one tab affects other tabs`);
}

// ============================================
// PASSWORD VALIDATION TESTS
// ============================================

/**
 * Test 12: Check password strength requirements
 */
function validatePasswordStrength(password) {
  testHeader(`Test: Password Strength - "${password}"`);
  
  const requirements = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    length: password.length >= 8
  };
  
  if (requirements.uppercase) testPass('Has uppercase letter');
  else testFail('Missing uppercase letter');
  
  if (requirements.lowercase) testPass('Has lowercase letter');
  else testFail('Missing lowercase letter');
  
  if (requirements.number) testPass('Has number');
  else testFail('Missing number');
  
  if (requirements.special) testPass('Has special character');
  else testFail('Missing special character');
  
  if (requirements.length) testPass('Length >= 8 characters');
  else testFail('Too short (< 8 characters)');
  
  const isValid = Object.values(requirements).every(req => req);
  console.log('%c' + (isValid ? '✓ PASSWORD VALID' : '✗ PASSWORD INVALID'), 
    `color: ${isValid ? 'green' : 'red'}; font-weight: bold; font-size: 16px;`);
}

// ============================================
// CONVENIENCE HELPERS
// ============================================

/**
 * Print all available test functions
 */
function help() {
  testHeader('Available Test Functions');
  
  console.log(`
%cStorage Tests:
  checkAuthStorage() - Check if token and user are stored
  clearAuthStorage() - Clear all auth data from localStorage
  corruptToken() - Corrupt token to test error handling
  
%cAPI Tests:
  checkAuthHeaders() - Verify auth headers are sent correctly
  simulateLogin(email, password) - Test login endpoint
  validateTokenFormat() - Check JWT token structure
  
%cSession Tests:
  testSessionRestore() - Test session restoration on refresh
  checkReduxState() - Check Redux auth state
  
%cMulti-User Tests:
  testUserSwitch(email, password) - Test logging in as different user
  checkMultiTab() - Test multi-tab session sharing
  
%cPassword Tests:
  validatePasswordStrength(password) - Check if password meets requirements
  
%cQuick Test Users:
  susan.spinoza0@datingapp.com / Password1!
  james.smith0@datingapp.com / Password1!
  michael.jones1@datingapp.com / Password2!
  `, 'color: blue; font-weight: bold;');
}

// ============================================
// QUICK START
// ============================================

console.log('%c===========================================', 'color: green; font-size: 16px; font-weight: bold;');
console.log('%cAUTHENTICATION TESTING SCRIPT LOADED', 'color: green; font-size: 16px; font-weight: bold;');
console.log('%c===========================================', 'color: green; font-size: 16px; font-weight: bold;');
console.log('\nType help() to see all available test functions\n');

// ============================================
// TEST SUITES
// ============================================

/**
 * Run all basic tests
 */
async function runBasicTests() {
  testHeader('Running: Basic Test Suite');
  checkAuthStorage();
  validateTokenFormat();
  checkReduxState();
  await checkAuthHeaders();
}

/**
 * Run all session tests
 */
function runSessionTests() {
  testHeader('Running: Session Test Suite');
  checkAuthStorage();
  testSessionRestore();
  testInfo('Now press F5 to refresh and verify session persists');
}

/**
 * Run all password validation tests
 */
function runPasswordTests() {
  testHeader('Running: Password Validation Test Suite');
  
  // Test valid password
  validatePasswordStrength('ValidPass123!');
  console.log('');
  
  // Test invalid passwords
  validatePasswordStrength('validpass123!');  // no uppercase
  console.log('');
  
  validatePasswordStrength('VALIDPASS123!');  // no lowercase
  console.log('');
  
  validatePasswordStrength('ValidPass!');     // no number
  console.log('');
  
  validatePasswordStrength('ValidPass123');   // no special char
  console.log('');
  
  validatePasswordStrength('Pass1!');         // too short
}

// Export functions for global use
window.auth_test = {
  // Storage
  checkAuthStorage,
  clearAuthStorage,
  corruptToken,
  
  // API
  checkAuthHeaders,
  simulateLogin,
  validateTokenFormat,
  
  // Session
  testSessionRestore,
  checkReduxState,
  
  // Multi-user
  testUserSwitch,
  checkMultiTab,
  
  // Password
  validatePasswordStrength,
  
  // Helpers
  help,
  
  // Test suites
  runBasicTests,
  runSessionTests,
  runPasswordTests
};

console.log('All functions available under window.auth_test');
