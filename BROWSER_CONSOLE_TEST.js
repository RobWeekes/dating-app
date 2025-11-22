// Frontend-Backend Integration Test Script
// Copy and paste this into your browser's Developer Tools Console

// Test 1: Fetch a user from the API
console.log('=== TEST 1: Fetching User Data ===');
fetch('http://localhost:3001/api/users/1')
  .then(res => res.json())
  .then(user => {
    console.log('✓ User fetched successfully:', user);
    window.testUser = user; // Store in window for later use
  })
  .catch(err => console.error('✗ Error fetching user:', err));

// Test 2: Update a user's profile
setTimeout(() => {
  console.log('\n=== TEST 2: Updating User Profile ===');
  
  const updateData = {
    firstName: 'UpdatedName',
    age: 32,
    bio: 'Updated bio from browser console!',
    location: 'Santa Monica, Los Angeles, CA'
  };

  fetch('http://localhost:3001/api/users/1', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  })
    .then(res => res.json())
    .then(updatedUser => {
      console.log('✓ User updated successfully:', updatedUser);
      window.updatedUser = updatedUser;
    })
    .catch(err => console.error('✗ Error updating user:', err));
}, 1000);

// Test 3: Verify the update
setTimeout(() => {
  console.log('\n=== TEST 3: Verifying Update ===');
  fetch('http://localhost:3001/api/users/1')
    .then(res => res.json())
    .then(user => {
      console.log('✓ Current user data:', user);
      console.log('✓ Name updated:', user.firstName === 'UpdatedName');
      console.log('✓ Age updated:', user.age === 32);
      console.log('✓ Bio updated:', user.bio === 'Updated bio from browser console!');
    })
    .catch(err => console.error('✗ Error verifying update:', err));
}, 3000);

console.log('\n📝 Note: Results will appear below. Check each test result.');
