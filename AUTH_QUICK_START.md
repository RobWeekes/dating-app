# Authentication System - Quick Start Guide

## Setup (2 minutes)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:
```
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 3. Start Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm start
# Server running on http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm start
# App running on http://localhost:3000
```

---

## Testing the Auth System (5 minutes)

### Test 1: Register New User

1. Open `http://localhost:3000`
2. Should redirect to `/register` (or click "Create new account")
3. Fill in the form:
   - Email: `testuser@example.com`
   - First Name: `Test`
   - Last Name: `User`
   - Age: `25`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Create Account"
5. Should redirect to `/profile`
6. **Success!** ✅

### Test 2: Login with Credentials

1. Navigate to `/logout` (or click Logout button)
2. Should redirect to `/login`
3. Enter credentials:
   - Email: `testuser@example.com`
   - Password: `password123`
4. Click "Sign In"
5. Should redirect to `/profile`
6. **Success!** ✅

### Test 3: Check Token in LocalStorage

1. Open DevTools (`F12`)
2. Go to **Application** → **Local Storage** → `http://localhost:3000`
3. You should see two keys:
   - `authToken` - Your JWT token (long string)
   - `authUser` - Your user data (JSON)
4. **Success!** ✅

### Test 4: Protected Routes

1. Try accessing `/profile`, `/discover`, `/preferences` - should work
2. Open console (DevTools)
3. Clear localStorage manually: `localStorage.clear()`
4. Refresh page - should redirect to `/login`
5. **Success!** ✅

### Test 5: Invalid Login

1. Go to `/login`
2. Try these scenarios:

   **a) Wrong email:**
   - Email: `wrong@example.com`
   - Password: `password123`
   - Should show: "Invalid email or password"

   **b) Wrong password:**
   - Email: `testuser@example.com`
   - Password: `wrongpassword`
   - Should show: "Invalid email or password"

   **c) Empty fields:**
   - Leave one field empty
   - Should show: "Email and password are required"

6. **Success!** ✅

---

## API Testing with cURL

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@example.com",
    "password": "password123",
    "passwordConfirm": "password123",
    "firstName": "Curl",
    "lastName": "Test",
    "age": 30
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "curl@example.com",
    "firstName": "Curl",
    "lastName": "Test",
    "age": 30
  }
}
```

### Login User

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@example.com",
    "password": "password123"
  }'
```

**Save the token from response** (you'll need it next)

### Get Current User (Protected Route)

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Invalid Token

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response:**
```json
{
  "error": "Invalid or expired token"
}
```

---

## Key Features to Test

### ✅ Password Hashing
- Register a user, go to database
- Check `users` table
- Password should NOT be readable text
- Should be a hash like: `$2a$10$...`

### ✅ Session Persistence
1. Register/login
2. Close browser completely
3. Reopen `http://localhost:3000`
4. Should still be logged in
5. Close DevTools and refresh
6. Should still be logged in

### ✅ Auto-Logout on Token Expiration
1. Manually delete `authToken` from localStorage
2. Try to access any page
3. Should redirect to `/login`

### ✅ Form Validation

**Registration:**
- Try email without @ sign
- Try password < 6 characters
- Try passwords that don't match
- Try empty required fields
- All should show error messages

**Login:**
- Try empty email
- Try empty password
- Should show "Email and password are required"

---

## Common Issues

### Issue: "Cannot POST /api/auth/register"
- Backend not running
- Check backend server is on `localhost:3001`
- Look for connection error in console

### Issue: "Invalid email or password" on registration
- Email already exists
- Try different email address
- Check database for existing users

### Issue: Tokens not saving in localStorage
- Browser localStorage disabled
- Private/Incognito mode
- Browser restrictions
- Try regular mode

### Issue: Keep redirecting to /login
- Token expired
- localStorage cleared
- Invalid token
- Backend JWT_SECRET mismatch

### Issue: "JWT_SECRET undefined"
- `.env` file not created
- `.env` not in backend directory
- Need to restart backend after creating `.env`

---

## Database Check

If using SQLite (default):

```bash
# Open database
sqlite3 backend/dating_app.db

# List users
SELECT id, email, firstName, lastName, createdAt FROM users;

# Exit
.exit
```

You should see registered users.

---

## Next: Use the App!

After authentication works:

1. **Complete Your Profile**
   - Go to `/profile`
   - Click Edit and fill in details
   - Add a profile photo URL

2. **Fill Questionnaire**
   - Go to `/questionnaire/select`
   - Pick casual or long-term
   - Complete the questionnaire

3. **Set Preferences**
   - Go to `/preferences`
   - Set age range, interests, etc.

4. **Browse Matches**
   - Go to `/discover`
   - Like or pass on users

---

## Troubleshooting Checklist

- [ ] Node version 14+? (`node --version`)
- [ ] Both `npm install` commands run successfully?
- [ ] Backend server starting? (`npm start` in backend)
- [ ] Frontend server starting? (`npm start` in frontend)
- [ ] `.env` file created in backend?
- [ ] Can access `http://localhost:3000`?
- [ ] Can see login/register forms?
- [ ] Can register successfully?
- [ ] Can login with registered credentials?
- [ ] Token visible in localStorage?

---

## Success Criteria ✅

Auth system is working when:
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token stored in localStorage
- [ ] Can access protected pages
- [ ] Gets redirected to /login when logged out
- [ ] Wrong credentials show error
- [ ] Form validation works
- [ ] Can logout

**That's it! You now have a fully functional authentication system! 🎉**
