# Discovery Feature - Implementation Details

## Complete Feature Overview

The Discovery page is a full-featured browsing interface that allows users to explore potential matches based on their preferences. It combines backend filtering with a beautiful, responsive frontend interface.

## Backend Architecture

### Discovery Endpoint: `/users/discover/:userId`

**File**: `backend/routes/users.js` (50+ lines added)

**Algorithm**:

1. Fetch current user's preferences from database
2. Query all users except current user
3. Include their Questionnaire and Preference data
4. Filter based on:
   - Age range (minAge ≤ user.age ≤ maxAge)
   - Relationship type (if not 'Any')
5. Return filtered array

**Code Flow**:

```
Request: GET /users/discover/1
  ↓
Fetch Preferences for user 1
  ↓
Get all users (excluding user 1) with relationships
  ↓
Filter by age: 25 ≤ age ≤ 35 ✓
Filter by relationship: 'Monogamous' ✓
  ↓
Return matching users array
```

**Database Queries**:

- Preference.findOne({ where: { userId } }) - Get user preferences
- User.findByPk(userId) - Get current user
- User.findAll({ where: { id: { Op.ne: userId } }, include: [...] }) - Get other users

**Performance**: O(n) filtering where n = total users in system

### Matching Logic

```javascript
// Age range validation
if (user.age < userPreferences.minAge || user.age > userPreferences.maxAge) {
  return false; // User outside age range
}

// Relationship type validation
if (
  userPreferences.relationshipType &&
  userPreferences.relationshipType !== "Any"
) {
  const userRelationshipType = user.Preference?.relationshipType;
  if (userRelationshipType !== userPreferences.relationshipType) {
    return false; // Relationship type mismatch
  }
}

return true; // All checks passed, user matches!
```

### Data Returned Per User

```javascript
{
  id: 2,
  email: 'sarah@example.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  age: 27,
  bio: 'Adventure seeker and coffee enthusiast',
  location: 'New York, NY',
  profilePhotoUrl: 'https://i.pravatar.cc/150?img=1',
  createdAt: '2025-11-22...',
  updatedAt: '2025-11-22...',
  Questionnaire: {
    id: 1,
    userId: 2,
    personalityType: 'Ambivert',
    datingGoal: 'Long-term relationship',
    interests: ['Travel', 'Fitness', 'Art & Music'],
    responses: { ... }
  },
  Preference: {
    id: 1,
    userId: 2,
    minAge: 25,
    maxAge: 35,
    location: null,
    locationRadius: 50,
    interests: ['Travel', 'Fitness'],
    relationshipType: 'Monogamous'
  }
}
```

## Frontend Architecture

### Component Structure: `Discovery.js` (440+ lines)

#### State Management (Redux)

```javascript
discoveryState = {
  users: [], // Array of matching users
  currentIndex: 0, // Current card index
  isLoading: false, // Loading state
  error: null, // Error message
  likes: [], // Array of liked user IDs
  passes: [], // Array of passed user IDs
};
```

#### Component Hooks

**useEffect - Load Discovery Users**:

- Dependency: `[userProfile?.id]`
- Runs on mount and user change
- Calls `getDiscoveryUsers(userProfile.id)`
- Dispatches `setUsers()` action
- Handles errors with user-friendly message

**useState - Local Loading**:

- `isLoadingUsers` - For initial data load UI

#### Key Functions

**handleLike(userId)**:

- Adds userId to Redux likes array
- Increments currentIndex
- Triggers component re-render with next user
- No API call (likes stored locally for now)

**handlePass(userId)**:

- Adds userId to Redux passes array
- Increments currentIndex
- Triggers component re-render with next user

#### Render States

1. **Loading** (isLoadingUsers = true):

   - Spinner animation
   - "Loading users..." message

2. **Error** (error message exists):

   - Error message display
   - "Set Preferences" button link

3. **No Users** (users.length = 0):

   - "No users found" message
   - "Update Preferences" button

4. **Completion** (currentIndex >= users.length):

   - Congratulations message
   - Stats: Like count, Pass count
   - "Back to Profile" button

5. **Browse** (normal state):
   - User card display
   - Like/Pass buttons
   - Progress bar

### User Card Component Structure

```
UserCard
├── CardImage
│   ├── Image (profile photo)
│   └── Gradient Overlay
├── CardContent
│   ├── Header (Name + Age badge)
│   ├── Location (📍)
│   ├── Bio
│   ├── QuestionnaireInfo
│   │   ├── Personality type
│   │   ├── Dating goal
│   │   └── Interests (tags)
│   └── PreferenceInfo
│       ├── Relationship type
│       └── Their interests (tags)
```

**Card Styling**:

- 100% width, 600px height (responsive)
- 55% image, 45% content
- Smooth slide-in animation (400ms)
- Hover effect on image (zoom 1.02)
- Box shadow for depth

### Redux Slice: `discoverySlice.js`

**Reducers**:

- `setUsers(state, action)` - Set matching users array
- `setLoading(state, action)` - Set loading state
- `setError(state, action)` - Set error message
- `likeUser(state, action)` - Add to likes, increment index
- `passUser(state, action)` - Add to passes, increment index
- `resetDiscovery(state)` - Clear all state

**No async thunks** - All async handling in component

### API Service: `getDiscoveryUsers(userId)`

**Function**:

```javascript
export const getDiscoveryUsers = async (userId) => {
  return fetchAPI(`/users/discover/${userId}`);
};
```

**Request**: `GET /api/users/discover/:userId`
**Response**: Array of user objects
**Error Handling**: Throws error caught by component

### Responsive Design Strategy

**Breakpoints**:

- Desktop (>768px): Full 600px card width
- Tablet (600-768px): Adjusted spacing
- Mobile (<600px): 2-column grid for interests, full-width buttons

**Key Responsive Changes**:

1. Card height reduces on mobile (600px → 500px)
2. Button stacking and sizing
3. Interest badges smaller on mobile
4. Info sections reduced padding
5. Navigation fixed positioning adjusts

**Mobile Optimizations**:

- Touch-friendly button sizes (min 44px height)
- Font sizes scale down
- Content becomes scrollable on small screens
- Progress bar stays visible at bottom

## CSS Architecture: `discovery.css` (500+ lines)

### Key Sections

**Layout**:

- `.discovery-page` - Main flex container
- `.user-cards-container` - Card display area
- `.action-buttons` - Fixed bottom buttons

**Card Styling**:

- `.user-card` - Main card container
- `.card-image` - Photo section
- `.card-content` - Text section
- `.card-header` - Name + age
- `.questionnaire-info` - What they're looking for
- `.preference-info` - Their preferences

**Interactive Elements**:

- `.btn-like` - Like button (pink)
- `.btn-pass` - Pass button (gray)
- Button hover effects with scale transform
- Active state with scale down

**States**:

- `.loading-spinner` - Loading animation
- `.error-container` - Error display
- `.no-users-container` - Empty state
- `.no-more-users-container` - Completion state

**Animations**:

- `slideInCard` - Card entrance (400ms)
- `spin` - Spinner rotation (continuous)
- Hover transforms on buttons
- Smooth transitions on all interactive elements

### Design System Integration

Colors used:

- Primary: `var(--primary-color, #ff6b6b)` (pink/red)
- Text dark: `var(--text-dark, #333)`
- Text muted: `var(--text-muted, #999)`
- Border: `var(--border-color, #e0e0e0)`

## State Flow Diagram

```
User navigates to /discover
        ↓
Component mounts, useEffect runs
        ↓
getDiscoveryUsers(userProfile.id) API call
        ↓
Backend filters users by preferences
        ↓
dispatch(setUsers(matchingUsers))
        ↓
Redux state updated: users = [...]
        ↓
Component renders user card at currentIndex
        ↓
User clicks Like ↔️ User clicks Pass
        ↓
dispatch(likeUser/passUser(userId))
        ↓
currentIndex++
        ↓
Component re-renders with next user
        ↓
Repeat until currentIndex >= users.length
        ↓
Show completion screen with stats
```

## Error Handling Strategy

**Scenario 1: No Preferences Set**

- API returns: `{ error: "User preferences not found" }`
- Component catches error
- Shows: "Failed to load users. Please check your preferences."
- Button: Navigate to `/preferences`

**Scenario 2: No Matching Users**

- API returns: `[]` (empty array)
- Component detects: `users.length === 0`
- Shows: "No users matching your preferences"
- Suggests: Update preferences

**Scenario 3: API Network Error**

- fetch() throws error
- Caught in try/catch
- Shows generic error message
- Button to retry or update preferences

**Scenario 4: User ID Invalid**

- `userProfile?.id` is falsy
- useEffect doesn't run
- Component shows loading state indefinitely (edge case - shouldn't happen with auth)

## Performance Considerations

**Initial Load**:

- Single API call for all users
- Backend filters in one query
- No pagination (suitable for <500 users)

**Memory**:

- All users stored in Redux
- No cleanup needed on unmount
- Likes/passes stored in memory (not persisted)

**Re-renders**:

- Only re-render on Redux state change
- Like/Pass actions increment index
- Next user card appears with animation

**Optimization Opportunities** (Future):

- Implement pagination (show 10 at a time)
- Cache filtered results
- Virtual scrolling for large lists
- Persist likes/passes to backend

## Integration with Other Features

**Depends On**:

- ✅ User Profile (user ID)
- ✅ Preferences (filtering criteria)
- ✅ Questionnaire (user data for display)

**Used By**:

- 🔄 Matches (mutual likes - future feature)
- 💬 Messaging (matched users - future feature)

## Testing Checklist

**Unit Testing** (Future):

- [ ] Reducer functions update state correctly
- [ ] API function makes correct request
- [ ] Filter logic works with various data

**Integration Testing** (Manual):

- [x] Load Discovery with existing preferences
- [x] Like/Pass buttons update card
- [x] Progress bar advances
- [x] Completion screen shows after all users

**E2E Testing** (Manual):

- [x] Set preferences → Navigate to discover → Browse users
- [x] Error states display correctly
- [x] Mobile layout responsive
- [x] Stats track correctly

## Files Modified Summary

| File                                        | Changes                | Lines |
| ------------------------------------------- | ---------------------- | ----- |
| backend/routes/users.js                     | Add /discover endpoint | +50   |
| frontend/src/pages/Discovery.js             | New component          | 440+  |
| frontend/src/redux/slices/discoverySlice.js | New slice              | 60    |
| frontend/src/redux/store.js                 | Add reducer            | +2    |
| frontend/src/services/api.js                | Add function           | +10   |
| frontend/src/routes/index.js                | Add route              | +6    |
| frontend/src/components/Layout.js           | Add nav link           | +1    |
| frontend/src/styles/discovery.css           | New styling            | 500+  |

**Total New Code**: ~1,100+ lines

## Architecture Alignment

Discovery follows established patterns from Profile, Questionnaire, and Preferences:

✅ Redux Slice for state
✅ API service functions
✅ React Component with hooks
✅ Dedicated CSS file
✅ Route integration
✅ Navigation link
✅ Error handling
✅ Loading states

**Consistency ensures**:

- Code is maintainable
- New developers can understand patterns
- Easy to add similar features

## Next Phase Opportunities

1. **Match System**

   - Store likes in database
   - Create Likes/Interactions model
   - Detect mutual likes
   - Show matches page

2. **Messaging**

   - Real-time chat for matched users
   - Message history
   - Notifications

3. **Advanced Features**

   - Undo last action
   - View profile without liking
   - Block/report users
   - Advanced filters

4. **Performance**
   - Pagination instead of loading all
   - Lazy load images
   - Virtual scrolling

## Deployment Notes

**Requirements**:

- Frontend: React 19.2.0, Redux Toolkit 2.10.1
- Backend: Node.js, Express, Sequelize
- Database: SQLite with User, Preference, Questionnaire tables

**Environment Variables**:

- Backend: PORT (default 3001), DATABASE_URL
- Frontend: REACT_APP_API_URL (default http://localhost:3001)

**Testing Before Deploy**:

1. Verify backend is running
2. Test with multiple user accounts
3. Verify preferences filtering works
4. Test mobile responsiveness
5. Clear Redux state and test fresh load
