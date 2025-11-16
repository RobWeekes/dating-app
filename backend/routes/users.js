const express = require('express');
const router = express.Router();
const { User, Questionnaire, Preference } = require('../models');

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

// CREATE new user
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
      firstName,
      lastName,
      age,
      bio,
      location,
      profilePhotoUrl
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { email, firstName, lastName, age, bio, location, profilePhotoUrl } = req.body;

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
      profilePhotoUrl: profilePhotoUrl || user.profilePhotoUrl
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
  try {
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
