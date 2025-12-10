const express = require('express');
const router = express.Router();
const { User, Questionnaire, Preference } = require('../models');
const { authenticateToken, optionalAuthenticateToken } = require('../middleware/authentication');

// GET matching users for discovery (filtered by current user's preferences)
router.get('/discover/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get current user's preferences
    const userPreferences = await Preference.findOne({ where: { userId } });
    if (!userPreferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }

    // Get current user
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all other users with their questionnaires and preferences
    const allUsers = await User.findAll({
      where: { id: { [require('sequelize').Op.ne]: userId } },
      attributes: { exclude: ['password'] },
      include: [
        { model: Questionnaire, attributes: ['id', 'personalityType', 'datingGoal', 'interests'] },
        { model: Preference, attributes: ['id', 'interests', 'relationshipType'] }
      ]
    });

    // Filter users based on preferences
    const matchingUsers = allUsers.filter(user => {
      // Check age range
      if (user.age < userPreferences.minAge || user.age > userPreferences.maxAge) {
        return false;
      }

      // Check relationship type if user has specified a preference
      if (userPreferences.relationshipType && userPreferences.relationshipType !== 'Any') {
        if (user.Preference && user.Preference.relationshipType !== userPreferences.relationshipType) {
          return false;
        }
      }

      return true;
    });

    res.json(matchingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Questionnaire, attributes: ['id', 'personalityType', 'datingGoal'] },
        { model: Preference, attributes: ['id', 'minAge', 'maxAge', 'location'] }
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Questionnaire },
        { model: Preference }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new user (deprecated - use /auth/register instead)
router.post('/', async (req, res) => {
  try {
    const { email, firstName, lastName, age, bio, location, profilePhotoUrl } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const user = await User.create({
      email,
      password: 'temp_password', // Default password, user should change via auth
      firstName,
      lastName,
      age,
      bio,
      location,
      profilePhotoUrl
    });

    res.status(201).json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE user by ID (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: Can only update your own profile' });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { 
      email, 
      firstName, 
      lastName, 
      age, 
      bio, 
      location, 
      profilePhotoUrl,
      bodyType,
      bmi,
      politics,
      religion,
      ethnicity,
      family,
      familyGoals
    } = req.body;

    // Check if new email already exists (if email is being changed)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    await user.update({
      email: email || user.email,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      age: age || user.age,
      bio: bio || user.bio,
      location: location || user.location,
      profilePhotoUrl: profilePhotoUrl || user.profilePhotoUrl,
      bodyType: bodyType || user.bodyType,
      bmi: bmi || user.bmi,
      politics: politics || user.politics,
      religion: religion || user.religion,
      ethnicity: ethnicity || user.ethnicity,
      family: family || user.family,
      familyGoals: familyGoals || user.familyGoals
    });

    res.json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user by ID (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only delete their own account
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: Can only delete your own account' });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
